import { LitElement, html, css } from '../lib/lit-all.min.js';
import tailwindStyles from '../lib/tailwind-styles.css' with { type: 'css' };
import customStyles from '../lib/custom-styles.css' with { type: 'css' };
import './todo-item.js';

export class TodoApp extends LitElement {
	static styles = [tailwindStyles, customStyles];

	static properties = {
		todos: { state: true },
		newTodo: { state: true },
	};

	constructor() {
		super();
		this.todos = []; 
		this.newTodo = '';
		this.db = null;
		this.initDB(); 
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
			this.loadTodos();
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
			console.log("getRequest", event.target.result);
			const item = event.target.result;
			if (item) {
				item.completed = !item.completed; // Toggle the property
				const request = objectStore.put(item); // Update the item in the store
				request.onsuccess = (event) => {
					console.log("request", event.target.result);
					this.loadTodos();
					// this.requestUpdate(); // Wll only update this component. Not parent delete-all button.
				}
				request.onerror = (event) => {
					console.error('Error updating todo:', event.target.error);
				};
			}
		}
	}
	handleKeyDown(e) {
		if (e.key === 'Enter' && this.newTodo.trim() !== '') {
			e.preventDefault(); // Prevent form submission if within a form
			this.addTodo();
		}
	}
	render() {
		const hasCompletedTasks = this.todos.some(todo => todo.completed); // Check for completed tasks
		return html`
		<div>
          <div class="todo-input-container">
            <input 
              type="text" 
              placeholder="Enter a new task..."
              .value=${this.newTodo}
              @input=${(e) => this.newTodo = e.target.value}
							@keydown=${this.handleKeyDown}
            >
            <button @click=${this.addTodo}
						?disabled=${this.newTodo.trim() === ''}
						><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg></button></div>

            <ul>
              ${this.todos.map((todo) => html`
                <todo-item 
                  .todo=${todo} 
                  .parentDeleteTodo=${() => this.deleteTodo(todo.id)} 
                  .parentToggleTodo=${() => this.toggleTodo(todo.id)} 
                ></todo-item>
              `)}
            </ul>
			      <button class="delete-completed"
      			  @click=${this.deleteAllCompleted}
        			?disabled=${!hasCompletedTasks}  
      			><span class="text-sm text-green-500">
						DELETE ALL COMPLETED
						</span>
						</button>
          </div>
        `;
	}
}

customElements.define('todo-app', TodoApp);
