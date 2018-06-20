# SRangeComponent

Extends **SWebComponent**

Nice, easy to use, customizable and fully featured range webcomponent.


### Example
```html
	<input type="text" value="20" name="my-cool-input" />
<s-range for="my-cool-input" min="0" max="50"></s-range>
```
Author : Olivier Bossel <olivier.bossel@gmail.com>




## Attributes

Here's the list of available attribute to set on the element.

### for:

Specify an input to bind the range value to. This works the same way as the "for" attribute of a label.

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### min

Specify the minimum value of the range.

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### max

Specify the maximum value of the range.

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### step

Specify the step value if you want to constrain the user to chosse like 5-10-15, etc...

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### margin

When using two handles, specify the minimum margin between the two.

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### limit

When using two handles, specify the maximum margin between the two.

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### connect

When using two handles, specify if these two have to be linked visually or not

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### tooltips:

Display or not the tooltips

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### value

Specify the value of the range. If using two handles, need to be specified like "firstValue:secondValue" (double points separated)

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) , [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### updateInterval

Specify the time interval between actual input value updates

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### format

Specify how to format the output number(s). You need to pass a [wNumb configuration object](https://refreshless.com/wnumb/)

Type : **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**