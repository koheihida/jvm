import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TopicContent } from "@/components/TopicContent";
import { NotesDialog } from "@/components/NotesDialog";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useLearningContainer } from "@/hooks/useLearningContainer";
import { useAsync } from "@/hooks/useAsync";
import { toast } from "sonner";

/**
 * メインアプリケーションコンポーネント
 * Clean Architectureの原則に従い、ビジネスロジックをユースケースに委譲
 */
function App() {
  const { learningUseCase, curriculumService } = useLearningContainer();
  const [showNotes, setShowNotes] = useState(false);

  // 学習進捗の取得
  const { data: progressData, loading, error, execute: refreshProgress } = useAsync(
    () => learningUseCase.getProgress(),
    []
  );

  // セキュリティ：エラー処理の強化
  const handleError = useCallback((error: Error, action: string) => {
    console.error(`${action} failed:`, error);
    toast.error(`${action}に失敗しました。もう一度お試しください。`);
  }, []);

  // 学習開始のハンドラー
  const handleStartLearning = useCallback(async () => {
    try {
      await learningUseCase.startLearning();
      await refreshProgress();
      toast.success("学習を開始しました！");
    } catch (error) {
      handleError(error as Error, "学習開始");
    }
  }, [learningUseCase, refreshProgress, handleError]);

  // トピック選択のハンドラー
  const handleSelectTopic = useCallback(async (moduleId: string, topicId: string) => {
    try {
      await learningUseCase.selectTopic(moduleId, topicId);
      await refreshProgress();
    } catch (error) {
      handleError(error as Error, "トピック選択");
    }
  }, [learningUseCase, refreshProgress, handleError]);

  // トピック完了のハンドラー
  const handleTopicComplete = useCallback(async () => {
    if (!progressData?.userProgress.currentTopic) return;

    try {
      await learningUseCase.completeTopic(progressData.userProgress.currentTopic);
      await refreshProgress();
      toast.success("トピックを完了しました！");
    } catch (error) {
      handleError(error as Error, "トピック完了");
    }
  }, [learningUseCase, progressData?.userProgress.currentTopic, refreshProgress, handleError]);

  // ノート保存のハンドラー
  const handleSaveNote = useCallback(async (note: string) => {
    if (!progressData?.userProgress.currentTopic) return;

    try {
      await learningUseCase.saveNote(progressData.userProgress.currentTopic, note);
      await refreshProgress();
      toast.success("ノートを保存しました");
    } catch (error) {
      handleError(error as Error, "ノート保存");
    }
  }, [learningUseCase, progressData?.userProgress.currentTopic, refreshProgress, handleError]);

  // 次のトピックへの移動
  const handleNavigateNext = useCallback(async () => {
    try {
      const success = await learningUseCase.navigateToNext();
      if (success) {
        await refreshProgress();
        toast.success("次のトピックに進みました");
      } else {
        toast.info("これが最後のトピックです");
      }
    } catch (error) {
      handleError(error as Error, "次のトピックへの移動");
    }
  }, [learningUseCase, refreshProgress, handleError]);

  // ノート削除のハンドラー
  const handleDeleteNote = useCallback(async (topicId: string) => {
    try {
      await learningUseCase.deleteNote(topicId);
      await refreshProgress();
      toast.success("ノートを削除しました");
    } catch (error) {
      handleError(error as Error, "ノート削除");
    }
  }, [learningUseCase, refreshProgress, handleError]);

  // ローディング状態
  if (loading) {
    return <LoadingSpinner />;
  }

  // エラー状態
  if (error) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              アプリケーションの読み込みに失敗しました
            </h2>
            <p className="text-muted-foreground mb-4">
              ページを再読み込みしてください
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              再読み込み
            </button>
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  if (!progressData) {
    return <LoadingSpinner />;
  }

  const hasStarted = progressData.userProgress.hasStarted();

  if (!hasStarted) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-background">
          <Header progress={0} onShowNotes={() => setShowNotes(true)} />
          <WelcomeScreen onStartLearning={handleStartLearning} />
          <NotesDialog
            isOpen={showNotes}
            onClose={() => setShowNotes(false)}
            notes={progressData.userProgress.notes}
            onDeleteNote={handleDeleteNote}
          />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background">
        <Header progress={progressData.overallProgress} onShowNotes={() => setShowNotes(true)} />
        
        <div className="flex">
          <Sidebar
            completedTopics={progressData.userProgress.completedTopics}
            currentModule={progressData.userProgress.currentModule}
            currentTopic={progressData.userProgress.currentTopic}
            modules={curriculumService.getAllModules()}
            onSelectTopic={handleSelectTopic}
          />
          
          {progressData.userProgress.currentModule && progressData.userProgress.currentTopic && (
            <TopicContent
              moduleId={progressData.userProgress.currentModule}
              topicId={progressData.userProgress.currentTopic}
              curriculumService={curriculumService}
              isCompleted={progressData.userProgress.isTopicCompleted(progressData.userProgress.currentTopic)}
              userNote={progressData.userProgress.getNoteForTopic(progressData.userProgress.currentTopic)}
              onComplete={handleTopicComplete}
              onSaveNote={handleSaveNote}
              onNavigateNext={handleNavigateNext}
            />
          )}
        </div>

        <NotesDialog
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          notes={progressData.userProgress.notes}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    </ErrorBoundary>
  );
}

export default App;