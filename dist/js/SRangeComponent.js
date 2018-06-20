'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _SWebComponent2 = require('coffeekraken-sugar/js/core/SWebComponent');

var _SWebComponent3 = _interopRequireDefault(_SWebComponent2);

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

var _wnumb = require('wnumb');

var _wnumb2 = _interopRequireDefault(_wnumb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @name 		SRangeComponent
 * @extends 	SWebComponent
 * Nice, easy to use, customizable and fully featured range webcomponent.
 *
 * @example 	html
 * <input type="text" value="20" name="my-cool-input" />
 * <s-range for="my-cool-input" min="0" max="50"></s-range>
 *
 * @author 		Olivier Bossel <olivier.bossel@gmail.com>
 */
var SRangeComponent = function (_SWebComponent) {
	_inherits(SRangeComponent, _SWebComponent);

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

			// get the attached input
			if (this.props.for instanceof HTMLElement) {
				this._inputElm = this.props.for;
			} else if (typeof this.props.for === 'string') {
				this._inputElm = document.querySelector('#' + this.props.for + ', [name="' + this.props.for + '"]');
			}

			var inputValue = null;
			if (this._inputElm && this._inputElm.hasAttribute('value')) {
				inputValue = this._inputElm.getAttribute('value');
			}

			var start = [this.props.value || inputValue || this.props.min || 0];
			start = start.toString().split(':');

			var connect = this.props.connect;
			if (start.length < 2 && connect !== false) {
				connect = [true, false];
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
				cssPrefix: this._componentNameDash + '-',
				format: (0, _wnumb2.default)(_extends({
					decimals: 0
				}, this.props.format)),
				tooltips: this.props.tooltips
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
			this.slider = _nouislider2.default.create(this, args);

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
			if (this._inputElm) {
				this._inputElm.addEventListener('change', function (e) {
					var values = e.target.value.toString().split(':').map(function (value) {
						return parseFloat(value);
					});
					values[0] = values[0] < _this2.props.min ? _this2.props.min : values[0] > _this2.props.max ? _this2.props.max : values[0] || _this2.props.min;
					if (values[1]) {
						values[1] = values[1] < _this2.props.min ? _this2.props.min : values[1] > _this2.props.max ? _this2.props.max : values[1] || _this2.props.max;
					}
					_this2.slider.set(values);
					e.target.value = values.join(':');
					e.target.setAttribute('value', values.join(':'));
				});
			}
		}

		/**
   * Component will receive prop
   * @definition 		SWebComponent.componentWillReceiveProp
   * @protected
   */

	}, {
		key: 'componentWillReceiveProp',
		value: function componentWillReceiveProp(name, newVal, oldVal) {
			switch (name) {}
		}

		/**
   * Update attribute value
   */

	}, {
		key: '_updateAttributeValue',
		value: function _updateAttributeValue() {
			// do this only if we have a target input
			if (!this._inputElm) return;

			// set new value in attributes
			var value = this.slider.get();
			var newValue = value;
			if (typeof value === 'number' || typeof value === 'string') {
				newValue = value;
			} else {
				newValue = this.slider.get().join(':');
			}
			// trigger a change event
			this._inputElm.setAttribute('value', newValue);
			this._inputElm.value = newValue;
			(0, _dispatchEvent2.default)(this._inputElm, 'change');
		}
	}], [{
		key: 'defaultCss',


		/**
   * Default css
   * @definition 		SWebComponent.defaultCss
   * @protected
   */
		value: function defaultCss(componentName, componentNameDash) {
			return '\n\t\t/*! nouislider - 11.1.0 - 2018-04-02 11:18:13 */.s-range-target,.s-range-target *{-webkit-touch-callout:none;-webkit-tap-highlight-color:transparent;-webkit-user-select:none;-ms-touch-action:none;touch-action:none;-ms-user-select:none;-moz-user-select:none;user-select:none;-moz-box-sizing:border-box;box-sizing:border-box}.s-range-target{position:relative;direction:ltr}.s-range-base,.s-range-connects{width:100%;height:100%;position:relative;z-index:1}.s-range-connects{overflow:hidden;z-index:0}.s-range-connect,.s-range-origin{will-change:transform;position:absolute;z-index:1;top:0;left:0;height:100%;width:100%;-ms-transform-origin:0 0;-webkit-transform-origin:0 0;transform-origin:0 0}html:not([dir=rtl]) .s-range-horizontal .s-range-origin{left:auto;right:0}.s-range-vertical .s-range-origin{width:0}.s-range-horizontal .s-range-origin{height:0}.s-range-handle{position:absolute}.s-range-state-tap .s-range-connect,.s-range-state-tap .s-range-origin{-webkit-transition:transform .3s;transition:transform .3s}.s-range-state-drag *{cursor:inherit!important}.s-range-horizontal{height:18px}.s-range-horizontal .s-range-handle{width:34px;height:28px;left:-17px;top:-6px}.s-range-vertical{width:18px}.s-range-vertical .s-range-handle{width:28px;height:34px;left:-6px;top:-17px}html:not([dir=rtl]) .s-range-horizontal .s-range-handle{right:-17px;left:auto}.s-range-target{background:#FAFAFA;border-radius:4px;border:1px solid #D3D3D3;box-shadow:inset 0 1px 1px #F0F0F0,0 3px 6px -5px #BBB}.s-range-connects{border-radius:3px}.s-range-connect{background:#3FB8AF}.s-range-draggable{cursor:ew-resize}.s-range-vertical .s-range-draggable{cursor:ns-resize}.s-range-handle{border:1px solid #D9D9D9;border-radius:3px;background:#FFF;cursor:default;box-shadow:inset 0 0 1px #FFF,inset 0 1px 7px #EBEBEB,0 3px 6px -3px #BBB}.s-range-active{box-shadow:inset 0 0 1px #FFF,inset 0 1px 7px #DDD,0 3px 6px -3px #BBB}.s-range-handle:after,.s-range-handle:before{content:"";display:block;position:absolute;height:14px;width:1px;background:#E8E7E6;left:14px;top:6px}.s-range-handle:after{left:17px}.s-range-vertical .s-range-handle:after,.s-range-vertical .s-range-handle:before{width:14px;height:1px;left:6px;top:14px}.s-range-vertical .s-range-handle:after{top:17px}[disabled] .s-range-connect{background:#B8B8B8}[disabled] .s-range-handle,[disabled].s-range-handle,[disabled].s-range-target{cursor:not-allowed}.s-range-pips,.s-range-pips *{-moz-box-sizing:border-box;box-sizing:border-box}.s-range-pips{position:absolute;color:#999}.s-range-value{position:absolute;white-space:nowrap;text-align:center}.s-range-value-sub{color:#ccc;font-size:10px}.s-range-marker{position:absolute;background:#CCC}.s-range-marker-large,.s-range-marker-sub{background:#AAA}.s-range-pips-horizontal{padding:10px 0;height:80px;top:100%;left:0;width:100%}.s-range-value-horizontal{-webkit-transform:translate(-50%,50%);transform:translate(-50%,50%)}.s-range-rtl .s-range-value-horizontal{-webkit-transform:translate(50%,50%);transform:translate(50%,50%)}.s-range-marker-horizontal.s-range-marker{margin-left:-1px;width:2px;height:5px}.s-range-marker-horizontal.s-range-marker-sub{height:10px}.s-range-marker-horizontal.s-range-marker-large{height:15px}.s-range-pips-vertical{padding:0 10px;height:100%;top:0;left:100%}.s-range-value-vertical{-webkit-transform:translate(0,-50%);transform:translate(0,-50%,0);padding-left:25px}.s-range-rtl .s-range-value-vertical{-webkit-transform:translate(0,50%);transform:translate(0,50%)}.s-range-marker-vertical.s-range-marker{width:5px;height:2px;margin-top:-1px}.s-range-marker-vertical.s-range-marker-sub{width:10px}.s-range-marker-vertical.s-range-marker-large{width:15px}.s-range-tooltip{display:block;position:absolute;border:1px solid #D9D9D9;border-radius:3px;background:#fff;color:#000;padding:5px;text-align:center;white-space:nowrap}.s-range-horizontal .s-range-tooltip{-webkit-transform:translate(-50%,0);transform:translate(-50%,0);left:50%;bottom:120%}.s-range-vertical .s-range-tooltip{-webkit-transform:translate(0,-50%);transform:translate(0,-50%);top:50%;right:120%}\n\t\t';
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
		get: function get() {
			return {

				/**
     * Specify an input to bind the range value to. This works the same way as the "for" attribute of a label.
     * @prop
     * @type 		{String}
     */
				for: null,

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
     * When using two handles, specify if these two have to be linked visually or not
     * @prop
     * @type 	{Boolean}
     */
				connect: true,

				/**
     * Display or not the tooltips
     * @prop
     * @type 	{Boolean}
     */
				tooltips: true,

				/**
     * Specify the value of the range. If using two handles, need to be specified like "firstValue:secondValue" (double points separated)
     * @prop
     * @type 	{Number|String}
     */
				value: null,

				/**
     * Specify the time interval between actual input value updates
     * @prop
     * @type 	{Number}
     */
				updateInterval: null,

				/**
     * Specify how to format the output number(s). You need to pass a [wNumb configuration object](https://refreshless.com/wnumb/)
     * @prop
     * @type  	{Object}
     */
				format: {}
			};
		}
	}, {
		key: 'physicalProps',
		get: function get() {
			return [];
		}
	}]);

	return SRangeComponent;
}(_SWebComponent3.default);

exports.default = SRangeComponent;