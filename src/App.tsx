import { useState, useEffect } from "react";
import { useKV } from "@github/spark/hooks";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { TopicContent } from "@/components/TopicContent";
import { NotesDialog } from "@/components/NotesDialog";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { jvmCurriculum, type UserProgress, calculateProgress, getNextTopic } from "@/lib/curriculum";
import { toast } from "sonner";

function App() {
  const [userProgress, setUserProgress] = useKV<UserProgress>("jvm-learning-progress", {
    completedTopics: new Set(),
    currentModule: null,
    currentTopic: null,
    notes: {},
    lastAccessed: new Date()
  });

  const [showNotes, setShowNotes] = useState(false);

  // Convert Set to Array for serialization compatibility
  useEffect(() => {
    if (userProgress && Array.isArray(userProgress.completedTopics)) {
      setUserProgress((prev) => ({
        ...prev,
        completedTopics: new Set(prev.completedTopics)
      }));
    }
  }, []);

  const progress = calculateProgress(userProgress);
  const hasStarted = userProgress.currentModule !== null;

  const handleStartLearning = () => {
    const firstModule = jvmCurriculum[0];
    const firstTopic = firstModule.topics[0];
    
    setUserProgress((prev) => ({
      ...prev,
      currentModule: firstModule.id,
      currentTopic: firstTopic.id,
      lastAccessed: new Date()
    }));
    
    toast.success("学習を開始しました！");
  };

  const handleSelectTopic = (moduleId: string, topicId: string) => {
    setUserProgress((prev) => ({
      ...prev,
      currentModule: moduleId,
      currentTopic: topicId,
      lastAccessed: new Date()
    }));
  };

  const handleTopicComplete = () => {
    if (!userProgress.currentTopic) return;

    const newCompletedTopics = new Set(userProgress.completedTopics);
    newCompletedTopics.add(userProgress.currentTopic);

    setUserProgress((prev) => ({
      ...prev,
      completedTopics: Array.from(newCompletedTopics), // Convert to array for serialization
      lastAccessed: new Date()
    }));

    toast.success("トピックを完了しました！");
  };

  const handleSaveNote = (note: string) => {
    if (!userProgress.currentTopic) return;

    setUserProgress((prev) => ({
      ...prev,
      notes: {
        ...prev.notes,
        [prev.currentTopic!]: note
      },
      lastAccessed: new Date()
    }));

    toast.success("ノートを保存しました");
  };

  const handleNavigateNext = () => {
    if (!userProgress.currentModule || !userProgress.currentTopic) return;

    const nextTopic = getNextTopic(userProgress.currentModule, userProgress.currentTopic);
    if (nextTopic) {
      handleSelectTopic(nextTopic.moduleId, nextTopic.topicId);
      toast.success("次のトピックに進みました");
    }
  };

  const handleDeleteNote = (topicId: string) => {
    setUserProgress((prev) => {
      const newNotes = { ...prev.notes };
      delete newNotes[topicId];
      return {
        ...prev,
        notes: newNotes,
        lastAccessed: new Date()
      };
    });
    
    toast.success("ノートを削除しました");
  };

  // Ensure completedTopics is a Set for UI components
  const uiUserProgress = {
    ...userProgress,
    completedTopics: new Set(userProgress.completedTopics)
  };

  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-background">
        <Header progress={0} onShowNotes={() => setShowNotes(true)} />
        <WelcomeScreen onStartLearning={handleStartLearning} />
        <NotesDialog
          isOpen={showNotes}
          onClose={() => setShowNotes(false)}
          notes={userProgress.notes}
          onDeleteNote={handleDeleteNote}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header progress={progress} onShowNotes={() => setShowNotes(true)} />
      
      <div className="flex">
        <Sidebar
          completedTopics={uiUserProgress.completedTopics}
          currentModule={userProgress.currentModule}
          currentTopic={userProgress.currentTopic}
          onSelectTopic={handleSelectTopic}
        />
        
        {userProgress.currentModule && userProgress.currentTopic && (
          <TopicContent
            moduleId={userProgress.currentModule}
            topicId={userProgress.currentTopic}
            isCompleted={uiUserProgress.completedTopics.has(userProgress.currentTopic)}
            userNote={userProgress.notes[userProgress.currentTopic] || ""}
            onComplete={handleTopicComplete}
            onSaveNote={handleSaveNote}
            onNavigateNext={handleNavigateNext}
          />
        )}
      </div>

      <NotesDialog
        isOpen={showNotes}
        onClose={() => setShowNotes(false)}
        notes={userProgress.notes}
        onDeleteNote={handleDeleteNote}
      />
    </div>
  );
}

export default App;