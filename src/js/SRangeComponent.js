import SInputWebComponent from 'coffeekraken-sugar/js/core/SInputWebComponent'
import __throttle from 'coffeekraken-sugar/js/utils/functions/throttle'
import noUiSlider from 'nouislider';
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'
import __insertAfter from 'coffeekraken-sugar/js/dom/insertAfter'
import __autoCast from 'coffeekraken-sugar/js/utils/string/autoCast'

/**
 * @name 		SRangeComponent
 * @extends 	SInputWebComponent
 * Nice, easy to use, customizable and fully featured range webcomponent.
 *
 * @example 	html
 * <input type="text" is="s-range" min="0" max="50" value="20" />
 * <input type="text" is="s-range" min="20" max="50" value="20,34" />
 * <input type="text" is="s-range" min="0" max="1000" value="400" step="10" />
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */

export default class SRangeComponent extends SInputWebComponent {

	/**
	 * Store the formatters functions
	 * @type 	{Object}
	 */
	static _formatters = {

		// round the value
		rounded : function(value, target) {
			return Math.round(value);
		}
	};

	/**
	 * Register a new formatter
	 * @param 		{String} 		name 		The formatter name
	 * @param 		{Function} 		formatter 	The formatter function
	 */
	static registerFormatter = function(name, fn) {
		if ( typeof(name) !== 'string' ) throw 'The name parameter has to be a String';
		if ( typeof(fn) !== 'function' ) throw 'The formatter parameter has be a function';
		SRangeComponent._formatters[name] = fn;
	}

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 * @protected
	 */
	static get defaultProps() {
		return {

			/**
			 * Specify the minimum value of the range.
			 * @prop
			 * @type 	{Number}
			 */
			min : null,

			/**
			 * Specify the maximum value of the range.
			 * @prop
			 * @type 	{Number}
			 */
			max : null,

			/**
			 * Specify the step value if you want to constrain the user to chosse like 5-10-15, etc...
			 * @prop
			 * @type 	{Number}
			 */
			step : null,

			/**
			 * When using two handles, specify the minimum margin between the two.
			 * @prop
			 * @type 	{Number}
			 */
			margin : null,

			/**
			 * When using two handles, specify the maximum margin between the two.
			 * @prop
			 * @type 	{Number}
			 */
			limit : null,

			/**
			 * Specify the range direction. Support "rtl" and "ltr"
			 * @prop
			 * @values 	rtl | ltr
			 * @type 	{String}
			 */
			direction : 'ltr',

			/**
			 * Specify if need to keep the input displayed or not
			 * @prop
			 * @type 	{Boolean}
			 */
			keepInput : false,

			/**
			 * Specify if need to display a tooltip that follows the handles when sliding them.
			 * The value of this can be specified through the formatter. See the formatter doc for more info.
			 * @prop
			 * @type 	{Boolean}
			 */
			tooltips : true,

			/**
			 * When using two handles, specify if these two have to be linked visually or not
			 * @prop
			 * @type 	{Boolean}
			 */
			connect : true,

			/**
			 * Specify the value of the range. If using two handles, need to be specified like "firstValue,secondValue" (comma separated)
			 * @prop
			 * @type 	{Number|String}
			 */
			value : null,

			/**
			 * Specify a formatter function or a registered formatter name to display the values at a specific target point in the range like "input", "tooltip" and "handle"
			 * This function will receive these parameters:
			 * 1. ```value``` : The value to format
			 * 2. ```target``` : The target where the value will be displayed like "input", "tooltip" or "handle"
			 * This function has to return the formatted value.
			 * > Do not declare this function with the "=>" function syntax otherwise your "this" context will not point to the actual component instance...
			 * @prop
			 * @type 	{Function|String}
			 */
			formatter : null,

			/**
			 * Specify the registered sugar color to use for the range
			 * @prop
			 * @physicalProps
			 * @type 	{String}
			 */
			color : 'default',

			/**
			 * Specify the time interval between actual input value updates
			 * @prop
			 * @type 	{Number}
			 */
			updateInterval : null,

			/**
			 * Specify if and how to display the pips
			 * - ```density``` : 	The density of pips to have. Lower means that you will have more...
			 * - ```mode``` : The mode to use to draw pips. Possible values are :
			 * 	1. **range** : Use the range slider property to draw the pips
			 * 	2. **positions** : Use an array of positions percentage based by setting the ```values``` property
			 * 	3. **count** : Use to specify a number of pips to draw by setting the ```values``` property
			 * 	4. **values** : Set specify values where you want a pip to be drawed by settings the ```values``` property
			 *
			 * @example 	js
			 * // positions
			 * {
			 * 	mode : 'positions',
			 * 	values : [0,25,50,75,100]
			 * }
			 * // count
			 * {
			 * 	mode : 'count',
			 * 	values : 5
			 * }
			 * // etc...
			 *
			 * @prop
			 * @type 	{Object}
			 */
			pips : null
		}
	}

