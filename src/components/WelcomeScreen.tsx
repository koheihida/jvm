import { Code, BookOpen, Clock, Target } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { jvmCurriculum } from "@/lib/curriculum";

interface WelcomeScreenProps {
  onStartLearning: () => void;
}

export function WelcomeScreen({ onStartLearning }: WelcomeScreenProps) {
  const totalTopics = jvmCurriculum.reduce((total, module) => total + module.topics.length, 0);
  const totalHours = jvmCurriculum.reduce((total, module) => total + module.estimatedHours, 0);

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">JVM Learning Platform</h1>
          <p className="text-lg text-muted-foreground">
            Oracle公式ドキュメントに準拠したJava仮想マシンの総合学習プラットフォーム
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <BookOpen className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">体系化された学習</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                Oracle公式ドキュメントに基づいた構造化されたカリキュラム
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Code className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">実践的な例</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                理論と実装を組み合わせたインタラクティブな学習体験
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Target className="w-8 h-8 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">進捗管理</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground">
                個人の学習進捗とノートを継続的に記録・追跡
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>学習カリキュラム概要</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {jvmCurriculum.map((module) => (
                  <div key={module.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-accent-foreground">
                        {module.id === 'jvm-overview' ? '1' : 
                         module.id === 'memory-management' ? '2' :
                         module.id === 'class-loading' ? '3' : '4'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {module.difficulty === 'beginner' ? '初級' :
                           module.difficulty === 'intermediate' ? '中級' : '上級'}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {module.estimatedHours}時間
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-3">学習統計</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">総モジュール数</span>
                      <span className="font-medium">{jvmCurriculum.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">総トピック数</span>
                      <span className="font-medium">{totalTopics}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">推定学習時間</span>
                      <span className="font-medium">{totalHours}時間</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-lg p-4">
                  <h4 className="font-medium mb-2">学習の進め方</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• 各モジュールを順番に学習</li>
                    <li>• コード例で理解を深める</li>
                    <li>• ノート機能で復習に活用</li>
                    <li>• 完了マークで進捗を管理</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button onClick={onStartLearning} size="lg" className="px-8">
            <BookOpen className="w-5 h-5 mr-2" />
            学習を開始する
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            初回学習では「JVM概要」から始めることをお勧めします
          </p>
        </div>
      </div>
    </div>
  );
}