import STemplateWebComponentClass from '../../../dist/class';

class MyAppComponent extends STemplateWebComponentClass {

	static get defaultTemplateData() {
		return {
			title : 'My Cool App'
		}
	}

	componentMount() {
		super.componentMount();
		setTimeout(() => {
			this.data.title = 'Youhou!!! ' + Math.random()*99999;
		}, 2000);
	}

	render() {

		super.render(`
			<h1>${this.data.title}</h1>
			<p>Nunc non mauris porttitor, rutrum felis pharetra, eleifend ante. Duis aliquet tortor et ipsum tincidunt vestibulum. Pellentesque sagittis urna ut.</p>
			<button onclick="console.log($this);">
				console log my app
			</button>
			<my-handlebars title="Youp"></my-handlebars>
			<my-cool>
				<div slot="down">
					WELCOME
				</div>
				<div slot="up">
					<button onclick="console.log($this);">
						console log this cool
					</button>
				</div>
			</my-cool>
			<my-cool>
				<div slot="down">
					WELCOME
				</div>
				<div slot="up">
					<button onclick="console.log($this);">
						console log this cool
					</button>
				</div>
			</my-cool>
			<my-cool>
				<div slot="down">
					PLOUPI
				</div>
				<div slot="up">
					<button onclick="console.log($this);">
						console log this cool
					</button>
				</div>
			</my-cool>
			<my-cool>
				<div slot="down">
					IJOIEJIFO WEOF OEWJ
				</div>
				<div slot="up">
					<button onclick="console.log($this);">
						console log this cool
					</button>
				</div>
			</my-cool>
			<my-handlebars title="Youp"></my-handlebars>
		`);
		// super.render(`
		// 	<h1>${this.data.title}</h1>
		// 	<my-cool title="Hello"></my-cool>
		// 	<my-cool title="coco"></my-cool>
		// 	<my-cool title="Duis eu purus vitae metus posuere sollicitudin non ut erat."></my-cool>
		// 	<my-cool></my-cool>
		// 	<my-cool title="coco"></my-cool>
		// 	<my-cool></my-cool>
		// 	<my-cool title="coco"></my-cool>
		// 	<my-cool title="cewfwefw efoco"></my-cool>
		// 	<my-cool title="coco"></my-cool>
		// 	<my-cool></my-cool>
		//
		// `);
	}
}

MyAppComponent.define('my-app', MyAppComponent);
