/**
 * Topic Entity - トピックのドメインモデル
 * 不変性とビジネスルールをカプセル化
 */
export class Topic {
  private constructor(
    private readonly _id: string,
    private readonly _title: string,
    private readonly _description: string,
    private readonly _content: string,
    private readonly _duration: number,
    private readonly _codeExample?: string
  ) {
    this.validateTopic();
  }

  public static create(data: {
    id: string;
    title: string;
    description: string;
    content: string;
    duration: number;
    codeExample?: string;
  }): Topic {
    return new Topic(
      data.id,
      data.title,
      data.description,
      data.content,
      data.duration,
      data.codeExample
    );
  }

  private validateTopic(): void {
    if (!this._id?.trim()) {
      throw new Error('Topic ID is required');
    }
    if (!this._title?.trim()) {
      throw new Error('Topic title is required');
    }
    if (!this._description?.trim()) {
      throw new Error('Topic description is required');
    }
    if (!this._content?.trim()) {
      throw new Error('Topic content is required');
    }
    if (this._duration <= 0) {
      throw new Error('Topic duration must be positive');
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

  public get content(): string {
    return this._content;
  }

  public get duration(): number {
    return this._duration;
  }

  public get codeExample(): string | undefined {
    return this._codeExample;
  }

  /**
   * セキュリティ: HTMLエスケープされたコンテンツを取得
   */
  public getSafeContent(): string {
    return this.escapeHtml(this._content);
  }

  /**
   * セキュリティ: HTMLエスケープされたコード例を取得
   */
  public getSafeCodeExample(): string | undefined {
    return this._codeExample ? this.escapeHtml(this._codeExample) : undefined;
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  public equals(other: Topic): boolean {
    return this._id === other._id;
  }
}