import STemplateWebComponentClass from '../../../dist/class';

class MyInlineComponent extends STemplateWebComponentClass {

	static get defaultProps() {
		return {
			body : 'My inline component',
			updateTimeout : 1000
		}
	}

	static get defaultTemplateData() {
		return {
			body : '@props.body',
			updateTimeout : '@props.updateTimeout'
		}
	}

	componentMount() {
		super.componentMount();

		setTimeout(() => {
			this.setAttribute('coco', 'hello');
		}, 500);

		setTimeout(() => {
			this.data.body = 'Donec posuere ligula vel dapibus molestie. Ut nulla est, dapibus sed tristique eget, cursus ut odio. Sed eu odio ut nulla placerat gravida sed eu nunc. Nulla in ante sed.';
		}, this.props.updateTimeout);
		setTimeout(() => {
			this.data.body = 'weijfweofj owejf oiwjefoiwje ofijw';
		}, 2500);
	}

	render() {
		console.log(this.templateString)
		super.render(this.templateString.replace('{{body}}',this.data.body).replace('%body',this.data.body));
	}
}

MyInlineComponent.define('my-inline', MyInlineComponent);
