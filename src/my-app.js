// src/my-app.js
import { LitElement, html, css } from '../lib/lit-all.min.js';
import tailwindStyles from '../lib/tailwind-styles.css' with { type: 'css' };
import customStyles from '../lib/custom-styles.css' with { type: 'css' };
import './todo-list.js';

export class MyApp extends LitElement {

	static styles = [tailwindStyles, customStyles,
		css`
			.github-link {
					position: relative;
					float: right;
					width: 24px;
					height: 24px;
			}
			.github-link svg {
					fill: #333;
					transition: fill 0.3s ease;
			}
			.github-link:hover svg {
					fill: #0366d6;
			}
			.container {
			  max-width: 450px;
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
		`];


	render() {
		return html`
		<div class="container mx-auto px-4">
	            <div class="github-link"><a href="https://github.com/yourusername/yourrepo" target="_blank" rel="noopener noreferrer">
                <svg height="24" width="24" viewBox="0 0 16 16" version="1.1" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </a></div>
					<h1 class="text-xl text-red-500">Todo List</h1>
	<p>This is a basic Todo Web App.</p>
	<p>You can add tasks, marked them as completed and remove them individually or all completed at once.</p>
	<p>Your tasks are 100% private and are only stored in your browser.</p>
	<p>It was created as an experiment to build reactive web apps (PWAs) without any build tools or network requests. This is not only useful for building transparent and trusted web apps but also chrome extensions. It leverages the Lit framework to build the reative UI and IndexedDB to remember tasks between browser sessions.	</p>
	<p> ... now, get on with your todo list! :)</p>
          <todo-list></todo-list>
				</div>
        `;
	}
}

customElements.define('my-app', MyApp);
