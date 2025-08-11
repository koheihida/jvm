import { Topic } from './Topic';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

/**
 * Module Entity - モジュールのドメインモデル
 * トピックの集約ルートとして機能
 */
export class Module {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _topics: readonly Topic[],
    private readonly _difficulty: DifficultyLevel,
    private readonly _estimatedHours: number
  ) {
    this.validateModule();
  }

  public static create(data: {
    id: string;
    title: string;
    description: string;
    topics: Topic[];
    difficulty: DifficultyLevel;
    estimatedHours: number;
  }): Module {
    return new Module(
      data.id,
      data.title,
      data.description,
      Object.freeze([...data.topics]), // 不変性を保証
      data.difficulty,
      data.estimatedHours
    );
  }

  private validateModule(): void {
    if (!this._id?.trim()) {
      throw new Error('Module ID is required');
    }
    if (!this._title?.trim()) {
      throw new Error('Module title is required');
    }
    if (!this._description?.trim()) {
      throw new Error('Module description is required');
    }
    if (this._topics.length === 0) {
      throw new Error('Module must have at least one topic');
    }
    if (this._estimatedHours <= 0) {
      throw new Error('Estimated hours must be positive');
    }
  }

  public get id(): string {
    return this._id;
  }

  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get topics(): readonly Topic[] {
    return this._topics;
  }

  public get difficulty(): DifficultyLevel {
    return this._difficulty;
  }

  public get estimatedHours(): number {
    return this._estimatedHours;
  }

  /**
   * 特定のトピックを安全に取得
   */
  public getTopicById(topicId: string): Topic | null {
    return this._topics.find(topic => topic.id === topicId) ?? null;
  }

  /**
   * 次のトピックを取得するビジネスロジック
   */
  public getNextTopic(currentTopicId: string): Topic | null {
    const currentIndex = this._topics.findIndex(topic => topic.id === currentTopicId);
    
    if (currentIndex === -1 || currentIndex >= this._topics.length - 1) {
      return null;
    }
    
    return this._topics[currentIndex + 1];
  }

  /**
   * モジュールの総学習時間を計算
   */
  public getTotalDuration(): number {
    return this._topics.reduce((total, topic) => total + topic.duration, 0);
  }

  /**
   * 完了したトピック数に基づく進捗率を計算
   */
  public calculateProgress(completedTopicIds: Set<string>): number {
    const completedCount = this._topics.filter(topic => 
      completedTopicIds.has(topic.id)
    ).length;
    
    return (completedCount / this._topics.length) * 100;
  }

  public equals(other: Module): boolean {
    return this._id === other._id;
  }
}