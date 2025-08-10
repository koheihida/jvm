import { useState } from "react";
import { BookOpen, Search, Trash2 } from "@phosphor-icons/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { jvmCurriculum } from "@/lib/curriculum";

interface NotesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  notes: Record<string, string>;
  onDeleteNote: (topicId: string) => void;
}

export function NotesDialog({ isOpen, onClose, notes, onDeleteNote }: NotesDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const getTopicTitle = (topicId: string) => {
    for (const module of jvmCurriculum) {
      const topic = module.topics.find(t => t.id === topicId);
      if (topic) {
        return `${module.title} - ${topic.title}`;
      }
    }
    return topicId;
  };

  const filteredNotes = Object.entries(notes).filter(([topicId, note]) => {
    const topicTitle = getTopicTitle(topicId).toLowerCase();
    const noteContent = note.toLowerCase();
    const search = searchTerm.toLowerCase();
    return topicTitle.includes(search) || noteContent.includes(search);
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <ScrollArea className="h-[400px]">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {Object.keys(notes).length === 0 ? (
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
                          onClick={() => onDeleteNote(topicId)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note || "（空のノート）"}
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
}