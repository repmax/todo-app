// src/my-app.js
import { LitElement, html, css } from './lit-all.min.js';
import { TodoItem } from './todo-item.js';

export class MyApp extends LitElement {
	static styles = css`
        .container {
          width: 500px;
          margin: 0 auto;
          font-family: sans-serif;
        }
        input[type="text"] {
          width: 100%;
          padding: 10px;
          box-sizing: border-box;
          border: 1px solid #ccc;
          margin-bottom: 10px;
        }
      `;

	static properties = {
		todos: { state: true },
		newTodo: { state: true },
	};

	constructor() {
		super();
		this.todos = []; // Start with an empty array
		this.newTodo = '';
		this.db = null;
		this.initDB(); // Initialize IndexedDB
	}

	initDB() {
		const request = indexedDB.open('todoDB', 1);

		request.onerror = (event) => {
			console.error('Error opening database:', event.target.error);
		};

		request.onupgradeneeded = (event) => {
			const db = event.target.result;
			const objectStore = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
			objectStore.createIndex('text', 'text', { unique: false });
		};

		request.onsuccess = (event) => {
			this.db = event.target.result;
			this.loadTodos(); // Load existing todos from the database
		};
	}

	loadTodos() {
		console.log("loadTodos");
		const transaction = this.db.transaction(['todos'], 'readonly');
		const objectStore = transaction.objectStore('todos');
		const request = objectStore.getAll();

		request.onsuccess = (event) => {
			this.todos = event.target.result;
			console.log(this.todos);
		};

		request.onerror = (event) => {
			console.error('Error loading todos:', event.target.error);
		};
	}

	addTodo() {
		if (this.newTodo) {
			const newTodo = {
				text: this.newTodo,
				completed: false,
				timestamp: Date.now() // Add timestamp
			};

			const transaction = this.db.transaction(['todos'], 'readwrite');
			const objectStore = transaction.objectStore('todos');
			const request = objectStore.add(newTodo);

			request.onsuccess = () => {
				this.loadTodos(); // Refresh todos after adding
				this.newTodo = '';
			};

			request.onerror = (event) => {
				console.error('Error adding todo:', event.target.error);
			};
		}
	}

	deleteTodo(id) {
		console.log("deleteTodo", id);
		const transaction = this.db.transaction(['todos'], 'readwrite');
		const objectStore = transaction.objectStore('todos');
		const request = objectStore.delete(id);

		request.onsuccess = () => {
			this.loadTodos(); // Refresh todos after deleting
		};

		request.onerror = (event) => {
			console.error('Error deleting todo:', event.target.error);
		};
	}

	render() {
		return html`
          <div class="container">
            <h1>Todo List</h1>
            <input 
              type="text" 
              placeholder="Add a new todo..."
              .value=${this.newTodo}
              @input=${(e) => this.newTodo = e.target.value}
            >
            <button @click=${this.addTodo}>Add</button>

            <ul>
              ${this.todos.map((todo, index) => html`
                <todo-item 
                  .todo=${todo} 
									.db=${this.db} 
                  .onDelete=${() => this.deleteTodo(todo.id)} 
                ></todo-item>
              `)}
            </ul>
          </div>
        `;
	}
}

customElements.define('my-app', MyApp);
