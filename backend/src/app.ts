import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// 型をインポートする
import type { Request, Response } from 'express';

// .envファイルを読み込む
dotenv.config();

// 環境変数からポート番号を取得する
const port = Number(process.env.PORT) || 3000;

// Webサーバーの土台を作成する
const app = express();

// CORSの設定を行う
app.use(cors({
 origin: 'http://localhost:5173',  // 許可するオリジン
 methods: ['GET']                  // 許可するHTTPメソッド
}));

// ToDoの全データ
const todos = [
 { id: 1, title: 'Reactを勉強する', completed: true, createdAt: new Date() },
 { id: 2, title: 'Node.jsを勉強する', completed: true, createdAt: new Date() },
 { id: 3, title: 'ToDoアプリを作る', completed: false, createdAt: new Date() },
];

// ToDoの全データを返すルート
app.get('/api/todos', (req: Request, res: Response) => {
 // ToDoの全データをJSON形式に変換して返す
 res.json(todos);
});

// 定義したルート以外へのアクセスに対する処理（404 Not Found）
app.use((req: Request, res: Response) => {
 res.status(404).set('Content-Type', 'text/html; charset=utf-8');
 res.send('<h1>ページが見つかりませんでした。</h1>');
});

// Webサーバーを指定したポートで起動する
app.listen(port, () => {
 console.log(`Webサーバーが起動しました。`);
});