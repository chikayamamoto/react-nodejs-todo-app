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
  const [editingId, setEditingId] = useState<number | null>(null);
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
  // APIにリクエストを送信し、ToDoを更新する関数
  async function updateTodo(id: number, title: string, completed: boolean) {
    const res = await fetch(`${apiUrl}/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, completed }),
    });

    if (!res.ok) throw new Error('ToDoの更新に失敗しました。');
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
            {editingId === todo.id ? (
              // 編集ボタンが押されたときは、編集用フォームを表示する
              <>
                <TodoForm
                  onSubmit={async (title) => {
                    try {
                      await updateTodo(todo.id, title, todo.completed);
                      setEditingId(null);
                      await syncTodos();
                    } catch (err) {
                      alert((err as Error).message);
                    }
                  }}
                  initialTitle={todo.title}
                  submitLabel="更新"
                />
                <button onClick={() => setEditingId(null)}>キャンセル</button>
              </>
            ) : (
              // 編集ボタンが押されていないときは、通常どおり表示する
              <>
                <strong>{todo.title}</strong>
                （作成日時: {new Date(todo.createdAt).toLocaleString('ja-JP')}）
                <button
                  onClick={async () => {
                    try {
                      await updateTodo(todo.id, todo.title, !todo.completed);
                      await syncTodos();
                    } catch (err) {
                      alert((err as Error).message);
                    }
                  }}
                  style={{ marginRight: '0.5em' }}
                >
                  {todo.completed ? '✅' : '☐'}
                </button>
                <button onClick={() => setEditingId(todo.id)}>編集</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default App
