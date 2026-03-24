import { DEFAULT_LLM_SETTINGS } from '../../shared/constants';
import type {
  AppLlmSettings,
  AuthUser,
  DictationHistoryEntry,
  DictionaryEntry,
  SnippetEntry,
} from '../../shared/types';
import { PrismaClient } from '../generated/prisma';

export class DatabaseService {
  private prisma: PrismaClient | null = null;

  getDefaultLlmSettings(): AppLlmSettings {
    return { ...DEFAULT_LLM_SETTINGS };
  }

  async initialize() {
    try {
      this.prisma = new PrismaClient({});
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  async createUser(email: string, username: string, passwordHash: string): Promise<AuthUser> {
    if (!this.prisma) throw new Error('Database not initialized');

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim();

    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }],
      },
      select: { id: true },
    });

    if (existing) {
      throw new Error('An account with this email or username already exists.');
    }

    const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    await this.prisma.user.create({
      data: {
        id,
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
      },
    });

    return { id, email: normalizedEmail, username: normalizedUsername };
  }

  async findUserByIdentifier(
    identifier: string
  ): Promise<(AuthUser & { passwordHash: string }) | null> {
    if (!this.prisma) throw new Error('Database not initialized');

    const normalizedIdentifier = identifier.trim().toLowerCase();
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedIdentifier }, { username: normalizedIdentifier }],
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      passwordHash: user.passwordHash,
    };
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    if (!this.prisma) throw new Error('Database not initialized');

    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  }

  async getUserById(userId: string): Promise<AuthUser | null> {
    if (!this.prisma) throw new Error('Database not initialized');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  async getUserLlmSettings(userId: string): Promise<AppLlmSettings> {
    if (!this.prisma) throw new Error('Database not initialized');

    const row = await this.prisma.userLlmSettings.findUnique({
      where: { userId },
    });

    if (!row) {
      return this.getDefaultLlmSettings();
    }

    return {
      ollamaBaseUrl: row.ollamaBaseUrl,
      ollamaModel: row.ollamaModel,
      ollamaTranslationModel: row.ollamaTranslationModel,
      ollamaPrompt: row.ollamaPrompt,
    };
  }

  async updateUserLlmSettings(userId: string, settings: AppLlmSettings): Promise<AppLlmSettings> {
    if (!this.prisma) throw new Error('Database not initialized');

    const nextSettings: AppLlmSettings = {
      ollamaBaseUrl: settings.ollamaBaseUrl.trim() || DEFAULT_LLM_SETTINGS.ollamaBaseUrl,
      ollamaModel: settings.ollamaModel.trim() || DEFAULT_LLM_SETTINGS.ollamaModel,
      ollamaTranslationModel:
        settings.ollamaTranslationModel.trim() || DEFAULT_LLM_SETTINGS.ollamaTranslationModel,
      ollamaPrompt: settings.ollamaPrompt,
    };

    const row = await this.prisma.userLlmSettings.upsert({
      where: { userId },
      create: {
        id: `llm_settings_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`,
        userId,
        ollamaBaseUrl: nextSettings.ollamaBaseUrl,
        ollamaModel: nextSettings.ollamaModel,
        ollamaTranslationModel: nextSettings.ollamaTranslationModel,
        ollamaPrompt: nextSettings.ollamaPrompt,
      },
      update: {
        ollamaBaseUrl: nextSettings.ollamaBaseUrl,
        ollamaModel: nextSettings.ollamaModel,
        ollamaTranslationModel: nextSettings.ollamaTranslationModel,
        ollamaPrompt: nextSettings.ollamaPrompt,
      },
    });

    return {
      ollamaBaseUrl: row.ollamaBaseUrl,
      ollamaModel: row.ollamaModel,
      ollamaTranslationModel: row.ollamaTranslationModel,
      ollamaPrompt: row.ollamaPrompt,
    };
  }

  async addToDictionary(word: string, category: string, userId: string): Promise<DictionaryEntry> {
    if (!this.prisma) throw new Error('Database not initialized');

    const result = await this.prisma.dictionary.upsert({
      where: { userId_word: { userId, word } },
      create: {
        userId,
        word,
        category,
      },
      update: {
        category,
        frequency: { increment: 1 },
        addedAt: new Date(),
      },
    });

    return {
      word: result.word,
      frequency: result.frequency,
      category: result.category,
      addedAt: result.addedAt,
    };
  }

  async getDictionary(userId: string): Promise<DictionaryEntry[]> {
    if (!this.prisma) throw new Error('Database not initialized');

    const rows = await this.prisma.dictionary.findMany({
      where: { userId },
      orderBy: { frequency: 'desc' },
    });

    return rows.map((row) => ({
      word: row.word,
      frequency: row.frequency,
      category: row.category,
      addedAt: row.addedAt,
    }));
  }

  async addSnippet(
    trigger: string,
    replacement: string,
    category: string,
    userId: string
  ): Promise<SnippetEntry> {
    if (!this.prisma) throw new Error('Database not initialized');

    const result = await this.prisma.snippet.create({
      data: {
        id: `snippet_${Date.now()}`,
        userId,
        trigger,
        replacement,
        category,
      },
    });

    return {
      id: result.id,
      trigger: result.trigger,
      replacement: result.replacement,
      category: result.category,
      createdAt: result.createdAt,
    };
  }

  async getSnippets(userId: string): Promise<SnippetEntry[]> {
    if (!this.prisma) throw new Error('Database not initialized');

    const rows = await this.prisma.snippet.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      id: row.id,
      trigger: row.trigger,
      replacement: row.replacement,
      category: row.category,
      createdAt: row.createdAt,
    }));
  }

  async deleteSnippet(id: string, userId: string): Promise<boolean> {
    if (!this.prisma) throw new Error('Database not initialized');

    const result = await this.prisma.snippet.deleteMany({
      where: { id, userId },
    });

    return result.count > 0;
  }

  async addDictation(
    text: string,
    language: string,
    userId: string
  ): Promise<DictationHistoryEntry> {
    if (!this.prisma) throw new Error('Database not initialized');

    const normalizedText = text.trim();
    if (!normalizedText) {
      throw new Error('Cannot save an empty dictation');
    }

    const id = `dictation_${Date.now()}`;
    await this.prisma.dictation.create({
      data: {
        id,
        userId,
        text: normalizedText,
        language,
        charCount: normalizedText.length,
      },
    });

    return {
      id,
      text: normalizedText,
      language,
      charCount: normalizedText.length,
      createdAt: new Date(),
    };
  }

  async getDictations(userId: string, limit = 50): Promise<DictationHistoryEntry[]> {
    if (!this.prisma) throw new Error('Database not initialized');

    const rows = await this.prisma.dictation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return rows.map((row) => ({
      id: row.id,
      text: row.text,
      language: row.language,
      charCount: row.charCount,
      createdAt: row.createdAt,
    }));
  }

  async deleteDictation(id: string, userId: string): Promise<boolean> {
    if (!this.prisma) throw new Error('Database not initialized');

    const result = await this.prisma.dictation.deleteMany({
      where: {
        id,
        userId,
      },
    });

    return result.count > 0;
  }

  async deleteAllDictations(userId: string): Promise<number> {
    if (!this.prisma) throw new Error('Database not initialized');

    const result = await this.prisma.dictation.deleteMany({
      where: { userId },
    });

    return result.count;
  }

  async close() {
    if (this.prisma) {
      await this.prisma.$disconnect();
      this.prisma = null;
    }
  }
}