	/**
	 * Default css
	 * @definition 		SWebComponent.defaultCss
	 * @protected
	 */
	static defaultCss(componentName, componentNameDash) {
		return `
			[is="${componentNameDash}"]:not(.${componentNameDash}-keep-input) {
				position: absolute;
				left: -100vw;
				opacity: 0;
			}
			/* Functional styling;
			 * These styles are required for noUiSlider to function.
			 * You don't need to change these rules to apply your design.
			 */
			.${componentNameDash}-target,
			.${componentNameDash}-target * {
				-webkit-touch-callout: none;
				-webkit-user-select: none;
				touch-action: none;
				user-select: none;
				box-sizing: border-box;
			}
			.${componentNameDash}-target {
				position: relative;
				direction: ltr;
			}
			.${componentNameDash}-base {
				width: 100%;
				height: 100%;
				position: relative;
				z-index: 1; /* Fix 401 */
			}
			.${componentNameDash}-background:before {
				content:'';
				display:block;
				position:absolute;
				top:0; left:0;
				width:100%; height:100%;
				border-radius:0.05em;
			}
			.${componentNameDash}-origin {
				position: absolute;
				right: 0;
				top: 0;
				left: 0;
				bottom: 0;
			}
			.${componentNameDash}-handle {
				position: relative;
				z-index: 1;
				text-align: center;
				transform-origin:50% 50%;
				display:inline-block;
			}
			.${componentNameDash}-tooltip {
				display: inline-block;
				pointer-events:none;
				position: absolute !important;
				top:0; left:50%;
				transform: translateX(-50%) translateY(-100%);
				opacity: 0;
			}
			.${componentNameDash}-active .${componentNameDash}-tooltip {
				opacity:1;
			}
			.${componentNameDash}-stacking .${componentNameDash}-handle {
			/* This class is applied to the lower origin when
			   its values is > 50%. */
				z-index: 10;
			}
			.${componentNameDash}-state-drag * {
				cursor: inherit !important;
			}

			/* Painting and performance;
			 * Browsers can paint handles in their own layer.
			 */
			.${componentNameDash}-base,
			.${componentNameDash}-handle {
				transform: translate3d(0,0,0);
			}

			/* Handles and cursors;
			 */
			.${componentNameDash}-draggable {
				cursor: w-resize;
			}
			.${componentNameDash}-vertical .${componentNameDash}-draggable {
				cursor: n-resize;
			}

			.${componentNameDash}-handle__value {
				position:relative;
				top:50%; left:50%;
				transform: translateX(-50%) translateY(-50%);
			}

			.${componentNameDash}-pips,
			.${componentNameDash}-pips * {
			-moz-box-sizing: border-box;
				box-sizing: border-box;
			}
			.${componentNameDash}-pips {
				position: relative;
			}

			/* Values;
			 *
			 */
			.${componentNameDash}-value {
				position: absolute;
				text-align: center;
			}

			/* Markings;
			 *
			 */
			.${componentNameDash}-marker {
				position: absolute;
			}

			/* Horizontal layout;
			 *
			 */
			.${componentNameDash}-pips-horizontal {
				top: 100%;
				left: 0;
				width: 100%;
			}
			.${componentNameDash}-value-horizontal {
				-webkit-transform: translate3d(-50%,50%,0);
				transform: translate3d(-50%,50%,0);
			}
		`;
	}

	/**
	 * Physical props
	 * @definition 		SWebComponent.physicalProps
	 * @protected
	 */
	static get physicalProps() {
		return ['color'];
	}

