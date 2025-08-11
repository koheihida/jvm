import { useState, useCallback, useMemo, memo } from "react";
import { CheckCircle, Circle, Clock, Code, ArrowRight, BookOpen } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurriculumService } from "@/domain/services/CurriculumService";
import { cn } from "@/lib/utils";

interface TopicContentProps {
  moduleId: string;
  topicId: string;
  curriculumService: CurriculumService;
  isCompleted: boolean;
  userNote: string;
  onComplete: () => void;
  onSaveNote: (note: string) => void;
  onNavigateNext: () => void;
}

/**
 * トピックコンテンツコンポーネント
 * セキュリティとパフォーマンスを最適化
 */
export const TopicContent = memo(function TopicContent({ 
  moduleId, 
  topicId, 
  curriculumService,
  isCompleted, 
  userNote,
  onComplete, 
  onSaveNote,
  onNavigateNext 
}: TopicContentProps) {
  const [note, setNote] = useState(userNote);
  const [activeTab, setActiveTab] = useState("content");

  // メモ化されたトピック情報の取得
  const topicData = useMemo(() => {
    const result = curriculumService.findTopicById(topicId);
    if (!result || result.module.id !== moduleId) {
      return null;
    }
    return result;
  }, [curriculumService, moduleId, topicId]);

  // 次のトピック情報をメモ化
  const nextTopic = useMemo(() => {
    return curriculumService.getNextTopic(moduleId, topicId);
  }, [curriculumService, moduleId, topicId]);

  // ノート保存のハンドラー
  const handleSaveNote = useCallback(() => {
    // セキュリティ: 入力値のサニタイズは UserProgress エンティティで実行
    onSaveNote(note);
  }, [note, onSaveNote]);

  // セキュアなコンテンツフォーマッター
  const formatContent = useCallback((content: string) => {
    // セキュリティ: HTMLエスケープは Topic エンティティで実行済み
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
        if (match) {
          return (
            <div key={index} className="ml-4 mb-2">
              <span className="font-semibold">{match[1]}</span>: {match[2]}
            </div>
          );
        }
      }
      if (line.startsWith('- ')) {
        return <li key={index} className="ml-6 mb-1 list-disc">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2 leading-relaxed">{line}</p>;
    });
  }, []);

  // エラーハンドリング
  if (!topicData) {
    return (
      <div className="flex-1 flex items-center justify-center" role="alert">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">トピックが見つかりません</h2>
          <p className="text-muted-foreground">選択されたトピックが存在しません。</p>
        </div>
      </div>
    );
  }

  const { module, topic } = topicData;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
      <header className="border-b bg-card/50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{module.title}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{topic.duration}分</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <p className="text-muted-foreground mt-1">{topic.description}</p>
          </div>
          
          <Button
            onClick={onComplete}
            variant={isCompleted ? "secondary" : "default"}
            className="flex-shrink-0"
            aria-pressed={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                完了済み
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 mr-2" />
                完了にする
              </>
            )}
          </Button>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit" role="tablist">
          <TabsTrigger value="content" role="tab">学習内容</TabsTrigger>
          {topic.codeExample && <TabsTrigger value="code" role="tab">コード例</TabsTrigger>}
          <TabsTrigger value="notes" role="tab">ノート</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 m-0" role="tabpanel">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Card>
                <CardContent className="p-6">
                  <article className="prose prose-sm max-w-none">
                    {formatContent(topic.content)}
                  </article>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {topic.codeExample && (
          <TabsContent value="code" className="flex-1 m-0" role="tabpanel">
            <ScrollArea className="h-full">
              <div className="p-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      実装例
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted rounded-lg p-4 overflow-x-auto">
                      <code className="font-mono text-sm" lang="java">
                        {topic.codeExample}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="notes" className="flex-1 m-0" role="tabpanel">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    学習ノート
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="このトピックについてのメモを書いてください..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="min-h-[300px]"
                    maxLength={10000}
                    aria-label="学習ノート"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {note.length}/10,000文字
                    </span>
                    <Button onClick={handleSaveNote} variant="outline">
                      ノートを保存
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <footer className="border-t p-4 bg-card/50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground" aria-live="polite">
            {isCompleted ? "✓ 完了済み" : "未完了"}
          </div>
          
          {nextTopic && (
            <Button onClick={onNavigateNext} className="flex items-center gap-2">
              次のトピック
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
});