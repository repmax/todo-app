// src/todo-item.js
import { LitElement, html, css } from '../lib/lit-all.min.js';
import tailwindStyles from '../lib/tailwind-styles.css' with { type: 'css' };

export class TodoItem extends LitElement {
    static styles = [tailwindStyles,
			css`
        .todo {
          display: flex;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #ccc;
        }
        .todo input[type="checkbox"] {
          margin-right: 5px;
        }
        .delete-btn {
          margin-left: auto; 
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.2em;
        }
      `];

    static properties = {
        todo: { type: Object, state: true },
        parentDeleteTodo: { type: Function },
				parentToggleTodo: { type: Function }, 
    };
    render() {
        return html`
          <li class="todo">
            <input 
							style="accent-color:green"
              type="checkbox" 
							.checked=${this.todo.completed}
              @change=${this.parentToggleTodo}
            >
            <span class="${!this.todo.completed ? '' : 'text-green-500'}">
              ${this.todo.text}
            </span>
            <button class="delete-btn" style="color:red" @click=${this.parentDeleteTodo}>&times;</button> 
          </li>
        `;
    }
}
customElements.define('todo-item', TodoItem);
