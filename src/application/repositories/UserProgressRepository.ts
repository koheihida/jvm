import { UserProgress } from '../domain/entities/UserProgress';

/**
 * User Progress Repository Interface
 * データの永続化とアクセスの抽象化
 */
export interface UserProgressRepository {
  /**
   * ユーザーの学習進捗を取得
   */
  get(): Promise<UserProgress>;

  /**
   * ユーザーの学習進捗を保存
   */
  save(progress: UserProgress): Promise<void>;

  /**
   * 学習進捗をリセット
   */
  reset(): Promise<void>;

  /**
   * 学習進捗が存在するかチェック
   */
  exists(): Promise<boolean>;
}