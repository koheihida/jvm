import { Module } from '../entities/Module';
import { Topic } from '../entities/Topic';

/**
 * Curriculum Domain Service - カリキュラム関連のビジネスロジック
 * 複数のエンティティにまたがる操作を管理
 */
export class CurriculumService {
  constructor(private readonly modules: readonly Module[]) {
    this.validateCurriculum();
  }

  private validateCurriculum(): void {
    if (this.modules.length === 0) {
      throw new Error('Curriculum must have at least one module');
    }

    // 重複IDチェック
    const moduleIds = new Set<string>();
    const topicIds = new Set<string>();

    for (const module of this.modules) {
      if (moduleIds.has(module.id)) {
        throw new Error(`Duplicate module ID: ${module.id}`);
      }
      moduleIds.add(module.id);

      for (const topic of module.topics) {
        if (topicIds.has(topic.id)) {
          throw new Error(`Duplicate topic ID: ${topic.id}`);
        }
        topicIds.add(topic.id);
      }
    }
  }

  /**
   * 全モジュールを取得
   */
  public getAllModules(): readonly Module[] {
    return this.modules;
  }

  /**
   * 特定のモジュールを取得
   */
  public getModuleById(moduleId: string): Module | null {
    return this.modules.find(module => module.id === moduleId) ?? null;
  }

  /**
   * 特定のトピックを含むモジュールとトピックを取得
   */
  public findTopicById(topicId: string): { module: Module; topic: Topic } | null {
    for (const module of this.modules) {
      const topic = module.getTopicById(topicId);
      if (topic) {
        return { module, topic };
      }
    }
    return null;
  }

  /**
   * 次のトピックを取得（モジュール間の移動も含む）
   */
  public getNextTopic(currentModuleId: string, currentTopicId: string): {
    moduleId: string;
    topicId: string;
  } | null {
    const currentModule = this.getModuleById(currentModuleId);
    if (!currentModule) {
      return null;
    }

    // 同じモジュール内の次のトピック
    const nextTopicInModule = currentModule.getNextTopic(currentTopicId);
    if (nextTopicInModule) {
      return {
        moduleId: currentModuleId,
        topicId: nextTopicInModule.id
      };
    }

    // 次のモジュールの最初のトピック
    const currentModuleIndex = this.modules.findIndex(m => m.id === currentModuleId);
    if (currentModuleIndex < this.modules.length - 1) {
      const nextModule = this.modules[currentModuleIndex + 1];
      const firstTopic = nextModule.topics[0];
      
      return {
        moduleId: nextModule.id,
        topicId: firstTopic.id
      };
    }

    return null;
  }

  /**
   * 前のトピックを取得（モジュール間の移動も含む）
   */
  public getPreviousTopic(currentModuleId: string, currentTopicId: string): {
    moduleId: string;
    topicId: string;
  } | null {
    const currentModule = this.getModuleById(currentModuleId);
    if (!currentModule) {
      return null;
    }

    const currentTopicIndex = currentModule.topics.findIndex(t => t.id === currentTopicId);
    
    // 同じモジュール内の前のトピック
    if (currentTopicIndex > 0) {
      return {
        moduleId: currentModuleId,
        topicId: currentModule.topics[currentTopicIndex - 1].id
      };
    }

    // 前のモジュールの最後のトピック
    const currentModuleIndex = this.modules.findIndex(m => m.id === currentModuleId);
    if (currentModuleIndex > 0) {
      const previousModule = this.modules[currentModuleIndex - 1];
      const lastTopic = previousModule.topics[previousModule.topics.length - 1];
      
      return {
        moduleId: previousModule.id,
        topicId: lastTopic.id
      };
    }

    return null;
  }

  /**
   * 総トピック数を計算
   */
  public getTotalTopicCount(): number {
    return this.modules.reduce((total, module) => total + module.topics.length, 0);
  }

  /**
   * 総学習時間を計算
   */
  public getTotalEstimatedHours(): number {
    return this.modules.reduce((total, module) => total + module.estimatedHours, 0);
  }

  /**
   * 難易度別のモジュール数を取得
   */
  public getModuleCountByDifficulty(): Record<string, number> {
    const counts = { beginner: 0, intermediate: 0, advanced: 0 };
    
    for (const module of this.modules) {
      counts[module.difficulty]++;
    }
    
    return counts;
  }

  /**
   * 最初のトピックを取得
   */
  public getFirstTopic(): { moduleId: string; topicId: string } | null {
    if (this.modules.length === 0 || this.modules[0].topics.length === 0) {
      return null;
    }

    const firstModule = this.modules[0];
    const firstTopic = firstModule.topics[0];

    return {
      moduleId: firstModule.id,
      topicId: firstTopic.id
    };
  }

  /**
   * 学習パスの検証
   */
  public validateLearningPath(moduleId: string, topicId: string): boolean {
    const module = this.getModuleById(moduleId);
    if (!module) {
      return false;
    }

    return module.getTopicById(topicId) !== null;
  }
}