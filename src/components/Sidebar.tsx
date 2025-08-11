import { CheckCircle, Circle, Clock } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Module } from "@/domain/entities/Module";
import { cn } from "@/lib/utils";
import { memo, useCallback } from "react";

interface SidebarProps {
  completedTopics: Set<string>;
  currentModule: string | null;
  currentTopic: string | null;
  modules: readonly Module[];
  onSelectTopic: (moduleId: string, topicId: string) => void;
}

/**
 * サイドバーコンポーネント
 * メモ化によりパフォーマンスを最適化
 */
export const Sidebar = memo(function Sidebar({ 
  completedTopics, 
  currentModule, 
  currentTopic, 
  modules, 
  onSelectTopic 
}: SidebarProps) {
  const getDifficultyColor = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  }, []);

  const getDifficultyLabel = useCallback((difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      default: return '不明';
    }
  }, []);

  const handleTopicSelect = useCallback((moduleId: string, topicId: string) => {
    // セキュリティ: 入力値検証
    if (!moduleId?.trim() || !topicId?.trim()) {
      console.warn('Invalid module or topic ID');
      return;
    }
    onSelectTopic(moduleId, topicId);
  }, [onSelectTopic]);

  return (
    <aside className="w-80 border-r bg-card h-[calc(100vh-73px)] flex flex-col" role="navigation" aria-label="学習カリキュラム">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">学習カリキュラム</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Oracle JVM公式ドキュメント準拠
        </p>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {modules.map((module) => {
            const moduleCompleted = module.topics.every(topic => completedTopics.has(topic.id));
            const moduleProgress = module.topics.filter(topic => completedTopics.has(topic.id)).length;
            
            return (
              <div key={module.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{module.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{module.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className={cn("text-xs", getDifficultyColor(module.difficulty))}>
                        {getDifficultyLabel(module.difficulty)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{module.estimatedHours}時間</span>
                      </div>
                    </div>
                  </div>
                  {moduleCompleted && (
                    <CheckCircle 
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" 
                      aria-label="モジュール完了"
                    />
                  )}
                </div>
                
                <div className="ml-4 space-y-1" role="list" aria-label={`${module.title}のトピック`}>
                  {module.topics.map((topic) => {
                    const isCompleted = completedTopics.has(topic.id);
                    const isCurrent = currentModule === module.id && currentTopic === topic.id;
                    
                    return (
                      <Button
                        key={topic.id}
                        variant={isCurrent ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-start text-left h-auto py-2 px-3",
                          isCurrent && "bg-accent text-accent-foreground"
                        )}
                        onClick={() => handleTopicSelect(module.id, topic.id)}
                        aria-current={isCurrent ? "page" : undefined}
                        aria-describedby={`${topic.id}-description`}
                        role="listitem"
                      >
                        <div className="flex items-start gap-2 w-full">
                          {isCompleted ? (
                            <CheckCircle 
                              className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" 
                              aria-label="完了"
                            />
                          ) : (
                            <Circle 
                              className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" 
                              aria-label="未完了"
                            />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{topic.title}</div>
                            <div 
                              id={`${topic.id}-description`}
                              className="text-xs text-muted-foreground truncate"
                            >
                              {topic.description}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                              <Clock className="w-3 h-3" />
                              <span>{topic.duration}分</span>
                            </div>
                          </div>
                        </div>
                      </Button>
                    );
                  })}
                </div>
                
                {moduleProgress > 0 && (
                  <div className="ml-4 text-xs text-muted-foreground" aria-live="polite">
                    進捗: {moduleProgress}/{module.topics.length} 完了
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
});