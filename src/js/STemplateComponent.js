import SWebComponent from 'coffeekraken-sugar/js/core/SWebComponent'
import STemplate from 'coffeekraken-sugar/js/core/STemplate'
import SBinder from 'coffeekraken-sugar/js/classes/SBinder'
import __template from 'coffeekraken-sugar/js/dom/template'
import __uniqid from 'coffeekraken-sugar/js/utils/uniqid'
import _isEqual from 'lodash/isEqual'
import _get from 'lodash/get'
import __upperFirst from 'coffeekraken-sugar/js/utils/string/upperFirst'
import __camelize from 'coffeekraken-sugar/js/utils/string/camelize'
import __closest from 'coffeekraken-sugar/js/dom/closest'
import __whenAttribute from 'coffeekraken-sugar/js/dom/whenAttribute'
import __propertyProxy from 'coffeekraken-sugar/js/utils/objects/propertyProxy'
import __dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'

if ( ! window.sugar._sTemplateComponents) window.sugar._sTemplateComponents = {};

export default class STemplateComponent extends SWebComponent {

	static define(name, component, ext = null) {
		const componentName = __upperFirst(__camelize(name));
		if ( ! window.sugar._templateWebComponents[name]) {
			window.sugar._templateWebComponents[name] = component;
		}
		return SWebComponent.define(name, component, ext);
	}

	/**
	 * Default props
	 * @definition 		SWebComponent.defaultProps
	 * @protected
	 */
	static get defaultProps() {
		return {
			/**
			 * The template to use. If not specified, will be the element itself used as template
			 * @prop
			 * @type 	{String}
			 */
			template : null,

			slots : {}
		};
	}

	/**
	 * Physical props
	 * @definition 		SWebComponent.physicalProps
	 * @protected
	 */
	static get physicalProps() {
		return [];
	}

	/**
	 * Return an object that represent the default data used by the template
	 * to render itself
	 * @protected
	 * @type 		{Object}
	 */
	static get defaultTemplateData() {
		return {};
	}

	/**
	 * Get the default template data for this particular instance
	 * @type 		{Object}
	 */
	get defaultTemplateData() {
		let data = window.sugar._webComponentsStack[this._componentName].defaultTemplateData;
		let comp = window.sugar._webComponentsStack[this._componentName];
		while(comp) {
			if (comp.defaultTemplateData) {
				data = {
					...comp.defaultTemplateData,
					...data
				};
			}
			comp = Object.getPrototypeOf(comp);
		}
		return data;
	}

	/**
	 * Get the template
	 * @type 	{String}
	 */
	// get template() {
	// 	// cache
	// 	if ( this._templateCached) return this._templateCached;
	// 	// get the template
	// 	let tpl = __template(this.props.template || this, 'string');
	// 	// save into cache
	// 	this._templateCached = tpl;
	// 	// return the template
	// 	return tpl;
	// }

	// static get mountDependencies() {
	// 	return [function() {
	// 		return new Promise((resolve) => {
	// 			const nestedComponents = this.querySelectorAll(Object.keys(window.sugar._templateWebComponents).join(','));
	// 			console.log(nestedComponents);
	//
	// 			if (nestedComponents) {
	// 				let nestedComponentsReady = nestedComponents.length;
	// 				this.addEventListener('templateComponent:ready', (e) => {
	// 					nestedComponentsReady--;
	// 					if (nestedComponentsReady <= 0) {
	// 						resolve();
	// 					}
	// 				});
	// 			} else {
	// 				// resolve();
	// 			}
	//
	// 			// const closestTemplateComponent = __closest(this, Object.keys(window.sugar._templateWebComponents).join(','));
	// 			// console.log('closest', closestTemplateComponent);
	// 			// if ( ! closestTemplateComponent) {
	// 			// 	resolve();
	// 			// } else {
	// 			// 	resolve(__whenAttribute(closestTemplateComponent, 's-tpl-dirty'));
	// 			// }
	// 		});
	// 	}];
	// }

