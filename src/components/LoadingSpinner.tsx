/**
 * ローディングスピナーコンポーネント
 * アクセシビリティとパフォーマンスを考慮
 */
export function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center" role="status" aria-label="読み込み中">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    </div>
  );
}