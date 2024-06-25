// src/my-app.js
import { LitElement, html, css } from '../lib/lit-all.min.js';
import tailwindStyles from '../lib/tailwind-styles.css' with { type: 'css' };
import './todo-list.js';

export class MyApp extends LitElement {
    static styles = [tailwindStyles];


	render() {
		return html`
					<h1 class="text-xl text-red-500">My App</h1>
          <todo-list></todo-list>
        `;
	}
}

customElements.define('my-app', MyApp);