	/**
	 * Css
	 * @protected
	 */
	static css(componentName, componentNameDash) {
		return `
			${componentNameDash} {
				display : block;
			}
		`;
	}

	/**
	 * Component will mount
 	 * @definition 		SWebComponent.componentWillMount
	 * @protected
	 */
	componentWillMount() {
		super.componentWillMount();

		// create the templateData stack from the default template data
		this.data = Object.assign({}, this.defaultTemplateData);

		// create a refs
		this.refs = {};

		// new binder
		this._binder = new SBinder();

		this._nestedComponentsSlots = {};

		// considere the original content has default slot
		this.props.slots['default'] = this.innerHTML.trim();

		// get the slots content
		const slots = this.querySelectorAll('[slot]');
		if (slots.length) {
			[].forEach.call(slots, (slot) => {
				if (__closest(slot, Object.keys(window.sugar._templateWebComponents).join(',')) !== this) return;
				const slotName = slot.getAttribute('slot') || 'default';
				// save the slot
				this.props.slots[slotName] = slot.outerHTML.trim();
				slot.parentNode.removeChild(slot);
			});
		}

		// grab the templateString to work with.
		// it can be overrided by passing a string to the render method
		this.templateString = __template(this.props.template || this, 'string');

		// process the data to allow some features
		// like the mapping of instance property with @,
		// etc...
		for(let key in this.data) {
			// map the data to an instance variable
			if (typeof(this.data[key]) === 'string') {
				// handle the @... notation in datas
				if (this.data[key].substr(0,1) === '@') {
					const watchKey = this.data[key].substr(1);
					// set the initial value
					this.data[key] = _get(this, watchKey);
					// bind the value to the data value
					this._binder.bindObjectPath2ObjectPath(this, watchKey, this, `data.${key}`);
				}
			}

			// bind the component instance to the setting if it is
			// a function
			if (typeof(this.data[key]) === 'function') {
				this.data[key] = this.data[key].bind(this);
			}
		}
	}

	/**
	 * Mount component
	 * @definition 		SWebComponent.componentMount
	 * @protected
	 */
	componentMount() {
		super.componentMount();

		// create a component id
		this._templateComponentId = this.getAttribute('s-tplc') || __uniqid();

		// save it into stack
		if ( ! window.sugar._sTemplateComponents[this._templateComponentId]) {
			window.sugar._sTemplateComponents[this._templateComponentId] = this;
		}

		// instanciate a new empty STemplate
		this._sTemplate = new STemplate('', this.data, {
			id : this._templateComponentId,
			autoRenderOnDataUpdate : false, // we would handle this ourself
			beforeRenderFirst : this.templateWillRenderFirst.bind(this),
			afterRenderFirst : (inDomTemplate) => {
				this._updateRefs();
				this.templateDidRenderFirst(inDomTemplate);
			},
			// onBeforeElUpdated : (fromNode, toNode) => {
			// 	if (fromNode.hasAttribute('slot-container')) {
			// 		this._handleSlotNode(fromNode);
			// 	}
			// },
			onBeforeNodeAdded : (node) => {
				if (node.hasAttribute('slot-container')) {
					this._handleSlotNode(node);
				}
				[].forEach.call(node.querySelectorAll('[slot-container]'), (slotNode) => {
					this._handleSlotNode(slotNode);
				});
			},
			afterRender : this.templateDidRender.bind(this),
			onDataUpdate : this.templateWillReceiveData.bind(this),
			shouldTemplateUpdate : this.shouldTemplateUpdate.bind(this)
		});

		// set the dom node
		this._sTemplate.setDomNode(this);
	}

