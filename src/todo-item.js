// src/todo-item.js
import { LitElement, html, css } from './lit-all.min.js';

export class TodoItem extends LitElement {
    static styles = css`
        .todo {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }
        .todo input[type="checkbox"] {
          margin-right: 10px;
        }
        .delete-btn {
          margin-left: auto; 
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2em;
        }
      `;

    static properties = {
        todo: { type: Object },
        onDelete: { type: Function },
        db: { type: Object } 
    };

    toggleTodo() {
        this.todo.completed = !this.todo.completed;
        const transaction = this.db.transaction(['todos'], 'readwrite');
        const objectStore = transaction.objectStore('todos');
        const request = objectStore.put(this.todo);
        console.log("this",this.todo);
        request.onerror = (event) => {
            console.error('Error updating todo:', event.target.error);
        };
        this.requestUpdate(); // Notify Lit about the change
    }

    render() {
        return html`
          <li class="todo">
            <input 
              type="checkbox" 
              .checked=${this.todo.completed} 
              @change=${this.toggleTodo}
            >
            <span style="${this.todo.completed ? 'text-decoration: line-through;' : ''}">
              ${this.todo.text}
            </span>
            <button class="delete-btn" @click=${this.onDelete}>&times;</button> 
          </li>
        `;
    }
}
customElements.define('todo-item', TodoItem);
