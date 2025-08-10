import translate from 'google-translate-api-x';

export interface TranslationResult {
  text: string;
  from: {
    language: {
      iso: string;
    };
  };
  raw: string;
}

export class TranslationService {
  private static cache: Map<string, string> = new Map();

  static async translateWord(word: string, targetLanguage: string): Promise<string> {
    try {
      // Create a cache key
      const cacheKey = `${word}_${targetLanguage}`;
      
      // Check cache first
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      // Clean the word (remove punctuation and extra spaces)
      const cleanWord = word.trim().replace(/[.,!?;:()]/g, '');
      
      if (!cleanWord) {
        return word;
      }

      // Skip translation if target language is German (source language)
      if (targetLanguage === 'de') {
        return word;
      }

      // Perform translation
      const result: TranslationResult = await translate(cleanWord, { 
        from: 'de', 
        to: targetLanguage 
      });

      const translatedText = result.text || cleanWord;
      
      // Cache the result
      this.cache.set(cacheKey, translatedText);
      
      return translatedText;
    } catch (error) {
      console.warn('Translation failed:', error);
      return word; // Return original word if translation fails
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }

  static getCacheSize(): number {
    return this.cache.size;
  }
}
