const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to interface with Google Gemini API
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    this.client = null;
    
    // Model fallback chain prioritized by active availability:
    // 1. gemini-3.5-flash-lite (high speed, stable, generous quota)
    // 2. gemini-flash-latest (auto-updates to latest stable flash)
    // 3. gemini-3-flash-preview
    // 4. gemini-3.8-flash
    this.candidateModels = [
      process.env.GEMINI_MODEL,
      'gemini-3.5-flash-lite',
      'gemini-flash-latest',
      'gemini-3-flash-preview',
      'gemini-3.8-flash',
    ].filter(Boolean);

    // Keep unique models
    this.candidateModels = [...new Set(this.candidateModels)];
    this.activeModel = this.candidateModels[0];

    this.initClient();
  }

  initClient() {
    this.apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    if (this.apiKey) {
      try {
        this.client = new GoogleGenerativeAI(this.apiKey);
      } catch (err) {
        console.error('[GeminiService] Error initializing client:', err.message);
        this.client = null;
      }
    } else {
      this.client = null;
    }
  }

  isConfigured() {
    if (!this.apiKey && process.env.GEMINI_API_KEY) {
      this.initClient();
    }
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  getModel(modelName, systemInstruction = null) {
    if (!this.isConfigured()) {
      throw new Error(
        'Gemini API Key is not configured. Please add your GEMINI_API_KEY in the server/.env file. You can obtain a key from https://aistudio.google.com/app/apikey'
      );
    }
    const options = { model: modelName };
    if (systemInstruction) {
      options.systemInstruction = systemInstruction;
    }
    return this.client.getGenerativeModel(options);
  }

  /**
   * Generates text content with automatic multi-model fallback
   */
  async generateContent(prompt, systemInstruction = null) {
    if (!this.isConfigured()) {
      throw new Error(
        'Gemini API Key is not configured. Please add your GEMINI_API_KEY in the server/.env file.'
      );
    }

    let lastError = null;

    // Try models in our candidate list
    for (const modelName of this.candidateModels) {
      try {
        const model = this.getModel(modelName, systemInstruction);
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        this.activeModel = modelName; // Save successful model for subsequent calls
        return text;
      } catch (err) {
        lastError = err;
        console.warn(`[GeminiService] Model "${modelName}" failed: ${err.message}. Trying next candidate...`);
        // If it's an invalid API key, no point in trying other models
        if (err.message.includes('API_KEY_INVALID') || err.message.includes('API key not valid')) {
          throw new Error('Invalid Gemini API key provided. Please verify your GEMINI_API_KEY in server/.env.');
        }
      }
    }

    // If all candidate models failed
    console.error('[GeminiService] All candidate models failed. Last error:', lastError?.message);
    throw new Error(
      lastError?.message || 'All available Gemini AI models failed to respond. Please check your network or API quota.'
    );
  }

  /**
   * Generates JSON structured content
   */
  async generateStructuredContent(prompt, systemInstruction = null) {
    const jsonInstruction =
      (systemInstruction || '') +
      '\nIMPORTANT: You must return ONLY raw valid JSON adhering strictly to the requested schema. Do not wrap in markdown codeblocks (no ```json ... ```), no conversational preambles, and no closing remarks.';

    const rawText = await this.generateContent(prompt, jsonInstruction);

    // Clean potential markdown fencing if returned
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim();
    }

    try {
      return JSON.parse(cleaned);
    } catch (parseError) {
      console.error('[GeminiService] Failed to parse JSON response:', cleaned);
      // Attempt to extract json object if surrounded by extra text
      const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (innerError) {
          // ignore
        }
      }
      throw new Error('AI returned an unparseable response. Please retry.');
    }
  }
}

module.exports = new GeminiService();
