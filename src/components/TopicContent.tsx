import { useState } from "react";
import { CheckCircle, Circle, Clock, Code, ArrowRight, BookOpen } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jvmCurriculum, type Topic, getNextTopic } from "@/lib/curriculum";
import { cn } from "@/lib/utils";

interface TopicContentProps {
  moduleId: string;
  topicId: string;
  isCompleted: boolean;
  userNote: string;
  onComplete: () => void;
  onSaveNote: (note: string) => void;
  onNavigateNext: () => void;
}

export function TopicContent({ 
  moduleId, 
  topicId, 
  isCompleted, 
  userNote,
  onComplete, 
  onSaveNote,
  onNavigateNext 
}: TopicContentProps) {
  const [note, setNote] = useState(userNote);
  const [activeTab, setActiveTab] = useState("content");

  const module = jvmCurriculum.find(m => m.id === moduleId);
  const topic = module?.topics.find(t => t.id === topicId);
  const nextTopic = getNextTopic(moduleId, topicId);

  if (!module || !topic) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">トピックが見つかりません</h2>
          <p className="text-muted-foreground">選択されたトピックが存在しません。</p>
        </div>
      </div>
    );
  }

  const handleSaveNote = () => {
    onSaveNote(note);
  };

  const formatContent = (content: string) => {
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
        return <li key={index} className="ml-6 mb-1">{line.substring(2)}</li>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-2 leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
      <div className="border-b bg-card/50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{module.title}</Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {topic.duration}分
              </div>
            </div>
            <h1 className="text-2xl font-bold">{topic.title}</h1>
            <p className="text-muted-foreground mt-1">{topic.description}</p>
          </div>
          
          <Button
            onClick={onComplete}
            variant={isCompleted ? "secondary" : "default"}
            className="flex-shrink-0"
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
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 w-fit">
          <TabsTrigger value="content">学習内容</TabsTrigger>
          {topic.codeExample && <TabsTrigger value="code">コード例</TabsTrigger>}
          <TabsTrigger value="notes">ノート</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <div className="p-6">
              <Card>
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none">
                    {formatContent(topic.content)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>

        {topic.codeExample && (
          <TabsContent value="code" className="flex-1 m-0">
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
                      <code className="font-mono text-sm">{topic.codeExample}</code>
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        )}

        <TabsContent value="notes" className="flex-1 m-0">
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
                  />
                  <Button onClick={handleSaveNote} variant="outline">
                    ノートを保存
                  </Button>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Navigation */}
      <div className="border-t p-4 bg-card/50">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {isCompleted ? "✓ 完了済み" : "未完了"}
          </div>
          
          {nextTopic && (
            <Button onClick={onNavigateNext} className="flex items-center gap-2">
              次のトピック
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}