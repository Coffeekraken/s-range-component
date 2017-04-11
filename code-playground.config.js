module.exports = {
	// server port
	port : 3000,

	// title
	title : 's-range-component',

	// layout
	layout : 'right',

	// compile server
	compileServer : {

		// compile server port
		port : 4000

	},

	// editors
	editors : {
		html : {
			language : 'html',
			data : `
				<div class="container">
					<h1 class="h1 m-b-small">
						Coffeekraken s-range-component
					</h1>
					<p class="p m-b-bigger">
						Nice, easy to use, customizable and fully featured range webcomponent.
					</p>
					<div class="card">
						<div class="form-group m-b" style="flex-direction:row-reverse">
							<input style="max-width:80px" keep-input class="form-input" type="text" is="s-range" min="0" max="200" value="20" formatter="rounded" />
						</div>
						<input type="text" is="s-range" min="0" max="200" value="80" step="10" formatter="rounded" />
						<input type="text" is="s-range" min="0" max="200" value="120" formatter="percentage" color="success" />
						<input type="text" is="s-range" min="0" max="200" value="30" formatter="rounded" color="error" pips="{mode:'count',values:6}" />
						<input type="text" is="s-range" min="0" max="200" value="170" formatter="rounded" color="warning" />
						<input type="text" is="s-range" min="0" max="200" value="90" formatter="rounded" color="info" pips="{mode:'values',values:[0,25,50,75,100,125,150,175,200]}" />
						<input type="text" is="s-range" min="0" max="200" value="20,120" color="primary" formatter="rounded" />
						<input type="text" is="s-range" min="0" max="200" value="50,150" color="secondary" formatter="rounded" />
						<input type="text" is="s-range" min="0" max="200" limit="100" value="50,80" color="success" formatter="rounded" />
						<input type="text" is="s-range" min="0" max="200" margin="100" value="80,180" color="warning" formatter="rounded" />
					</div>
				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@include s-init();
				@include s-classes();
				@include s-form-classes();
				@include s-typography-classes();
				body {
					background-image: linear-gradient(120deg, #fdfbfb 0%, #ebedee 100%);
				}
				.container {
					@include s-position(absolute, middle, center);
					min-width:80vw;
				}
				// @include s-setup((
				// 	look-and-feel : (
				// 		border-radius: .5em
				// 	)
				// ));
				.card {
					background: white;
					@include s-depth(5);
					padding: s-space(big);
				}
				@import 'index';
				@include s-range-classes(
					$colors : default primary secondary success error warning info
				);
				[s-range-container] {
					margin-bottom:s-space(default);
				}
				.form-group [s-range-container] {
					margin-bottom:0;
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import 'webcomponents.js/webcomponents-lite'
				import SRangeComponent from './dist/index'
				SRangeComponent.registerFormatter('percentage', function(value, target) {
					if (target === 'input') return Math.round(value);
					if (target === 'tooltip') {
						return Math.round(100 / this.props.max * value) + '%';
					}
					return Math.round(100 / this.props.max * value);
				});
			`
		}
	}
}