	_handleSlotNode(slotNode) {
		// check if already been resolved
		if (slotNode.hasAttribute('slot-resolved')) return;
		// get slot name
		const slotName = slotNode.getAttribute('slot-container');
		const slotContent = this._nestedComponentsSlots[slotName];
		// if no slot content, do nothing
		if ( ! slotContent) return;
		// mark the slode as resolved
		slotNode.setAttribute('slot-resolved', true);
		if (typeof(slotContent) === 'string') {
			// inject the content
			slotNode.innerHTML = slotContent;
		} else if (slotContent.nodeName) {
			slotNode.appendChild(slotContent);
		}
	}

	/**
	 * Component unmount
	 * @definition 		SWebComponent.componentUnmount
	 * @protected
	 */
	componentUnmount() {
		super.componentUnmount();
		// destroy the template
		if (this._sTemplate && this._sTemplate.destroy) {
			this._sTemplate.destroy();
		}
	}

	/**
	 * Component will receive prop
	 * @definition 		SWebComponent.componentWillReceiveProp
	 * @protected
	 */
	componentWillReceiveProp(name, newVal, oldVal) {
		switch(name) {
		}
	}

	// shouldComponentUpdate(newProps, oldProps) {
	// 	console.log(newProps, oldProps);
	// 	return false;
	// }