	/**
	 * Mount component
	 * @definition 		SWebComponent.componentMount
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// default formatter
		this._formatter = (value, destination) => {
			return value;
		};

		// manage the formatter setting
		if (this.props.formatter) {
			if (typeof(this.props.formatter) === 'string') {
				if ( ! SRangeComponent._formatters[this.props.formatter]) {
					throw `The formatter "${this.props.formatter}" does not exist. Make sure to register if through the static method SRangeComponent.registerFormater. Here's the available formatters : ${Object.keys(SRangeComponent._formatters).join(',')}`;
				}
				this._formatter = SRangeComponent._formatters[this.props.formatter].bind(this);
			} else if (typeof(this.props.formatter) === 'function') {
				this._formatter = this.props.formatter.bind(this);
			}
		}

		// keep input
		if (this.props.keepInput) this.classList.add(`${this._componentNameDash}-keep-input`);

		// create the container for the slider
		this.container = document.createElement('div');
		this.container.setAttribute(`${this._componentNameDash}-container`, true);
		// this.container.setAttribute('class', this.className);

		// range element
		this.rangeElm = document.createElement('div');
		this.container.appendChild(this.rangeElm);

		let start = [this.props.value || this.props.min || 0];
		if (this.props.value) {
			start = this.props.value.toString().split(',');
		}

		let connect = this.props.connect;
		if (start.length < 2 && connect !== false) {
			connect = 'lower';
		} else if (connect === null) {
			connect = false;
		}

		let args = {
			start : start,
			connect,
			orientation : 'horizontal',
			direction : this.props.direction,
			range : {
				min : this.props.min || 0,
				max : this.props.max || 100
			},
			pips: this.props.pips,
			cssPrefix : `${this._componentNameDash}-`
		};

		if (this.props.margin) {
			args.margin = this.props.margin;
		}
		if (this.props.limit) {
			args.limit = this.props.limit;
		}
		if (this.props.step) {
			args.step = this.props.step;
		}
		this.slider = noUiSlider.create(this.rangeElm, args);

		// remove the noUi-background class on the main element
		this.rangeElm.classList.remove(`${this._componentNameDash}-background`);

		// query references
		this.handleStartElm = this.container.querySelector(`.${this._componentNameDash}-origin:first-of-type .${this._componentNameDash}-handle`);
		this.handleEndElm = this.container.querySelector(`.${this._componentNameDash}-origin:last-of-type .${this._componentNameDash}-handle`);
		if (this.handleStartElm === this.handleEndElm) this.handleEndElm = null;
		this.connectElm = this.container.querySelector(`.${this._componentNameDash}-connect`);
		this.baseElm = this.container.querySelector(`.${this._componentNameDash}-base`);

		// create handleValueElm
		if (this.handleStartElm) {
			this.handleStartValueElm = document.createElement('div');
			this.handleStartValueElm.classList.add(`${this._componentNameDash}-handle__value`);
			this.handleStartElm.appendChild(this.handleStartValueElm);
		}
		if (this.handleEndElm) {
			this.handleEndValueElm = document.createElement('div');
			this.handleEndValueElm.classList.add(`${this._componentNameDash}-handle__value`);
			this.handleEndElm.appendChild(this.handleEndValueElm);
		}

		// create new noUi-background${this._componentNameDash}-origin for the lower background
		this.backgroundLowerElm = document.createElement('div');
		this.backgroundLowerElm.classList.add(`${this._componentNameDash}-origin`);
		this.backgroundLowerElm.classList.add(`${this._componentNameDash}-background`);
		this.backgroundLowerElm.style.right = '100%';

		// append the element to the base
		this.baseElm.appendChild(this.backgroundLowerElm);

		// init tooltip
		if (this.props.tooltips) this._initTooltip();

		// keep track of busy status
		this.slider.on('start', (e) => {
			this._busy = true;
		});
		this.slider.on('end', (e) => {
			this._busy = false;
		});

		// listen when slider has his value updated
		// the change event will not be fired during the dragging
		this.slider.on('change', (e) => {
			// update attribute value
			this._updateAttributeValue();
		});

		// handle change directly in the input
		this.addEventListener('change', (e) => {
			if (e instanceof CustomEvent) {}
			else {
				const values = e.target.value.toString().split(',').map((value) => parseFloat(value));
				values[0] = values[0] < this.props.min ? this.props.min :
							values[0] > this.props.max ? this.props.max : values[0] || this.props.min;
				if (values[1]) {
					values[1] = values[1] < this.props.min ? this.props.min :
								values[1] > this.props.max ? this.props.max : values[1] || this.props.max;
				}
 				this.slider.set(values);
				e.target.value = values.join(',');
				e.target.setAttribute('value',values.join(','));
			}
		});

		// throttled update
		let _throttledUpdateFn = null;
		if (this.props.updateInterval) {
			_throttledUpdateFn = __throttle(() => {
				this._updateAttributeValue();
			}, this.props.updateInterval);
		}

		// listen for update in slider
		this.slider.on('update', (e) => {
			// update values
			this._boundValuesInHtml();
			// check if need to update
			if (_throttledUpdateFn) _throttledUpdateFn();
		});

		// do not animate anything at start
		this.container.classList.add('clear-transmations'); // do not animate anything at initialisation

		// append the slider into the dom
		__insertAfter(this.container, this);

		// remove the no-transmations class to let animations do their job
		setTimeout(() => {
			this.container.classList.remove('clear-transmations');
		});

		// set values first time
		this._boundValuesInHtml();
	}

	/**
	 * Component will receive prop
	 * @definition 		SWebComponent.componentWillReceiveProp
	 * @protected
	 */
	componentWillReceiveProp(name, newVal, oldVal) {
		switch(name) {
			case 'value':
				if ( ! newVal) newVal = this.props.min;
				// set the new values to the slider
				// but this, only if the slider is not
				// busy, mean that the user is using it
				if ( ! this._busy) {
					this.slider.set(newVal.toString().split(','));
				}
			break;
		}
	}

