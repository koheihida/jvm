import { useState, useMemo, memo, useCallback } from "react";
import { BookOpen, Search, Trash2 } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CurriculumFactory } from "@/infrastructure/CurriculumFactory";

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Map<string, string>;
  onDeleteNote: (topicId: string) => void;
}

/**
 * ノートダイアログコンポーネント
 * セキュリティとパフォーマンスを最適化
 */
export const NotesDialog = memo(function NotesDialog({ 
  isOpen, 
  onClose, 
  notes, 
  onDeleteNote 
}: NotesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // カリキュラムサービスの初期化（メモ化）
  const curriculumService = useMemo(() => {
    return CurriculumFactory.createJVMCurriculum();
  }, []);

  // トピックタイトル取得のメモ化
  const getTopicTitle = useCallback((topicId: string): string => {
    const result = curriculumService.findTopicById(topicId);
    if (result) {
      return `${result.module.title} - ${result.topic.title}`;
    }
    return topicId; // フォールバック
  }, [curriculumService]);

  // フィルタリングされたノートの計算（メモ化）
  const filteredNotes = useMemo(() => {
    const notesArray = Array.from(notes.entries());
    
    if (!searchTerm.trim()) {
      return notesArray;
    }

    const search = searchTerm.toLowerCase();
    return notesArray.filter(([topicId, note]) => {
      const topicTitle = getTopicTitle(topicId).toLowerCase();
      const noteContent = note.toLowerCase();
      return topicTitle.includes(search) || noteContent.includes(search);
    });
  }, [notes, searchTerm, getTopicTitle]);

  // セキュアなノート削除ハンドラー
  const handleDeleteNote = useCallback((topicId: string) => {
    if (!topicId?.trim()) {
      console.warn('Invalid topic ID for note deletion');
      return;
    }
    
    if (confirm('このノートを削除してもよろしいですか？')) {
      onDeleteNote(topicId);
    }
  }, [onDeleteNote]);

  // 検索入力のハンドラー
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]" role="dialog" aria-labelledby="notes-dialog-title">
        <DialogHeader>
          <DialogTitle id="notes-dialog-title" className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            学習ノート
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ノートを検索..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
              aria-label="ノート検索"
            />
          </div>

          <ScrollArea className="h-[400px]" aria-live="polite">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {notes.size === 0 ? (
                  <>
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>まだノートがありません</p>
                    <p className="text-sm mt-1">学習しながらメモを取ってみましょう</p>
                  </>
                ) : (
                  <>
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>検索結果が見つかりませんでした</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotes.map(([topicId, note]) => (
                  <Card key={topicId}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{getTopicTitle(topicId)}</CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteNote(topicId)}
                          className="text-destructive hover:text-destructive"
                          aria-label={`${getTopicTitle(topicId)}のノートを削除`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.trim() || "（空のノート）"}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
});