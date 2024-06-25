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
        todo: { type: Object, state: true },
        parentDeleteTodo: { type: Function },
				parentToggleTodo: { type: Function }, 
    };
    render() {
        return html`
          <li class="todo">
            <input 
              type="checkbox" 
							.checked=${this.todo.completed}
              @change=${this.parentToggleTodo}
            >
            <span style="${this.todo.completed ? 'text-decoration: line-through;' : ''}">
              ${this.todo.text}
            </span>
            <button class="delete-btn" @click=${this.parentDeleteTodo}>&times;</button> 
          </li>
        `;
    }
}
customElements.define('todo-item', TodoItem);
