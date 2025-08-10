export interface Topic {
  id: string;
  title: string;
  description: string;
  content: string;
  codeExample?: string;
  duration: number; // in minutes
}

export interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
}

export const jvmCurriculum: Module[] = [
  {
    id: 'jvm-overview',
    title: 'JVM概要',
    description: 'Java仮想マシンの基本概念とアーキテクチャを学習します',
    difficulty: 'beginner',
    estimatedHours: 2,
    topics: [
      {
        id: 'what-is-jvm',
        title: 'JVMとは何か',
        description: 'Java仮想マシンの役割と重要性',
        duration: 20,
        content: `
# JVMとは何か

Java仮想マシン（JVM）は、Javaバイトコードを実行するランタイム環境です。

## 主な特徴

1. **プラットフォーム独立性**: "Write Once, Run Anywhere"を実現
2. **メモリ管理**: 自動的なガベージコレクション
3. **セキュリティ**: サンドボックス環境での安全な実行
4. **最適化**: 実行時コンパイルによる性能向上

## JVMの役割

- Javaバイトコードの解釈・実行
- メモリ管理とガベージコレクション
- セキュリティの提供
- 他のJVM言語（Kotlin、Scala等）のサポート
        `,
        codeExample: `// Java コード例
public class HelloJVM {
    public static void main(String[] args) {
        System.out.println("Hello, JVM!");
        
        // JVMが自動的にメモリ管理を行う
        String message = "JVMによって管理される";
        Object obj = new Object();
        
        // ガベージコレクションが不要なオブジェクトを回収
    }
}`
      },
      {
        id: 'jvm-architecture',
        title: 'JVMアーキテクチャ',
        description: 'JVMの内部構造とコンポーネント',
        duration: 30,
        content: `
# JVMアーキテクチャ

JVMは複数のコンポーネントから構成されています。

## 主要コンポーネント

### 1. クラスローダサブシステム
- バイトコードの読み込み
- クラスの検証、準備、解決

### 2. ランタイムデータエリア
- **メソッドエリア**: クラス情報、定数プール
- **ヒープ**: オブジェクトインスタンス
- **JVMスタック**: メソッド呼び出し情報
- **PCレジスタ**: 実行中の命令アドレス
- **ネイティブメソッドスタック**: ネイティブメソッド情報

### 3. 実行エンジン
- インタープリター: バイトコードの逐次実行
- JITコンパイラ: 頻繁に使用されるコードの最適化
- ガベージコレクタ: 不要なオブジェクトの回収
        `,
        codeExample: `// JVMアーキテクチャを理解するための例
public class ArchitectureDemo {
    // メソッドエリアに格納されるクラス情報
    private static final String CONSTANT = "定数プール";
    
    public static void main(String[] args) {
        // ヒープにオブジェクトが作成される
        ArchitectureDemo demo = new ArchitectureDemo();
        
        // JVMスタックにメソッドフレームが作成される
        demo.demonstrateMemory();
    }
    
    private void demonstrateMemory() {
        // ローカル変数はJVMスタックに格納
        int localVar = 42;
        
        // オブジェクトはヒープに作成
        StringBuilder sb = new StringBuilder("JVM");
        sb.append("アーキテクチャ");
    }
}`
      }
    ]
  },
  {
    id: 'memory-management',
    title: 'メモリ管理',
    description: 'JVMのメモリ構造とガベージコレクションの仕組み',
    difficulty: 'intermediate',
    estimatedHours: 3,
    topics: [
      {
        id: 'heap-memory',
        title: 'ヒープメモリ',
        description: 'オブジェクトが格納されるヒープメモリの構造',
        duration: 25,
        content: `
# ヒープメモリ

ヒープはJVMでオブジェクトインスタンスが格納される主要なメモリ領域です。

## ヒープの構造

### 1. 若い世代（Young Generation）
- **Eden領域**: 新しいオブジェクトが最初に配置
- **Survivor領域（S0、S1）**: 少なくとも1回のGCを生き残ったオブジェクト

### 2. 老い世代（Old Generation）
- 長期間使用されるオブジェクトが格納
- 若い世代から昇格したオブジェクト

### 3. メタスペース（Java 8以降）
- クラスのメタデータを格納
- 以前のPermanent Generation（PermGen）に代わる領域

## メモリ配置の流れ

1. 新しいオブジェクト → Eden領域
2. Eden領域満杯 → Minor GC実行
3. 生き残ったオブジェクト → Survivor領域
4. 一定回数生き残ったオブジェクト → Old Generation
        `,
        codeExample: `// ヒープメモリ使用例
public class HeapDemo {
    public static void main(String[] args) {
        // Eden領域にオブジェクトが作成される
        for (int i = 0; i < 1000; i++) {
            String str = new String("Object " + i);
            
            if (i % 100 == 0) {
                // 参照を保持 → Old Generationに昇格する可能性
                System.out.println(str);
            }
            // 参照を保持しない → Minor GCで回収される
        }
        
        // 大きなオブジェクトは直接Old Generationに配置される場合がある
        int[] largeArray = new int[1000000];
        
        // 明示的なGC要求（推奨されない）
        // System.gc();
    }
}`
      },
      {
        id: 'garbage-collection',
        title: 'ガベージコレクション',
        description: 'ガベージコレクションの仕組みとアルゴリズム',
        duration: 35,
        content: `
# ガベージコレクション

ガベージコレクション（GC）は、不要になったオブジェクトを自動的に回収するJVMの機能です。

## GCの種類

### 1. Minor GC
- 若い世代で発生
- 頻繁に実行される
- 実行時間が短い

### 2. Major GC
- 老い世代で発生
- 実行頻度は低い
- 実行時間が長い

### 3. Full GC
- ヒープ全体で発生
- 最も実行時間が長い
- アプリケーションの停止時間に影響

## 主要なGCアルゴリズム

### Serial GC
- シングルスレッドで実行
- 小規模アプリケーション向け

### Parallel GC
- マルチスレッドで実行
- スループット重視

### G1 GC
- 低レイテンシーを目指す
- 大きなヒープサイズに適用

### ZGC/Shenandoah
- 超低レイテンシー
- 最新のGCアルゴリズム
        `,
        codeExample: `// GCの動作を観察するためのコード例
public class GCDemo {
    private static final int ALLOCATION_SIZE = 1024 * 1024; // 1MB
    
    public static void main(String[] args) {
        System.out.println("GCデモンストレーション開始");
        
        // メモリ使用量を監視
        Runtime runtime = Runtime.getRuntime();
        
        for (int i = 0; i < 100; i++) {
            // 大量のオブジェクトを作成
            allocateMemory();
            
            if (i % 10 == 0) {
                long usedMemory = runtime.totalMemory() - runtime.freeMemory();
                System.out.println("使用メモリ: " + usedMemory / (1024 * 1024) + "MB");
            }
        }
    }
    
    private static void allocateMemory() {
        // 短命なオブジェクトを大量作成
        byte[] array = new byte[ALLOCATION_SIZE];
        
        // 処理を行う（実際のアプリケーションをシミュレート）
        for (int i = 0; i < array.length; i += 1024) {
            array[i] = (byte) (i % 256);
        }
        
        // メソッド終了時にarrayは到達不可能になり、GCの対象となる
    }
}`
      }
    ]
  },
  {
    id: 'class-loading',
    title: 'クラスローディング',
    description: 'クラスローダの仕組みとクラスの動的読み込み',
    difficulty: 'intermediate',
    estimatedHours: 2,
    topics: [
      {
        id: 'classloader-basics',
        title: 'クラスローダの基本',
        description: 'クラスローダの役割と階層構造',
        duration: 30,
        content: `
# クラスローダの基本

クラスローダは、バイトコードファイル（.classファイル）をJVMに読み込む責任を持つコンポーネントです。

## クラスローダの階層

### 1. Bootstrap ClassLoader
- JVMの一部として実装
- java.langパッケージなどのコアクラスを読み込み
- 親クラスローダが存在しない

### 2. Extension ClassLoader（Platform ClassLoader）
- Java 9以降はPlatform ClassLoaderに名称変更
- JVMの拡張ライブラリを読み込み
- Bootstrap ClassLoaderを親に持つ

### 3. Application ClassLoader（System ClassLoader）
- アプリケーションのクラスパスからクラスを読み込み
- Extension/Platform ClassLoaderを親に持つ
- ユーザーアプリケーションのメインクラスローダ

## 委譲モデル（Delegation Model）

クラスローダは親に委譲してからクラスを読み込むことで、セキュリティとクラスの一意性を保証します。

1. 親クラスローダに委譲
2. 親が見つからない場合、自分で検索
3. 見つからない場合、ClassNotFoundExceptionを投げる
        `,
        codeExample: `// クラスローダの確認
public class ClassLoaderDemo {
    public static void main(String[] args) {
        // 現在のクラスのクラスローダを取得
        ClassLoader currentClassLoader = ClassLoaderDemo.class.getClassLoader();
        System.out.println("Current ClassLoader: " + currentClassLoader);
        
        // 親クラスローダを取得
        ClassLoader parentClassLoader = currentClassLoader.getParent();
        System.out.println("Parent ClassLoader: " + parentClassLoader);
        
        // Bootstrap ClassLoaderはnullとして表示される
        ClassLoader bootstrapClassLoader = parentClassLoader.getParent();
        System.out.println("Bootstrap ClassLoader: " + bootstrapClassLoader);
        
        // システムクラス（String）のクラスローダ
        ClassLoader stringClassLoader = String.class.getClassLoader();
        System.out.println("String ClassLoader: " + stringClassLoader);
        
        // 実行時にクラスを動的に読み込み
        try {
            Class<?> dynamicClass = Class.forName("java.util.ArrayList");
            System.out.println("動的に読み込まれたクラス: " + dynamicClass.getName());
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}`
      }
    ]
  },
  {
    id: 'performance-tuning',
    title: 'パフォーマンスチューニング',
    description: 'JVMのパフォーマンス最適化手法',
    difficulty: 'advanced',
    estimatedHours: 4,
    topics: [
      {
        id: 'jvm-options',
        title: 'JVMオプション',
        description: '重要なJVMオプションと設定方法',
        duration: 40,
        content: `
# JVMオプション

JVMの動作をカスタマイズするためのコマンドラインオプションについて学習します。

## メモリ関連オプション

### ヒープサイズ設定
- **-Xms**: 初期ヒープサイズ
- **-Xmx**: 最大ヒープサイズ
- **-XX:NewRatio**: Old/Young世代の比率
- **-XX:SurvivorRatio**: Eden/Survivor領域の比率

### メタスペース設定（Java 8以降）
- **-XX:MetaspaceSize**: 初期メタスペースサイズ
- **-XX:MaxMetaspaceSize**: 最大メタスペースサイズ

## ガベージコレクション関連

### GCアルゴリズム選択
- **-XX:+UseSerialGC**: Serial GC
- **-XX:+UseParallelGC**: Parallel GC
- **-XX:+UseG1GC**: G1 GC
- **-XX:+UseZGC**: ZGC（Java 11以降）

### GCチューニング
- **-XX:MaxGCPauseMillis**: 最大GC停止時間目標
- **-XX:GCTimeRatio**: スループット目標
- **-XX:+UseStringDeduplication**: 文字列重複排除

## デバッグ・監視オプション

### GCログ
- **-Xloggc**: GCログファイル指定
- **-XX:+PrintGCDetails**: 詳細GC情報
- **-XX:+PrintGCTimeStamps**: タイムスタンプ表示

### ヒープダンプ
- **-XX:+HeapDumpOnOutOfMemoryError**: OOM時にヒープダンプ
- **-XX:HeapDumpPath**: ダンプファイルパス
        `,
        codeExample: `// JVMオプション使用例のコマンド
// 
// 基本的なメモリ設定
// java -Xms512m -Xmx2g MyApplication
//
// G1 GCを使用した設定
// java -XX:+UseG1GC -XX:MaxGCPauseMillis=200 MyApplication
//
// 本格的なプロダクション設定例
// java -Xms4g -Xmx4g \\
//      -XX:+UseG1GC \\
//      -XX:MaxGCPauseMillis=100 \\
//      -XX:+UseStringDeduplication \\
//      -XX:+HeapDumpOnOutOfMemoryError \\
//      -XX:HeapDumpPath=/app/logs/ \\
//      -Xloggc:/app/logs/gc.log \\
//      -XX:+PrintGCDetails \\
//      -XX:+PrintGCTimeStamps \\
//      MyApplication

public class JVMOptionsDemo {
    public static void main(String[] args) {
        // ランタイム情報の取得
        Runtime runtime = Runtime.getRuntime();
        
        System.out.println("=== JVM メモリ情報 ===");
        System.out.println("最大メモリ: " + formatMemory(runtime.maxMemory()));
        System.out.println("総メモリ: " + formatMemory(runtime.totalMemory()));
        System.out.println("空きメモリ: " + formatMemory(runtime.freeMemory()));
        System.out.println("使用メモリ: " + formatMemory(runtime.totalMemory() - runtime.freeMemory()));
        
        System.out.println("\\n=== JVM システム情報 ===");
        System.out.println("JVM名: " + System.getProperty("java.vm.name"));
        System.out.println("JVMバージョン: " + System.getProperty("java.vm.version"));
        System.out.println("JVMベンダー: " + System.getProperty("java.vm.vendor"));
        System.out.println("プロセッサ数: " + runtime.availableProcessors());
    }
    
    private static String formatMemory(long bytes) {
        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
    }
}`
      }
    ]
  }
];

