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
		//  this.deleteTodo = this.deleteTodo.bind(this); 	
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
	deleteAllCompleted() {
		const transaction = this.db.transaction(['todos'], 'readwrite');
		const objectStore = transaction.objectStore('todos');
		const request = objectStore.openCursor();

		request.onsuccess = (event) => {
			const cursor = event.target.result;
			if (cursor) {
				const todo = cursor.value;
				if (todo.completed) {
					const deleteRequest = cursor.delete();
					deleteRequest.onsuccess = () => {
						// Continue to the next item
						cursor.continue();
					};
				} else {
					cursor.continue();
				}
			} else {
				// All done - reload the todos
				this.loadTodos();
			}
		};

		request.onerror = (event) => {
			console.error('Error deleting completed todos:', event.target.error);
		};
	}

	deleteTodo(id) {
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
	toggleTodo(id) {
		const transaction = this.db.transaction(['todos'], 'readwrite');
		const objectStore = transaction.objectStore('todos');
		const getRequest = objectStore.get(id);
		getRequest.onsuccess = (event) => {
			console.log("getRequest",event.target.result);
			const item = event.target.result;
			if (item) {
				item.completed = !item.completed; // Toggle the property
				const request = objectStore.put(item); // Update the item in the store
				request.onsuccess = (event) => {
					console.log("request",event.target.result);
					this.loadTodos();
					// this.requestUpdate(); // Wll only update this component. Not parent delete-all button.
				}
				request.onerror = (event) => {
					console.error('Error updating todo:', event.target.error);
				};
			}
		}
	}
	render() {
		const hasCompletedTasks = this.todos.some(todo => todo.completed); // Check for completed tasks
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
              ${this.todos.map((todo) => html`
                <todo-item 
                  .todo=${todo} 
                  .parentDeleteTodo=${() => this.deleteTodo(todo.id)} 
                  .parentToggleTodo=${() => this.toggleTodo(todo.id)} 
                ></todo-item>
              `)}
            </ul>
			      <button 
      			  @click=${this.deleteAllCompleted} 
        			?disabled=${!hasCompletedTasks}  
      			>
							Delete Completed
						</button>

          </div>
        `;
	}
}

customElements.define('my-app', MyApp);
