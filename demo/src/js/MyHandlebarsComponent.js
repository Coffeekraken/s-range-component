import STemplateWebComponentClass from '../../../dist/class';
import handlebars from 'handlebars'

class MyHandlebarsComponent extends STemplateWebComponentClass {

	static get defaultProps() {
		return {
			title : 'My todos',
			display : false
		}
	}

	static get defaultTemplateData() {
		return {
			currentSelect : {},
			currentTodo : {
				title : '',
				done : false
			},
			title : '@props.title',
			display : '@props.display',
			todos : [{
				id : 0,
				title : 'Be awesome today',
				done : false
			}, {
				id : 1,
				title : 'Beat the ass of Nicolas',
				done : true
			}]
		}
	}

	componentMount() {
		super.componentMount();

		setTimeout(() => {
			this.data.currentTodo = {
				id : 11,
				done : true,
				title : 'hello world'
			};
			// setTimeout(() => {
				this.data.title = 'hello';
			// },2);
		}, 2000);

		// setTimeout(() => {
		// 	this.data.todos.push({
		// 		id : 10,
		// 		title : 'Plop',
		// 		done : false
		// 	});
		// }, 1000);
		// setTimeout(() => {
		// 	setTimeout(() => {
		// 		this.setProp('title', 'Ploup');
		// 	}, 1000);
		// 	this.setProp('display', true);
		// }, 2000);
	}

	templateDidRenderFirst(node) {
		super.templateDidRenderFirst(node);
		// listen for validating new todo
		this.refs.newTodo.addEventListener('keyup', (e) => {
			e.preventDefault();
			switch(e.keyCode) {
				case 13:
					if (this.data.todos.indexOf(this.data.currentTodo) === -1) {
						// add the todo
						this.data.todos.push(this.data.currentTodo);
					}
					// reset current todo
					this.data.currentTodo = {
						title : '',
						done : false
					};
				break;
			}
		});
	}

	update(todo) {
		this.data.currentTodo = todo;
	}
	markAsRead(todo) {
		todo.done = true;
	}

	render() {
		const template = handlebars.compile(`
			<h1>{{title}}</h1>
			<input type="text" name="newTodo" s-template-model="currentTodo.title" s-template-model-timeout="1000" />
			<button onclick="console.log($this); $this.data.title = Math.random() * 99999;">
				console log my handlebars
			</button>
			<br>
			<select s-template-model="currentSelect">
				<option>Choose a todo...</option>
				{{#each todos}}
					<option value="$this.data.todos[{{@key}}]">{{this.title}}</option>
				{{/each}}
			</select>
			<button onclick="$this.markAsRead($this.data.currentSelect)">Mark as read</button>
			<br>
			<ul>
				{{#each todos}}
					<li>
						<input type="checkbox" s-template-model="todos[{{@key}}].done" />
						<span {{#if this.done}} style="opacity:.4;" {{/if}} onclick="$this.update($this.data.todos[{{@key}}])">{{this.title}}</span>
					</li>
				{{/each}}
			</ul>
		`);
		super.render(template(this.data));
	}
}

MyHandlebarsComponent.define('my-handlebars', MyHandlebarsComponent);
