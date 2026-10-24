const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Service to interface with Google Gemini API
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : '';
    this.client = null;
    this.primaryModelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.fallbackModelName = 'gemini-2.0-flash';
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
    // Re-check in case .env was modified at runtime
    if (!this.apiKey && process.env.GEMINI_API_KEY) {
      this.initClient();
    }
    return Boolean(this.apiKey && this.apiKey.length > 5);
  }

  getModel(modelName = this.primaryModelName, systemInstruction = null) {
    if (!this.isConfigured()) {
      throw new Error(
        'Gemini API Key is not configured. Please add your GEMINI_API_KEY in the server/.env file. You can obtain a free key from https://aistudio.google.com/app/apikey'
      );
    }
    const options = { model: modelName };
    if (systemInstruction) {
      options.systemInstruction = systemInstruction;
    }
    return this.client.getGenerativeModel(options);
  }

  /**
   * Generates text content with automatic fallback if primary model is unavailable
   */
  async generateContent(prompt, systemInstruction = null) {
    try {
      const model = this.getModel(this.primaryModelName, systemInstruction);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (primaryError) {
      console.warn(`[GeminiService] Primary model (${this.primaryModelName}) failed: ${primaryError.message}. Trying fallback (${this.fallbackModelName})...`);
      try {
        const fallbackModel = this.getModel(this.fallbackModelName, systemInstruction);
        const result = await fallbackModel.generateContent(prompt);
        const response = await result.response;
        return response.text();
      } catch (fallbackError) {
        console.error('[GeminiService] Fallback also failed:', fallbackError.message);
        throw new Error(
          primaryError.message.includes('API_KEY_INVALID') || primaryError.message.includes('API key not valid')
            ? 'Invalid Gemini API key provided. Please check your GEMINI_API_KEY in server/.env.'
            : `AI service error: ${primaryError.message}`
        );
      }
    }
  }

  /**
   * Generates JSON structured content
   */
  async generateStructuredContent(prompt, systemInstruction = null) {
    const jsonInstruction = (systemInstruction || '') + '\nIMPORTANT: You must return ONLY raw valid JSON. Do not wrap in markdown codeblocks (no ```json ... ```), no preambles, and no closing remarks.';
    const rawText = await this.generateContent(prompt, jsonInstruction);
    
    // Clean potential markdown fencing if Gemini adds it
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
      throw new Error('AI returned an unparseable response. Please retry.');
    }
  }
}

module.exports = new GeminiService();
