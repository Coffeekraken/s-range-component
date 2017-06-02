# SRangeComponent

Extends **SInputWebComponent**

Nice, easy to use, customizable and fully featured range webcomponent.


### Example
```html
	<input type="text" is="s-range" min="0" max="50" value="20" />
<input type="text" is="s-range" min="20" max="50" value="20,34" />
<input type="text" is="s-range" min="0" max="1000" value="400" step="10" />
```
Author : Olivier Bossel <olivier.bossel@gmail.com>




## Attributes

Here's the list of available attribute to set on the element.

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


### direction

Specify the range direction. Support "rtl" and "ltr"

Values : **rtl,ltr**

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **ltr**


### keepInput

Specify if need to keep the input displayed or not

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### tooltips

Specify if need to display a tooltip that follows the handles when sliding them.
The value of this can be specified through the formatter. See the formatter doc for more info.

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### connect

When using two handles, specify if these two have to be linked visually or not

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **true**


### value

Specify the value of the range. If using two handles, need to be specified like "firstValue,secondValue" (comma separated)

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) , [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### formatter

Specify a formatter function or a registered formatter name to display the values at a specific target point in the range like "input", "tooltip" and "handle"
This function will receive these parameters:
1. ```value``` : The value to format
2. ```target``` : The target where the value will be displayed like "input", "tooltip" or "handle"
This function has to return the formatted value.
> Do not declare this function with the "=>" function syntax otherwise your "this" context will not point to the actual component instance...

Type : **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) , [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**


### color

Specify the registered sugar color to use for the range

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **default**


### updateInterval

Specify the time interval between actual input value updates

Type : **{ [Number](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Number) }**

Default : **null**


### pips

Specify if and how to display the pips
- ```density``` : 	The density of pips to have. Lower means that you will have more...
- ```mode``` : The mode to use to draw pips. Possible values are :
	1. **range** : Use the range slider property to draw the pips
	2. **positions** : Use an array of positions percentage based by setting the ```values``` property
	3. **count** : Use to specify a number of pips to draw by setting the ```values``` property
	4. **values** : Set specify values where you want a pip to be drawed by settings the ```values``` property


#### Example
```js
	// positions
{
	mode : 'positions',
	values : [0,25,50,75,100]
}
// count
{
	mode : 'count',
	values : 5
}
// etc...
```
Type : **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**




## Methods


### registerFormatter

Register a new formatter


Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
name  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The formatter name  |  required  |
formatter  |  **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**  |  The formatter function  |  required  |

**Static**