	/**
	 * Update attribute value
	 */
	_updateAttributeValue() {
		// set new value in attributes
		const value = this.slider.get();
		let newValue = value;
		if (typeof(value) === 'number' || typeof(value) === 'string') {
			newValue = this._formatter(value, 'input');
		} else {
			newValue = this.slider.get().map((val) => {
				return this._formatter(val, 'input');
			}).join(',');
		}
		// trigger a change event
		this.setAttribute('value', newValue);
		this.value = newValue;
		__dispatchEvent(this, 'change');
	}

	_applyBackgroundLeft() {
		if ( ! this.connectElm.style.left) {
			setTimeout(this._applyBackgroundLeft.bind(this), 100);
		} else {
			this.backgroundLowerElm.style.right = 100 - parseInt(this.connectElm.style.left) + '%';
		}
	}

	/**
	 * Set tooltip values
	 */
	_boundValuesInHtml() {

		const values = [].concat(this.slider.get());

		// if we have 2 values
		// we set the width of the ${this._componentNameDash}-target${this._componentNameDash}-background:before
		// to the left percentage of the lower handle
		if (values.length == 2) {
			this._applyBackgroundLeft();
		}

		// handle values
		if (this.handleStartValueElm && values[0] !== undefined) {
			this.handleStartValueElm.innerHTML = this._formatter(
				values[0],
				'handle',
				this
			);
		}
		if (this.handleEndValueElm && values[1] !== undefined) {
			this.handleEndValueElm.innerHTML = this._formatter(
				values[1],
				'handle',
				this
			);
		}

		// set tooltips
		if (this.tooltipStartElm && values[0] !== undefined) {
			this.tooltipStartElm.innerHTML = this._formatter(
				values[0],
				'tooltip',
				this
			);
		}
		if (this.tooltipEndElm && values[1] !== undefined) {
			this.tooltipEndElm.innerHTML = this._formatter(
				values[1],
				'tooltip',
				this
			);
		}
	}

	/**
	 * Init tooltip
	 */
	_initTooltip() {
		// append tooltip in the handles
		if (this.handleStartElm) {
			// generate html structure
			const tooltipStartElm = document.createElement('div');
			tooltipStartElm.classList.add(`${this._componentNameDash}-tooltip`);
			this.handleStartElm.appendChild(tooltipStartElm);
			this.tooltipStartElm = tooltipStartElm;
		}
		if (this.handleEndElm) {
			// generate html structure
			const tooltipEndElm = document.createElement('div');
			tooltipEndElm.classList.add(`${this._componentNameDash}-tooltip`);
			this.handleEndElm.appendChild(tooltipEndElm);
			this.tooltipEndElm = tooltipEndElm;
		}
	}
}
