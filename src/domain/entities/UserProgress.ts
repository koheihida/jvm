/**
 * UserProgress Value Object - ユーザーの学習進捗を表現
 * 不変性とバリデーションを保証
 */
export class UserProgress {
  private constructor(
    private readonly _completedTopics: Set<string>,
    private readonly _currentModule: string | null,
    private readonly _currentTopic: string | null,
    private readonly _notes: Map<string, string>,
    private readonly _lastAccessed: Date
  ) {
    this.validateProgress();
  }

  public static create(data: {
    completedTopics?: string[] | Set<string>;
    currentModule?: string | null;
    currentTopic?: string | null;
    notes?: Record<string, string> | Map<string, string>;
    lastAccessed?: Date;
  } = {}): UserProgress {
    const completedTopics = data.completedTopics 
      ? (data.completedTopics instanceof Set 
          ? new Set(data.completedTopics) 
          : new Set(data.completedTopics))
      : new Set<string>();

    const notes = data.notes 
      ? (data.notes instanceof Map 
          ? new Map(data.notes) 
          : new Map(Object.entries(data.notes)))
      : new Map<string, string>();

    return new UserProgress(
      completedTopics,
      data.currentModule ?? null,
      data.currentTopic ?? null,
      notes,
      data.lastAccessed ?? new Date()
    );
  }

  private validateProgress(): void {
    if (this._currentTopic && !this._currentModule) {
      throw new Error('Cannot have current topic without current module');
    }
    
    // セキュリティ: ノートのサイズ制限
    for (const [topicId, note] of this._notes) {
      if (!topicId?.trim()) {
        throw new Error('Note topic ID cannot be empty');
      }
      if (note.length > 10000) { // 10KB制限
        throw new Error(`Note for topic ${topicId} exceeds maximum length`);
      }
    }
  }

  public get completedTopics(): Set<string> {
    return new Set(this._completedTopics); // 防御的コピー
  }

  public get currentModule(): string | null {
    return this._currentModule;
  }

  public get currentTopic(): string | null {
    return this._currentTopic;
  }

  public get notes(): Map<string, string> {
    return new Map(this._notes); // 防御的コピー
  }

  public get lastAccessed(): Date {
    return new Date(this._lastAccessed.getTime()); // 防御的コピー
  }

  /**
   * トピック完了状態の追加
   */
  public withCompletedTopic(topicId: string): UserProgress {
    if (!topicId?.trim()) {
      throw new Error('Topic ID is required');
    }

    const newCompletedTopics = new Set(this._completedTopics);
    newCompletedTopics.add(topicId);

    return new UserProgress(
      newCompletedTopics,
      this._currentModule,
      this._currentTopic,
      this._notes,
      new Date()
    );
  }

  /**
   * 現在の学習位置の更新
   */
  public withCurrentPosition(moduleId: string, topicId: string): UserProgress {
    if (!moduleId?.trim() || !topicId?.trim()) {
      throw new Error('Module ID and Topic ID are required');
    }

    return new UserProgress(
      this._completedTopics,
      moduleId,
      topicId,
      this._notes,
      new Date()
    );
  }

  /**
   * ノートの追加・更新
   */
  public withNote(topicId: string, note: string): UserProgress {
    if (!topicId?.trim()) {
      throw new Error('Topic ID is required');
    }

    // セキュリティ: HTMLエスケープ
    const safeNote = this.sanitizeNote(note);

    const newNotes = new Map(this._notes);
    if (safeNote.trim()) {
      newNotes.set(topicId, safeNote);
    } else {
      newNotes.delete(topicId);
    }

    return new UserProgress(
      this._completedTopics,
      this._currentModule,
      this._currentTopic,
      newNotes,
      new Date()
    );
  }

  /**
   * ノートの削除
   */
  public withoutNote(topicId: string): UserProgress {
    const newNotes = new Map(this._notes);
    newNotes.delete(topicId);

    return new UserProgress(
      this._completedTopics,
      this._currentModule,
      this._currentTopic,
      newNotes,
      new Date()
    );
  }

  /**
   * 特定のトピックのノートを取得
   */
  public getNoteForTopic(topicId: string): string {
    return this._notes.get(topicId) ?? '';
  }

  /**
   * トピックが完了済みかチェック
   */
  public isTopicCompleted(topicId: string): boolean {
    return this._completedTopics.has(topicId);
  }

  /**
   * 学習を開始済みかチェック
   */
  public hasStarted(): boolean {
    return this._currentModule !== null;
  }

  /**
   * セキュリティ: ノートのサニタイズ
   */
  private sanitizeNote(note: string): string {
    // 基本的なHTMLエスケープ
    return note
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .slice(0, 10000); // 最大長制限
  }

  /**
   * シリアライゼーション用のデータ取得
   */
  public toSerializable(): {
    completedTopics: string[];
    currentModule: string | null;
    currentTopic: string | null;
    notes: Record<string, string>;
    lastAccessed: string;
  } {
    return {
      completedTopics: Array.from(this._completedTopics),
      currentModule: this._currentModule,
      currentTopic: this._currentTopic,
      notes: Object.fromEntries(this._notes),
      lastAccessed: this._lastAccessed.toISOString()
    };
  }

  /**
   * シリアライズされたデータからの復元
   */
  public static fromSerializable(data: {
    completedTopics: string[];
    currentModule: string | null;
    currentTopic: string | null;
    notes: Record<string, string>;
    lastAccessed: string;
  }): UserProgress {
    return UserProgress.create({
      completedTopics: data.completedTopics,
      currentModule: data.currentModule,
      currentTopic: data.currentTopic,
      notes: data.notes,
      lastAccessed: new Date(data.lastAccessed)
    });
  }
}