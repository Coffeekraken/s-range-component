import STemplateWebComponentClass from '../../../dist/class';

class MyCoolComponent extends STemplateWebComponentClass {

	static get defaultProps() {
		return {
			title : 'My cool component'
		};
	}

	static get defaultTemplateData() {
		return {
			title : '@props.title'
		}
	}

	componentWillMount() {
		super.componentWillMount();


	}

	componentMount() {
		super.componentMount();
		// console.warn('my cool original', this.innerHTML);
		setTimeout(() => {
			this.data.title = 'Yeaaaaah!!! ' + Math.random()*999;
		}, 4000);
		setTimeout(() => {
			this.setAttribute('hello', 'world');
		}, 200 + Math.random() * 4000);
	}

	render() {
		super.render(`
			<p>MY COOL COMPONENT</p>
			<h2 style="background:red;">${this.data.title}</h2>
			<slot name="up"></slot>
			<button onclick="console.log($this);">
				console log my cool
			</button>
			<img style="height:20px" src="http://media.istockphoto.com/photos/beautiful-rolling-landscape-on-a-summers-day-in-the-cotswolds-picture-id501234002" />
			<slot name="down"></slot>
		`);
	}
}

MyCoolComponent.define('my-cool', MyCoolComponent);
