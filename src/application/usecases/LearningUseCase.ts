import { UserProgressRepository } from '../repositories/UserProgressRepository';
import { CurriculumService } from '../../domain/services/CurriculumService';
import { ProgressService } from '../../domain/services/ProgressService';
import { UserProgress } from '../../domain/entities/UserProgress';

/**
 * Learning Use Case - 学習関連のアプリケーションロジック
 * ドメインサービスとリポジトリを組み合わせてビジネス要件を実現
 */
export class LearningUseCase {
  private readonly progressService: ProgressService;

  constructor(
    private readonly userProgressRepository: UserProgressRepository,
    private readonly curriculumService: CurriculumService
  ) {
    this.progressService = new ProgressService(curriculumService);
  }

  /**
   * 学習を開始する
   */
  async startLearning(): Promise<void> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      const newProgress = this.progressService.startLearningSession(currentProgress);
      await this.userProgressRepository.save(newProgress);
    } catch (error) {
      throw new Error(`Failed to start learning: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * トピックを選択する
   */
  async selectTopic(moduleId: string, topicId: string): Promise<void> {
    if (!this.curriculumService.validateLearningPath(moduleId, topicId)) {
      throw new Error('Invalid learning path');
    }

    try {
      const currentProgress = await this.userProgressRepository.get();
      const newProgress = currentProgress.withCurrentPosition(moduleId, topicId);
      await this.userProgressRepository.save(newProgress);
    } catch (error) {
      throw new Error(`Failed to select topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * トピックを完了する
   */
  async completeTopic(topicId: string): Promise<void> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      const newProgress = currentProgress.withCompletedTopic(topicId);
      await this.userProgressRepository.save(newProgress);
    } catch (error) {
      throw new Error(`Failed to complete topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * ノートを保存する
   */
  async saveNote(topicId: string, note: string): Promise<void> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      const newProgress = currentProgress.withNote(topicId, note);
      await this.userProgressRepository.save(newProgress);
    } catch (error) {
      throw new Error(`Failed to save note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * ノートを削除する
   */
  async deleteNote(topicId: string): Promise<void> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      const newProgress = currentProgress.withoutNote(topicId);
      await this.userProgressRepository.save(newProgress);
    } catch (error) {
      throw new Error(`Failed to delete note: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 次のトピックに進む
   */
  async navigateToNext(): Promise<boolean> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      
      if (!currentProgress.currentModule || !currentProgress.currentTopic) {
        return false;
      }

      const nextTopic = this.curriculumService.getNextTopic(
        currentProgress.currentModule,
        currentProgress.currentTopic
      );

      if (!nextTopic) {
        return false;
      }

      const newProgress = currentProgress.withCurrentPosition(
        nextTopic.moduleId,
        nextTopic.topicId
      );
      
      await this.userProgressRepository.save(newProgress);
      return true;
    } catch (error) {
      throw new Error(`Failed to navigate to next topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 前のトピックに戻る
   */
  async navigateToPrevious(): Promise<boolean> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      
      if (!currentProgress.currentModule || !currentProgress.currentTopic) {
        return false;
      }

      const previousTopic = this.curriculumService.getPreviousTopic(
        currentProgress.currentModule,
        currentProgress.currentTopic
      );

      if (!previousTopic) {
        return false;
      }

      const newProgress = currentProgress.withCurrentPosition(
        previousTopic.moduleId,
        previousTopic.topicId
      );
      
      await this.userProgressRepository.save(newProgress);
      return true;
    } catch (error) {
      throw new Error(`Failed to navigate to previous topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 学習進捗を取得する
   */
  async getProgress(): Promise<{
    userProgress: UserProgress;
    overallProgress: number;
    statistics: {
      totalTopics: number;
      completedTopics: number;
      remainingTopics: number;
      completionRate: number;
      estimatedRemainingHours: number;
      totalNotes: number;
    };
    sessionInfo: {
      canResume: boolean;
      lastAccessedFormatted: string;
      currentPosition?: { moduleTitle: string; topicTitle: string };
    };
  }> {
    try {
      const userProgress = await this.userProgressRepository.get();
      const overallProgress = this.progressService.calculateOverallProgress(userProgress);
      const statistics = this.progressService.getLearningStatistics(userProgress);
      const sessionInfo = this.progressService.getSessionInfo(userProgress);

      return {
        userProgress,
        overallProgress,
        statistics,
        sessionInfo
      };
    } catch (error) {
      throw new Error(`Failed to get progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 推奨される次のトピックを取得する
   */
  async getRecommendedNextTopic(): Promise<{
    moduleId: string;
    topicId: string;
  } | null> {
    try {
      const currentProgress = await this.userProgressRepository.get();
      return this.progressService.getRecommendedNextTopic(currentProgress);
    } catch (error) {
      throw new Error(`Failed to get recommended topic: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 学習データをリセットする
   */
  async resetProgress(): Promise<void> {
    try {
      await this.userProgressRepository.reset();
    } catch (error) {
      throw new Error(`Failed to reset progress: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}