	_hash(str) {
		var hash = 0;
	    if (str.length == 0) return hash;
	    for (i = 0; i < str.length; i++) {
	        char = str.charCodeAt(i);
	        hash = ((hash<<5)-hash)+char;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}

	_prepareTemplateString(templateString) {

		// wrap the templateString inside the actual tag if needed
		templateString = this._wrapTemplateStringInsideActualTagIfNeeded(templateString);

		// escape < and > inside attributes
		templateString = templateString.replace(/[[\S]+=[\"\']([^"^']*)[\"\']/g, (attribute) => {
			return attribute.replace('<','&lt;').replace('>','&gt;');
		});

		// remove all the the nested templates
		let df = new window.DOMParser().parseFromString(templateString, 'text/html');

		// replace default slot
		const slots = df.body.querySelectorAll('slot');
		if (slots.length) {

			// if there's some slots in the template and that
			// it's the first time that we render the template,
			// we empty the component that will be replaced by the
			// sloted template and each slots will be filled by theirs corresponding content
			if ( ! this._firstTemplateRenderDone) {
				this.innerHTML = '';
			}

			// loop on each founded slots to fill them with their corresponding
			// content
			[].forEach.call(slots, (slot) => {
				const slotName = slot.getAttribute('name') || 'default';
				let slotContent = this.props.slots[slotName];
				if ( ! slotContent) return;
				if (typeof(slotContent) === 'string') {
					slot.innerHTML = slotContent;
				} else if (slotContent.nodeName) {
					slot.appendChild(slotContent);
				} else {
					return;
				}
				// slot.setAttribute('coco', true);
				slot.setAttribute('slot-resolved', true);
			});
		}

		if (Object.keys(window.sugar._templateWebComponents).length) {
			[].forEach.call(df.querySelectorAll(Object.keys(window.sugar._templateWebComponents).join(',')), (elm) => {
				// console.log(df, df.body.firstChild);
				if (elm !== df.body.firstChild) {

					if ( ! elm.hasAttribute('slot-container')) {
						const slotId = this._hash(elm.innerHTML);
						if (slotId) {
							elm.setAttribute('slot-container', slotId);
							this._nestedComponentsSlots[slotId] = elm.innerHTML;
						}
						elm.innerHTML = '';
					}

					// if needed, we mark the element as a template one.
					// the "true" value will be updated by the sTemplate class
					// with the actual templateId later...
					if ( ! elm.hasAttribute('s-tpl')) {
						elm.setAttribute('s-tpl', true);
					}
				}
			});
		}

		// apply the template id
		df.body.firstChild.setAttribute('s-tpl', this._templateComponentId);

		// apply a s-tpl-node attribute on each items of the template
		// to be able later to identify nodes that belong to the template
		// and others that have maybe been added by another way...
		[].forEach.call(df.body.firstChild.querySelectorAll('*'), (elm) => {
			elm.setAttribute('s-tpl-node', this._templateComponentId);
		});

		// get the string back
		templateString = df.body.innerHTML;

		// replace some tokens in the templateString now that we have
		// only the part that actually belong to this component.
		// we will replace the $this, etc... tokens
		templateString = this._replaceTokensInTemplateString(templateString);

		// return the template String
		return templateString.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
	}

	_wrapTemplateStringInsideActualTagIfNeeded(templateString) {
		// wrap the templateString inside the root node if
		// the root node is not already him
		const tag = this.outerHTML.split(/\s|>/)[0];
		const templateTag = templateString.split(/\s|>/)[0];
		if (tag !== templateTag) {
			// we need to wrap the templateString with the base
			const outer = this.outerHTML;
			const matches = outer.match(/<([a-zA-Z-]+)[^>]*>/);
			if (matches[0] && matches[1]) {
				templateString = `${matches[0]}${templateString}</${matches[1]}>`;
			}
		}
		return templateString;
	}

	_replaceTokensInTemplateString(templateString) {

		// replace all the this. with the proper window.sTemplateDataObjects reference
		// console.log('process', templateString);
		const thisDotReg = new RegExp('\\$this','g');
		templateString = templateString.replace(thisDotReg, `window.sugar._sTemplateComponents.${this._templateComponentId}`);

		return templateString;
	}

	_updateRefs() {
		// search for name and id's
		[].forEach.call(this.querySelectorAll(`[id],[name]`), (elm) => {
			// get the id or name
			const id = elm.id || elm.getAttribute('name');
			// save the reference
			this.refs[id] = elm;
		});
	}

	/**
	 * Run each time a data is updated in the template
	 * @param 		{Mixed} 		newVal 			The new value
	 * @param 		{Mixed} 		oldVal 			The old value
	 */
	templateWillReceiveData(newData, previousData) {
		this.render();
	}

	/**
	 * Run before the template will first be rendered in the viewport
	 * @param 		{String} 				template 				The template to render to the screen
	 * @return 		{String} 										The processed template to render
	 */
	templateWillRenderFirst(template) {
		return template;
	}

	/**
	 * Run before the template will be rendered in the viewport
	 * @param 		{String} 				template 				The template to render to the screen
	 * @return 		{String} 										The processed template to render
	 */
	templateWillRender(template) {
		return template;
	}

	/**
	 * Run after the template has been rendered in the viewport
	 * @param 		{HTMLElement} 			inDomTemplate 			The in dom representation of the template
	 */
	templateDidRender(inDomTemplate) {
		// do something here if needed
	}

	/**
	 * Run after the first render
	 * @param 		{HTMLElement} 			inDomTemplate 			The in dom representation of the template
	 */
	templateDidRenderFirst(inDomTemplate) {
		// do something here if needed
	}

	/**
	 * Run before compile the template to test if we need to render it again or not
	 * @param 		{Object} 				nextData 				The new data that the template should reflect
	 * @return 		{Boolean} 										false if want to prevent the template to be rendered, true otherwise
	 */
	shouldTemplateUpdate(nextData) {
		// console.log(Object.assign({}, this.data));
		// console.warn(Object.assign({}, nextData));
		// console.error('should', ! _isEqual(this.data, nextData));
		// return ! _isEqual(this.data, nextData);
		return true;
	}

	/**
	 * Render the component
	 * Here goes the code that reflect the this.props state on the actual html element
	 * @definition 		SWebComponent.render
	 * @protected
	 */
	render(templateString = this.templateString) {
		super.render();

		// preparing the template
		templateString = this._prepareTemplateString(templateString);

		// console.error('templateString', templateString);
		this._sTemplate.templateString = templateString;

		// render the template
		this._sTemplate.render();

		// flag the fact that the first render has been made
		this._firstTemplateRenderDone = true;

		// set the component as dirty
		if ( ! this.hasAttribute('s-tplc-dirty')) {
			this.setAttribute('s-tplc-dirty', true);
		}
	}
}
