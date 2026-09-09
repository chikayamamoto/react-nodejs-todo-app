import { useEffect, useState } from 'react'
import TodoForm from './components/TodoForm';
// ToDoの型をインターフェースとして定義する
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
}
function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  console.log('API URL:', apiUrl);
  // APIにリクエストを送信し、ToDo一覧を取得する関数
  async function fetchTodos(): Promise<Todo[]> {
    const res = await fetch(`${apiUrl}/todos`);

    if (!res.ok) throw new Error('ToDo一覧の取得に失敗しました。');

    return res.json();
  };

  // ToDo一覧を取得し、状態変数を更新する関数
  async function syncTodos() {
    const todos = await fetchTodos();
    setTodos(todos);
  }

  // コンポーネントがマウントされたときの初期化処理
  useEffect(() => {
    async function initApp() {
      try {
        // ToDo一覧を取得し、状態変数を更新する
        await syncTodos();
      } catch (err) {
        alert((err as Error).message);
      }
    }

    initApp();
  }, []);

  // APIにリクエストを送信し、ToDoを追加する関数
  async function addTodo(title: string) {
    const res = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });

    if (!res.ok) throw new Error('ToDoの追加に失敗しました。');
  };

  return (
    <>
      <h2>ToDo一覧</h2>
      <TodoForm
        onSubmit={async (title) => {
          try {
            await addTodo(title);
            await syncTodos();
          } catch (err) {
            alert((err as Error).message);
          }
        }}
      />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <strong>{todo.title}</strong>
            （作成日時: {new Date(todo.createdAt).toLocaleString('ja-JP')}）
            {todo.completed ? '✅' : ''}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
