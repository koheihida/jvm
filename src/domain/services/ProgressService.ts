import { UserProgress } from '../entities/UserProgress';
import { CurriculumService } from './CurriculumService';

/**
 * Progress Domain Service - 学習進捗関連のビジネスロジック
 */
export class ProgressService {
  constructor(private readonly curriculumService: CurriculumService) {}

  /**
   * 全体の学習進捗率を計算
   */
  public calculateOverallProgress(userProgress: UserProgress): number {
    const totalTopics = this.curriculumService.getTotalTopicCount();
    const completedCount = userProgress.completedTopics.size;
    
    return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  }

  /**
   * 特定のモジュールの進捗率を計算
   */
  public calculateModuleProgress(userProgress: UserProgress, moduleId: string): number {
    const module = this.curriculumService.getModuleById(moduleId);
    if (!module) {
      return 0;
    }

    return Math.round(module.calculateProgress(userProgress.completedTopics));
  }

  /**
   * 次の推奨トピックを取得
   */
  public getRecommendedNextTopic(userProgress: UserProgress): {
    moduleId: string;
    topicId: string;
  } | null {
    // 現在学習中のトピックがある場合
    if (userProgress.currentModule && userProgress.currentTopic) {
      // 現在のトピックが完了済みの場合、次のトピックを推奨
      if (userProgress.isTopicCompleted(userProgress.currentTopic)) {
        return this.curriculumService.getNextTopic(
          userProgress.currentModule,
          userProgress.currentTopic
        );
      }
      
      // 未完了の場合は現在のトピックを継続
      return {
        moduleId: userProgress.currentModule,
        topicId: userProgress.currentTopic
      };
    }

    // 学習開始前の場合は最初のトピック
    return this.curriculumService.getFirstTopic();
  }

  /**
   * 学習統計を取得
   */
  public getLearningStatistics(userProgress: UserProgress): {
    totalTopics: number;
    completedTopics: number;
    remainingTopics: number;
    completionRate: number;
    estimatedRemainingHours: number;
    totalNotes: number;
  } {
    const totalTopics = this.curriculumService.getTotalTopicCount();
    const completedTopics = userProgress.completedTopics.size;
    const remainingTopics = totalTopics - completedTopics;
    const completionRate = this.calculateOverallProgress(userProgress);
    
    // 完了していないトピックの推定学習時間を計算
    let estimatedRemainingHours = 0;
    for (const module of this.curriculumService.getAllModules()) {
      for (const topic of module.topics) {
        if (!userProgress.isTopicCompleted(topic.id)) {
          estimatedRemainingHours += topic.duration / 60; // 分を時間に変換
        }
      }
    }

    return {
      totalTopics,
      completedTopics,
      remainingTopics,
      completionRate,
      estimatedRemainingHours: Math.round(estimatedRemainingHours * 10) / 10, // 小数点1位
      totalNotes: userProgress.notes.size
    };
  }

  /**
   * 学習可能な次のトピック一覧を取得（前提条件チェック付き）
   */
  public getAvailableTopics(userProgress: UserProgress): Array<{
    moduleId: string;
    topicId: string;
    title: string;
    isRecommended: boolean;
  }> {
    const availableTopics: Array<{
      moduleId: string;
      topicId: string;
      title: string;
      isRecommended: boolean;
    }> = [];

    const recommended = this.getRecommendedNextTopic(userProgress);

    for (const module of this.curriculumService.getAllModules()) {
      for (const topic of module.topics) {
        // 基本的には全てのトピックが学習可能（このプラットフォームでは前提条件なし）
        const isRecommended = recommended?.moduleId === module.id && 
                             recommended?.topicId === topic.id;

        availableTopics.push({
          moduleId: module.id,
          topicId: topic.id,
          title: topic.title,
          isRecommended
        });
      }
    }

    return availableTopics;
  }

  /**
   * 学習セッションの開始
   */
  public startLearningSession(userProgress: UserProgress): UserProgress {
    const firstTopic = this.curriculumService.getFirstTopic();
    
    if (!firstTopic) {
      throw new Error('No topics available to start learning');
    }

    return userProgress.withCurrentPosition(firstTopic.moduleId, firstTopic.topicId);
  }

  /**
   * 学習の一時停止/再開用の情報を取得
   */
  public getSessionInfo(userProgress: UserProgress): {
    canResume: boolean;
    lastAccessedFormatted: string;
    currentPosition?: { moduleTitle: string; topicTitle: string };
  } {
    const canResume = userProgress.hasStarted();
    const lastAccessedFormatted = this.formatLastAccessed(userProgress.lastAccessed);
    
    let currentPosition;
    if (userProgress.currentModule && userProgress.currentTopic) {
      const result = this.curriculumService.findTopicById(userProgress.currentTopic);
      if (result) {
        currentPosition = {
          moduleTitle: result.module.title,
          topicTitle: result.topic.title
        };
      }
    }

    return {
      canResume,
      lastAccessedFormatted,
      currentPosition
    };
  }

  private formatLastAccessed(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return '今日';
    } else if (diffDays === 1) {
      return '昨日';
    } else if (diffDays < 7) {
      return `${diffDays}日前`;
    } else {
      return date.toLocaleDateString('ja-JP');
    }
  }
}