export interface UserProgress {
  completedTopics: Set<string>;
  currentModule: string | null;
  currentTopic: string | null;
  notes: Record<string, string>;
  lastAccessed: Date;
}

export function calculateProgress(userProgress: UserProgress): number {
  const totalTopics = jvmCurriculum.reduce((total, module) => total + module.topics.length, 0);
  const completedCount = userProgress.completedTopics.size;
  return totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0;
}

export function getNextTopic(currentModuleId: string, currentTopicId: string): { moduleId: string; topicId: string } | null {
  const currentModule = jvmCurriculum.find(m => m.id === currentModuleId);
  if (!currentModule) return null;
  
  const currentTopicIndex = currentModule.topics.findIndex(t => t.id === currentTopicId);
  
  // 同じモジュール内の次のトピック
  if (currentTopicIndex < currentModule.topics.length - 1) {
    return {
      moduleId: currentModuleId,
      topicId: currentModule.topics[currentTopicIndex + 1].id
    };
  }
  
  // 次のモジュールの最初のトピック
  const currentModuleIndex = jvmCurriculum.findIndex(m => m.id === currentModuleId);
  if (currentModuleIndex < jvmCurriculum.length - 1) {
    const nextModule = jvmCurriculum[currentModuleIndex + 1];
    if (nextModule.topics.length > 0) {
      return {
        moduleId: nextModule.id,
        topicId: nextModule.topics[0].id
      };
    }
  }
  
  return null;
}