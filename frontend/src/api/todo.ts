// ToDoの型をインターフェースとして定義する
interface Todo {
 id: number;
 title: string;
 completed: boolean;
 createdAt: Date;
}

const apiUrl = import.meta.env.VITE_API_URL;

// APIにリクエストを送信し、ToDo一覧を取得する関数
export async function fetchTodos(): Promise<Todo[]> {
 const res = await fetch(`${apiUrl}/todos`);

 if (!res.ok) throw new Error('ToDo一覧の取得に失敗しました。');

 return res.json();
};

// APIにリクエストを送信し、ToDoを追加する関数
export async function addTodo(title: string) {
 const res = await fetch(`${apiUrl}/todos`, {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ title }),
 });

 if (!res.ok) throw new Error('ToDoの追加に失敗しました。');
};

// APIにリクエストを送信し、ToDoを更新する関数
export async function updateTodo(id: number, title: string, completed: boolean) {
 const res = await fetch(`${apiUrl}/todos/${id}`, {
   method: 'PUT',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ title, completed }),
 });

 if (!res.ok) throw new Error('ToDoの更新に失敗しました。');
};

// APIにリクエストを送信し、ToDoを削除する関数
export async function deleteTodo(id: number) {
 const res = await fetch(`${apiUrl}/todos/${id}`, {
   method: 'DELETE',
 });

 if (!res.ok) throw new Error('ToDoの削除に失敗しました。');
};