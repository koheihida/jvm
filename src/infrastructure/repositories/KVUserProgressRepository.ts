import { useKV } from '@github/spark/hooks';
import { UserProgressRepository } from '../../application/repositories/UserProgressRepository';
import { UserProgress } from '../../domain/entities/UserProgress';

/**
 * KV Storage実装のユーザー進捗リポジトリ
 * Sparkランタイムのkey-valueストレージを使用
 */
export class KVUserProgressRepository implements UserProgressRepository {
  private static readonly STORAGE_KEY = 'jvm-learning-progress';

  constructor(
    private readonly getValue: () => any,
    private readonly setValue: (value: any) => void,
    private readonly deleteValue: () => void
  ) {}

  /**
   * Reactフック版のファクトリーメソッド
   */
  static createWithHook(): [KVUserProgressRepository, any] {
    const [value, setValue, deleteValue] = useKV(
      KVUserProgressRepository.STORAGE_KEY,
      null
    );

    const repository = new KVUserProgressRepository(
      () => value,
      setValue,
      deleteValue
    );

    return [repository, value]; // valueはReactの再レンダリング用
  }

  async get(): Promise<UserProgress> {
    try {
      const storedData = this.getValue();
      
      if (!storedData) {
        return UserProgress.create();
      }

      // レガシーフォーマットとの互換性を保つ
      if (this.isLegacyFormat(storedData)) {
        return this.migrateLegacyFormat(storedData);
      }

      return UserProgress.fromSerializable(storedData);
    } catch (error) {
      console.warn('Failed to load user progress, creating new:', error);
      return UserProgress.create();
    }
  }

  async save(progress: UserProgress): Promise<void> {
    try {
      const serializable = progress.toSerializable();
      this.setValue(serializable);
    } catch (error) {
      throw new Error(`Failed to save user progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async reset(): Promise<void> {
    try {
      this.deleteValue();
    } catch (error) {
      throw new Error(`Failed to reset user progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async exists(): Promise<boolean> {
    const storedData = this.getValue();
    return storedData !== null && storedData !== undefined;
  }

  /**
   * レガシーフォーマットの検出
   */
  private isLegacyFormat(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      (Array.isArray(data.completedTopics) || data.completedTopics instanceof Set) &&
      !data.lastAccessed
    );
  }

  /**
   * レガシーフォーマットからの移行
   */
  private migrateLegacyFormat(legacyData: any): UserProgress {
    try {
      return UserProgress.create({
        completedTopics: legacyData.completedTopics,
        currentModule: legacyData.currentModule,
        currentTopic: legacyData.currentTopic,
        notes: legacyData.notes || {},
        lastAccessed: new Date() // 移行時の時刻を設定
      });
    } catch (error) {
      console.warn('Failed to migrate legacy format, creating new progress:', error);
      return UserProgress.create();
    }
  }
}