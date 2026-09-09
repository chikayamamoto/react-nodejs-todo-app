import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { query, exec, closePool } from './db';

// 型をインポートする
import type { Request, Response } from 'express';

// ToDoの型をインターフェースとして定義する
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}
// .envファイルを読み込む
dotenv.config();

// 環境変数からポート番号を取得する
const port = Number(process.env.PORT) || 3000;

// Webサーバーの土台を作成する
const app = express();

// CORSの設定を行う
app.use(cors({
  origin: 'http://localhost:5173',  // 許可するオリジン
  methods: ['GET', 'POST']          // 許可するHTTPメソッド
}));

// JSON形式のリクエストボディを解析するミドルウェアを追加する
app.use(express.json());

// サーバーエラーを処理する関数
function handleServerError(res: Response, err: unknown, message: string = 'サーバーエラー') {
  console.error(err);
  res.status(500).json({ error: message });
}
// ToDoの全データを返すルート
app.get('/api/todos', async (req: Request, res: Response) => {
  try {
    const sql = 'SELECT id, title, completed, created_at AS createdAt FROM todos ORDER BY createdAt DESC';
    const rows = await query<Todo>(sql);

    res.status(200).json(rows);
  } catch (err) {
    handleServerError(res, err);
  }
});
// ToDoを追加するルート
app.post('/api/todos', async (req: Request, res: Response) => {
  const { title }: { title: string } = req.body;

  if (!title.trim()) {
    res.status(400).json({ error: 'ToDoを入力してください。' });
    return;
  }
  if (title.trim().length > 50) {
    res.status(400).json({ error: 'ToDoは50文字以内で入力してください。' });
    return;
  }

  try {
    const sql = 'INSERT INTO todos (title, completed, created_at) VALUES (?, ?, ?)';
    const params = [title, false, new Date()];

    await exec(sql, params);

    res.status(201).json({ message: 'ToDoを追加しました。' });
  } catch (err) {
    handleServerError(res, err);
  }
});
// 定義したルート以外へのアクセスに対する処理（404 Not Found）
app.use((req: Request, res: Response) => {
  res.status(404).set('Content-Type', 'text/html; charset=utf-8');
  res.send('<h1>ページが見つかりませんでした。</h1>');
});

// アプリ終了時にDB接続プールを安全に破棄する
['SIGINT', 'SIGTERM', 'SIGHUP'].forEach(signal => {
  process.on(signal, async () => {
    console.log(`\n${signal}を受信。アプリケーションの終了処理中...`);
    await closePool();
    process.exit();
  });
})

// Webサーバーを指定したポートで起動する
app.listen(port, () => {
  console.log(`Webサーバーが起動しました。`);
});