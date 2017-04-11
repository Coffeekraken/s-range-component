Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SInputWebComponent2 = require('coffeekraken-sugar/js/core/SInputWebComponent');

var _SInputWebComponent3 = _interopRequireDefault(_SInputWebComponent2);

var _throttle = require('coffeekraken-sugar/js/utils/functions/throttle');

var _throttle2 = _interopRequireDefault(_throttle);

var _nouislider = require('nouislider');

var _nouislider2 = _interopRequireDefault(_nouislider);

var _dispatchEvent = require('coffeekraken-sugar/js/dom/dispatchEvent');

var _dispatchEvent2 = _interopRequireDefault(_dispatchEvent);

var _insertAfter = require('coffeekraken-sugar/js/dom/insertAfter');

var _insertAfter2 = _interopRequireDefault(_insertAfter);

var _autoCast = require('coffeekraken-sugar/js/utils/string/autoCast');

var _autoCast2 = _interopRequireDefault(_autoCast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @name 		SRangeComponent
 * @extends 	SInputWebComponent
 * Nice, easy to use, customizable and fully featured range webcomponent.
 *
 * @styleguide 	Form / Range
 * @example 	html
 * <input type="text" is="s-range" min="0" max="50" value="20" />
 * <input type="text" is="s-range" min="20" max="50" value="20,34" />
 * <input type="text" is="s-range" min="0" max="1000" value="400" step="10" />
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */

var SRangeComponent = function (_SInputWebComponent) {
	_inherits(SRangeComponent, _SInputWebComponent);

	function SRangeComponent() {
		_classCallCheck(this, SRangeComponent);

		return _possibleConstructorReturn(this, (SRangeComponent.__proto__ || Object.getPrototypeOf(SRangeComponent)).apply(this, arguments));
	}

	_createClass(SRangeComponent, [{
		key: 'componentMount',


		/**
   * Mount component
   * @definition 		SWebComponent.componentMount
   * @protected
   */
		value: function componentMount() {
			var _this2 = this;

			_get(SRangeComponent.prototype.__proto__ || Object.getPrototypeOf(SRangeComponent.prototype), 'componentMount', this).call(this);

			// default formatter
			this._formatter = function (value, destination) {
				return value;
			};

			// manage the formatter setting
			if (this.props.formatter) {
				if (typeof this.props.formatter === 'string') {
					if (!SRangeComponent._formatters[this.props.formatter]) {
						throw 'The formatter "' + this.props.formatter + '" does not exist. Make sure to register if through the static method SRangeComponent.registerFormater. Here\'s the available formatters : ' + Object.keys(SRangeComponent._formatters).join(',');
					}
					this._formatter = SRangeComponent._formatters[this.props.formatter].bind(this);
				} else if (typeof this.props.formatter === 'function') {
					this._formatter = this.props.formatter.bind(this);
				}
			}

			// keep input
			if (this.props.keepInput) this.classList.add(this._componentNameDash + '-keep-input');

			// create the container for the slider
			this.container = document.createElement('div');
			this.container.setAttribute(this._componentNameDash + '-container', true);
			// this.container.setAttribute('class', this.className);

			// range element
			this.rangeElm = document.createElement('div');
			this.container.appendChild(this.rangeElm);

			var start = [this.props.value || this.props.min || 0];
			if (this.props.value) {
				start = this.props.value.toString().split(',');
			}

			var connect = this.props.connect;
			if (start.length < 2 && connect !== false) {
				connect = 'lower';
			} else if (connect === null) {
				connect = false;
			}

			var args = {
				start: start,
				connect: connect,
				orientation: 'horizontal',
				direction: this.props.direction,
				range: {
					min: this.props.min || 0,
					max: this.props.max || 100
				},
				pips: this.props.pips,
				cssPrefix: this._componentNameDash + '-'
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
			this.slider = _nouislider2.default.create(this.rangeElm, args);

			// remove the noUi-background class on the main element
			this.rangeElm.classList.remove(this._componentNameDash + '-background');

			// query references
			this.handleStartElm = this.container.querySelector('.' + this._componentNameDash + '-origin:first-of-type .' + this._componentNameDash + '-handle');
			this.handleEndElm = this.container.querySelector('.' + this._componentNameDash + '-origin:last-of-type .' + this._componentNameDash + '-handle');
			if (this.handleStartElm === this.handleEndElm) this.handleEndElm = null;
			this.connectElm = this.container.querySelector('.' + this._componentNameDash + '-connect');
			this.baseElm = this.container.querySelector('.' + this._componentNameDash + '-base');

			// create handleValueElm
			if (this.handleStartElm) {
				this.handleStartValueElm = document.createElement('div');
				this.handleStartValueElm.classList.add(this._componentNameDash + '-handle__value');
				this.handleStartElm.appendChild(this.handleStartValueElm);
			}
			if (this.handleEndElm) {
				this.handleEndValueElm = document.createElement('div');
				this.handleEndValueElm.classList.add(this._componentNameDash + '-handle__value');
				this.handleEndElm.appendChild(this.handleEndValueElm);
			}

			// create new noUi-background${this._componentNameDash}-origin for the lower background
			this.backgroundLowerElm = document.createElement('div');
			this.backgroundLowerElm.classList.add(this._componentNameDash + '-origin');
			this.backgroundLowerElm.classList.add(this._componentNameDash + '-background');
			this.backgroundLowerElm.style.right = '100%';

			// append the element to the base
			this.baseElm.appendChild(this.backgroundLowerElm);

			// init tooltip
			if (this.props.tooltips) this._initTooltip();

			// keep track of busy status
			this.slider.on('start', function (e) {
				_this2._busy = true;
			});
			this.slider.on('end', function (e) {
				_this2._busy = false;
			});

			// listen when slider has his value updated
			// the change event will not be fired during the dragging
			this.slider.on('change', function (e) {
				// update attribute value
				_this2._updateAttributeValue();
			});

			// handle change directly in the input
			this.addEventListener('change', function (e) {
				if (e instanceof CustomEvent) {} else {
					var values = e.target.value.toString().split(',').map(function (value) {
						return parseFloat(value);
					});
					values[0] = values[0] < _this2.props.min ? _this2.props.min : values[0] > _this2.props.max ? _this2.props.max : values[0] || _this2.props.min;
					if (values[1]) {
						values[1] = values[1] < _this2.props.min ? _this2.props.min : values[1] > _this2.props.max ? _this2.props.max : values[1] || _this2.props.max;
					}
					_this2.slider.set(values);
					e.target.value = values.join(',');
					e.target.setAttribute('value', values.join(','));
				}
			});

			// throttled update
			var _throttledUpdateFn = null;
			if (this.props.updateInterval) {
				_throttledUpdateFn = (0, _throttle2.default)(function () {
					_this2._updateAttributeValue();
				}, this.props.updateInterval);
			}

			// listen for update in slider
			this.slider.on('update', function (e) {
				// update values
				_this2._boundValuesInHtml();
				// check if need to update
				if (_throttledUpdateFn) _throttledUpdateFn();
			});

			// do not animate anything at start
			this.container.classList.add('clear-transmations'); // do not animate anything at initialisation

			// append the slider into the dom
			(0, _insertAfter2.default)(this.container, this);

			// remove the no-transmations class to let animations do their job
			setTimeout(function () {
				_this2.container.classList.remove('clear-transmations');
			});

			// set values first time
			this._boundValuesInHtml();
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: 'componentWillReceiveProp',
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			switch (name) {
				case 'value':
					if (!newVal) newVal = this.props.min;
					// set the new values to the slider
					// but this, only if the slider is not
					// busy, mean that the user is using it
					if (!this._busy) {
						this.slider.set(newVal.toString().split(','));
					}
					break;
			}
		}

		/**
   * Update attribute value
   */

	}, {
		key: '_updateAttributeValue',
		value: function _updateAttributeValue() {
			var _this3 = this;

			// set new value in attributes
			var value = this.slider.get();
			var newValue = value;
			if (typeof value === 'number' || typeof value === 'string') {
				newValue = this._formatter(value, 'input');
			} else {
				newValue = this.slider.get().map(function (val) {
					return _this3._formatter(val, 'input');
				}).join(',');
			}
			// trigger a change event
			this.setAttribute('value', newValue);
			this.value = newValue;
			(0, _dispatchEvent2.default)(this, 'change');
		}
	}, {
		key: '_applyBackgroundLeft',
		value: function _applyBackgroundLeft() {
			if (!this.connectElm.style.left) {
				setTimeout(this._applyBackgroundLeft.bind(this), 100);
			} else {
				this.backgroundLowerElm.style.right = 100 - parseInt(this.connectElm.style.left) + '%';
			}
		}

		/**
   * Set tooltip values
   */

	}, {
		key: '_boundValuesInHtml',
		value: function _boundValuesInHtml() {

			var values = [].concat(this.slider.get());

			// if we have 2 values
			// we set the width of the ${this._componentNameDash}-target${this._componentNameDash}-background:before
			// to the left percentage of the lower handle
			if (values.length == 2) {
				this._applyBackgroundLeft();
			}

			// handle values
			if (this.handleStartValueElm && values[0] !== undefined) {
				this.handleStartValueElm.innerHTML = this._formatter(values[0], 'handle', this);
			}
			if (this.handleEndValueElm && values[1] !== undefined) {
				this.handleEndValueElm.innerHTML = this._formatter(values[1], 'handle', this);
			}

			// set tooltips
			if (this.tooltipStartElm && values[0] !== undefined) {
				this.tooltipStartElm.innerHTML = this._formatter(values[0], 'tooltip', this);
			}
			if (this.tooltipEndElm && values[1] !== undefined) {
				this.tooltipEndElm.innerHTML = this._formatter(values[1], 'tooltip', this);
			}
		}

		/**
   * Init tooltip
   */

	}, {
		key: '_initTooltip',
		value: function _initTooltip() {
			// append tooltip in the handles
			if (this.handleStartElm) {
				// generate html structure
				var tooltipStartElm = document.createElement('div');
				tooltipStartElm.classList.add(this._componentNameDash + '-tooltip');
				this.handleStartElm.appendChild(tooltipStartElm);
				this.tooltipStartElm = tooltipStartElm;
			}
			if (this.handleEndElm) {
				// generate html structure
				var tooltipEndElm = document.createElement('div');
				tooltipEndElm.classList.add(this._componentNameDash + '-tooltip');
				this.handleEndElm.appendChild(tooltipEndElm);
				this.tooltipEndElm = tooltipEndElm;
			}
		}
	}], [{
		key: 'defaultCss',


		/**
   * Default css
   * @definition 		SWebComponent.defaultCss
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t\t[is="' + componentNameDash + '"]:not(.' + componentNameDash + '-keep-input) {\n\t\t\t\tposition: absolute;\n\t\t\t\tleft: -100vw;\n\t\t\t\topacity: 0;\n\t\t\t}\n\t\t\t/* Functional styling;\n\t\t\t * These styles are required for noUiSlider to function.\n\t\t\t * You don\'t need to change these rules to apply your design.\n\t\t\t */\n\t\t\t.' + componentNameDash + '-target,\n\t\t\t.' + componentNameDash + '-target * {\n\t\t\t\t-webkit-touch-callout: none;\n\t\t\t\t-webkit-user-select: none;\n\t\t\t\ttouch-action: none;\n\t\t\t\tuser-select: none;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-target {\n\t\t\t\tposition: relative;\n\t\t\t\tdirection: ltr;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-base {\n\t\t\t\twidth: 100%;\n\t\t\t\theight: 100%;\n\t\t\t\tposition: relative;\n\t\t\t\tz-index: 1; /* Fix 401 */\n\t\t\t}\n\t\t\t.' + componentNameDash + '-background:before {\n\t\t\t\tcontent:\'\';\n\t\t\t\tdisplay:block;\n\t\t\t\tposition:absolute;\n\t\t\t\ttop:0; left:0;\n\t\t\t\twidth:100%; height:100%;\n\t\t\t\tborder-radius:0.05em;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-origin {\n\t\t\t\tposition: absolute;\n\t\t\t\tright: 0;\n\t\t\t\ttop: 0;\n\t\t\t\tleft: 0;\n\t\t\t\tbottom: 0;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-handle {\n\t\t\t\tposition: relative;\n\t\t\t\tz-index: 1;\n\t\t\t\ttext-align: center;\n\t\t\t\ttransform-origin:50% 50%;\n\t\t\t\tdisplay:inline-block;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-tooltip {\n\t\t\t\tdisplay: inline-block;\n\t\t\t\tpointer-events:none;\n\t\t\t\tposition: absolute !important;\n\t\t\t\ttop:0; left:50%;\n\t\t\t\ttransform: translateX(-50%) translateY(-100%);\n\t\t\t\topacity: 0;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-active .' + componentNameDash + '-tooltip {\n\t\t\t\topacity:1;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-stacking .' + componentNameDash + '-handle {\n\t\t\t/* This class is applied to the lower origin when\n\t\t\t   its values is > 50%. */\n\t\t\t\tz-index: 10;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-state-drag * {\n\t\t\t\tcursor: inherit !important;\n\t\t\t}\n\n\t\t\t/* Painting and performance;\n\t\t\t * Browsers can paint handles in their own layer.\n\t\t\t */\n\t\t\t.' + componentNameDash + '-base,\n\t\t\t.' + componentNameDash + '-handle {\n\t\t\t\ttransform: translate3d(0,0,0);\n\t\t\t}\n\n\t\t\t/* Handles and cursors;\n\t\t\t */\n\t\t\t.' + componentNameDash + '-draggable {\n\t\t\t\tcursor: w-resize;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-vertical .' + componentNameDash + '-draggable {\n\t\t\t\tcursor: n-resize;\n\t\t\t}\n\n\t\t\t.' + componentNameDash + '-handle__value {\n\t\t\t\tposition:relative;\n\t\t\t\ttop:50%; left:50%;\n\t\t\t\ttransform: translateX(-50%) translateY(-50%);\n\t\t\t}\n\n\t\t\t.' + componentNameDash + '-pips,\n\t\t\t.' + componentNameDash + '-pips * {\n\t\t\t-moz-box-sizing: border-box;\n\t\t\t\tbox-sizing: border-box;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-pips {\n\t\t\t\tposition: relative;\n\t\t\t}\n\n\t\t\t/* Values;\n\t\t\t *\n\t\t\t */\n\t\t\t.' + componentNameDash + '-value {\n\t\t\t\tposition: absolute;\n\t\t\t\ttext-align: center;\n\t\t\t}\n\n\t\t\t/* Markings;\n\t\t\t *\n\t\t\t */\n\t\t\t.' + componentNameDash + '-marker {\n\t\t\t\tposition: absolute;\n\t\t\t}\n\n\t\t\t/* Horizontal layout;\n\t\t\t *\n\t\t\t */\n\t\t\t.' + componentNameDash + '-pips-horizontal {\n\t\t\t\ttop: 100%;\n\t\t\t\tleft: 0;\n\t\t\t\twidth: 100%;\n\t\t\t}\n\t\t\t.' + componentNameDash + '-value-horizontal {\n\t\t\t\t-webkit-transform: translate3d(-50%,50%,0);\n\t\t\t\ttransform: translate3d(-50%,50%,0);\n\t\t\t}\n\t\t';
		}

		/**
   * Physical props
   * @definition 		SWebComponent.physicalProps
   * @protected
   */

	}, {
		key: 'defaultProps',


		/**
   * Default props
   * @definition 		SWebComponent.defaultProps
   * @protected
   */


		/**
   * Store the formatters functions
   * @type 	{Object}
   */
		get: function get() {
			return {

				/**
     * Specify the minimum value of the range.
     * @prop
     * @type 	{Number}
     */
				min: null,

				/**
     * Specify the maximum value of the range.
     * @prop
     * @type 	{Number}
     */
				max: null,

				/**
     * Specify the step value if you want to constrain the user to chosse like 5-10-15, etc...
     * @prop
     * @type 	{Number}
     */
				step: null,

				/**
     * When using two handles, specify the minimum margin between the two.
     * @prop
     * @type 	{Number}
     */
				margin: null,

				/**
     * When using two handles, specify the maximum margin between the two.
     * @prop
     * @type 	{Number}
     */
				limit: null,

				/**
     * Specify the range direction. Support "rtl" and "ltr"
     * @prop
     * @values 	rtl | ltr
     * @type 	{String}
     */
				direction: 'ltr',

				/**
     * Specify if need to keep the input or not
     * @prop
     * @type 	{Boolean}
     */
				keepInput: false,

				/**
     * Specify if need to display a tooltip that follows the handles when sliding them.
     * The value of this can be specified through the formatter. See the formatter doc for more info.
     * @prop
     * @type 	{Boolean}
     */
				tooltips: true,

				/**
     * When using two handles, specify if these two have to be linked visually or not
     * @prop
     * @type 	{Boolean}
     */
				connect: true,

				/**
     * Specify the value of the range. If using two handles, need to be specified like "firstValue,secondValue" (comma separated)
     * @prop
     * @type 	{Number|String}
     */
				value: null,

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
				formatter: null,

				/**
     * Specify the registered sugar color to use for the range
     * @prop
     * @physicalProps
     * @type 	{String}
     */
				color: 'default',

				/**
     * Specify the time interval between actual input value updates
     * @prop
     * @type 	{Number}
     */
				updateInterval: null,

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
				pips: null
			};
		}

		/**
   * Register a new formatter
   * @param 		{String} 		name 		The formatter name
   * @param 		{Function} 		formatter 	The formatter function
   */

	}, {
		key: 'physicalProps',
		get: function get() {
			return ['color'];
		}
	}]);

	return SRangeComponent;
}(_SInputWebComponent3.default);

SRangeComponent._formatters = {

	// round the value
	rounded: function rounded(value, target) {
		return Math.round(value);
	}
};

SRangeComponent.registerFormatter = function (name, fn) {
	if (typeof name !== 'string') throw 'The name parameter has to be a String';
	if (typeof fn !== 'function') throw 'The formatter parameter has be a function';
	SRangeComponent._formatters[name] = fn;
};

exports.default = SRangeComponent;