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
				<h1 class="h3 m-b-small">
					Coffeekraken s-range-component
				</h1>
				<p class="p m-b-bigger">
					Nice, easy to use, customizable and fully featured range webcomponent.
				</p>
				<div class="card">

					<div class="form-group m-b">
						<s-range for="my-input-1" min="0" max="200"></s-range>
						<input type="text" value="120" id="my-input-1" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-2" min="0" max="200" step="10" color="primary"></s-range>
						<input type="text" value="150" id="my-input-2" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-3" min="0" max="200" format='{decimals:2}' color="secondary"></s-range>
						<input type="text" value="50.00" id="my-input-3" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-20" min="0" max="200" color="success"></s-range>
						<input type="text" value="50:80" id="my-input-20" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-5" min="0" max="200" limit="100" color="error"></s-range>
						<input type="text" value="80:180	" id="my-input-5" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-6" min="0" max="200" margin="100" color="warning"></s-range>
						<input type="text" value="30:150" id="my-input-6" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-7" min="0" max="200" color="info" connect="false"></s-range>
						<input type="text" value="50:100" id="my-input-7" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range for="my-input-8" min="0" max="200" tooltips="false"></s-range>
						<input type="text" value="100:150" name="my-input-8" class="form-input m-l" style="max-width:120px" />
					</div>

					<div class="form-group m-b">
						<s-range min="0" max="200" tooltips="false" value="160" color="primary"></s-range>
					</div>

				</div>
			`
		},
		css : {
			language : 'sass',
			data : `
				@import 'node_modules/coffeekraken-sugar/index';
				@import 'node_modules/coffeekraken-s-typography-component/index';
				@import 'node_modules/coffeekraken-s-form-component/index';
				@import 'index';
				@include s-init();
				@include s-classes();
				@include s-form-classes();
				@include s-typography-classes();
				body {
					padding: s-space(big);
				}
				.card {
					background: white;
					@include s-depth(5);
					padding: s-space(big);
				}
				@include s-range-classes(
					$colors : default primary secondary success error warning info
				);
				s-range {
					font-size:16px;
				}
			`
		},
		js : {
			language : 'js',
			data : `
				import SRangeComponent from './dist/index'
			`
		}
	}
}
