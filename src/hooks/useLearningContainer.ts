import { useMemo } from 'react';
import { LearningUseCase } from '../application/usecases/LearningUseCase';
import { KVUserProgressRepository } from '../infrastructure/repositories/KVUserProgressRepository';
import { CurriculumFactory } from '../infrastructure/CurriculumFactory';

/**
 * アプリケーションレイヤーの依存性注入とライフサイクル管理
 * Clean Architectureの依存性逆転原則に従い、上位レイヤーから下位レイヤーに依存
 */
export function useLearningContainer() {
  // リポジトリとSparkフックの初期化
  const [repository, kvValue] = KVUserProgressRepository.createWithHook();

  // ドメインサービスとユースケースの初期化
  const { learningUseCase, curriculumService } = useMemo(() => {
    const curriculumService = CurriculumFactory.createJVMCurriculum();
    const learningUseCase = new LearningUseCase(repository, curriculumService);

    return {
      learningUseCase,
      curriculumService
    };
  }, [repository]);

  return {
    learningUseCase,
    curriculumService,
    // Reactの再レンダリング用
    _kvValue: kvValue
  };
}