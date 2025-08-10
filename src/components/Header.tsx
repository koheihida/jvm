import { BookOpen, Code, User } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface HeaderProps {
  progress: number;
  onShowNotes: () => void;
}

export function Header({ progress, onShowNotes }: HeaderProps) {
  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">JVM Learning Platform</h1>
                <p className="text-sm text-muted-foreground">Oracle公式ドキュメント準拠</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-muted-foreground">学習進捗</span>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            
            <Button variant="outline" size="sm" onClick={onShowNotes}>
              <BookOpen className="w-4 h-4 mr-1" />
              ノート
            </Button>
            
            <Button variant="outline" size="sm">
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Mobile progress bar */}
        <div className="md:hidden mt-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
            <span>学習進捗</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </header>
  );
}