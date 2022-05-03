<p align='center'><img width='400' height='300' src='https://user-images.githubusercontent.com/70335252/166430266-10f9f4af-4eed-4ee4-b5b5-7d0837492a0e.jpeg'></p>


# SpuckJs
**Javscript Library**<br/>
*Under Development*

# DOCUMENTATION
`SpuckJs` is a Js library which converts pure Js Objects into DOM elements.<br/> 
Each object of class `Spuck` is a Virtual element which you can put in the DOM.<br/><br/> 

## new Spuck()
Create a virtual element, an object using the `Spuck` class.<br>
You first `initialize` it by defining it's type, parent element and classes and ids.<br>
Then define its `properties`, like **text** and **css**, bind `events` to it and define `attributes`.
```js
const Button = new Spuck()
// constructor Spuck(init: {}, prop: {}, events: {}, attr: {}): Spuck

/*	others:
	* this._state = {}; // { stateName: [stateValue, changeStateFunction] }
	* this._pseudoState = {}; // { stateName: [stateValue, changeStateFunction] }
	* this.#_effects = {}; // { 1: [effectFunc, [dep]] }
	* this.#_deps = {}; // { '$-state': [value, firstTimeOrNot] }
*/, these are managed by the library
```

## render()
You render an element manually when you when you define a bunch of properties and then wanna add it to the element.<br>
It requires a `query` as parameter to be `'re'` when you are rendering it second or more times, `render('re')`.<br>
When `query = 're'`, the element just gets updated with new properties, otherwise a new one is created.<br>
It's great if you ***render*** the element while it's created, cause `effect` and `state` can only be used in a *rendered* element
```js
const Button = new Spuck({ type: 'button', parent: '#app', class: 'class1 class2', id: 'something' }).render();
// intializing it that way is quite handy, you can also do it in a separate line: "Button.init = {...}"
Button.prop = { text: 'lorem', css: { cursor: 'pointer', marginInline: '2px' } }
Button.attr = {...} ; Button.events = { click: someFunc, mouseover: () => func(param) }
```
After defining some properties, you re-render (as it's already rendered) it
```js
Button.render('re')
```
But if you want to put it in the **DOM** now, you can use this:
```js
Button.render('re')
Button.mount() // put's it in the DOM
// or use
Button.make('re') // combines render() and mount(), passes the parameter to render()
```
**You can use `render` even after the using `make` (putting it to DOM), it will update the mounted element at any point of time**

# State and Effect Management

## $state()
Define a state with `$state` function and use it by referring to it's name in strings or using `getState` function.

`getState()` will not change the value when state is changed, it will store a static value, it can change when the whole code re-runs, *for eg.* when it is used in a **loop** or bind to an event.<br>

Unlike `getState`, reffering state using its name in strings (`'$-state'`) changes it's value when the state changes.<br>

`$state` returns a function to change the state.<br>
```js
const setState = Element.$state('stateName', stateValue)
```

**Define states right after the element is first rendered.**<br>
To use the state value, either refer to its name or use a built in function.
```js
const setCount = Button.$state('count', 0)
Button.prop = { text: 'Clicked $-count times' } // $-count gets converted to the count value
```
You can now change the count each time the button is clicked
```js
Button.events = { click: () => setCount(Button.getState('count') + 1)
```
As `setCount` is called, the state changes and the element automatically re-renders and `$-count` to updates.<br>
**Do not forget to re-render the element after all**
```js
Button.render('re')
```
### Pass the states to other elements

You can pass `states` of an element to others (parents or children or partners, doesn't matter) by making them `pseudo-children` of the main element.<br>
```js
const Div = new Spuck({ type: 'div', parent: '#app' }).render();
Button.init.pseudoChildren = [Div] // set it as a pseudo child and then make sure to re render the Button
Button.render('re')
```
Now you can refer to the states of the Button easily inside the `Div`.<br>
`states` of the **Button** are defined as `pseudo-states` of the **Div** (pseudo-child)
```js
Div.prop = { text: 'Button is clicked: $$-count times' } // by using $$-
console.log(Div.pseudoState('count')) // same as .getState() but for pseudo-states
Div.make('re')
```

## $effect
You can run a function (effect) when some kind of values (dependencies) change on render.<br>
At this point of time, dependencies can only be states or pseudo-states.<br>
```js
Button.$effect(() => { 
	// this function will run first time and on every other render in which the dependencies will change
	console.log(`Button is clicked: ${Button.getState('count')} times`)
}, ['$-count']) // when count will change, the text will be console logged
```
An element can't have states of others as it's dependencies, until it is a pseudoChild of some other.<br>
`Div` is a pseudo-child of `Button`, this implies
```js
Div.$effect(() => {
	console.log('Div effected by Button')
}, ['$$-count'])

Div.render('re')
```

### Together it looks like
```js
const Button = new Spuck({ type: 'button', parent: '#app', class: 'class1 class2', id: 'something' }).render();

const setCount = Button.$state('count', 0)
Button.prop = { text: 'Clicked: $-count times', css: { cursor: 'pointer' } }
Button.events = { click: () => setCount(Button.getState('count') + 1) }

Button.$effect(() => {
    console.log(`Button is clicked: ${Button.getState('count')} times`)
}, ['$-count'])
Button.make('re')

const Div = new Spuck({ type: 'div', parent: '#app' }).render()

Button.init.pseudoChildren = [Div]
Button.render('re')

Div.prop = { text: 'Button is clicked $$-count times' }
Div.$effect(() => {
    console.log('Div effected by Button')
}, ['$$-count'])
Div.make('re')
```

![state](https://user-images.githubusercontent.com/70335252/166448233-4ef6765d-1fda-45ca-9f7a-44e702793f10.gif)

# EXAMPLES
### index.html
```html
<head>
  <script src='https://cdn.jsdelivr.net/gh/spuckhafte/SpuckJs@0.1.0/Spuck.js'></script>
  <script src='index.js' defer></script>
</head>
<body>
  <div id='app'></div>
</body>
```
### index.js
```js
// initialize the element
const Heading = new Spuck({ type: 'h1', parent: '#app', class: 'heading', id: 'heading' })

// Define properties of "Heading", i.e, "text" and "css"
Heading.prop = {
  text: "SpuckJs",
  css: { // normal css properties, following camel case (margin-inline -> marginInline)
    textAlign: 'center'
  }
}
Heading.make(); // it render and mounts the element to the dom


const NameInput = new Spuck({ type: 'input', parent: '#app', class: 'name', id: 'inp' })
NameInput.render(); // makes an element (does not put it in the dom)

const setValue = NameInput.$state('value', '') // state of the element, returns a function to update it

NameInput.prop = {
  value: '$-value', // refer to the state named "value" by using $- as prefix 
  css: {
    width: '20rem', height: '3rem', backgroundColor: 'black',
    outline: 'none', border: 'none', color: 'white',
    fontSize: '1.5rem', fontWeight: 'bold',
  }
}
NameInput.attr = { autofocus: 'true', autocomplete: 'off' }

// define events on an element and assign callbacks to them
NameInput.events = {
  keyup: e => setValue(e.target.value) // change the "value" state when someone types
}
NameInput.make('re'); // remake(update) the rendered element


const NameDisplay = new Spuck({ type: 'h2', parent: '#app', id: 'display' })
NameDisplay.render();

NameInput.init.pseudoChildren = [NameDisplay] 
/* 
	set NameDis as pseudoChild of NameInp to pass down state of the Parent (input el)
	to its children (only NameDisplay in this case). Now NameDisplay can access these
	states as pseudo-states by using $$- as prefix, eg. $$-someStateOfParent.
*/
NameInput.render('re');

const setColor = NameDisplay.$state('color', 'red'); // this state will manage the color of the text

NameDisplay.prop = { 
	text: '$$-value', // use the "value" state of NameInp (pseudo-parent)
	css: { cursor: 'pointer', color: '$-color', width: 'fit-content' } 
}
NameDisplay.events = { click: () => setColor(NameDisplay.getState('color') === 'red' ? 'blue' : 'red') }
NameDisplay.make('re');
```

### Result:

https://user-images.githubusercontent.com/70335252/164968898-17029eb5-cca6-4769-ace1-b67455bc495a.mp4

# Comparison 1:
**SpuckJs - state managed**
```js
const Input = new Spuck({ type: 'input', parent: '#app' }).render();
const setValue = Input.$state('value', '');
Input.attr = { value: '$-value', autofocus: 'true' };
Input.events = { keyup: e => setValue(e.target.value) };
Input.make('re');
const Display = new Spuck({ type: 'h4', parent: '#app' }).render();
Input.init.pseudoChildren = [Display];
Input.render('re');
const setColor = Display.$state('color', 'red');
Display.prop = { text: '$$-value', css: { color: '$-color', cursor: 'pointer', userSelect: 'none' } };
Display.events = { click: () => setColor(Display.getState('color') === 'blue' ? 'red' : 'blue') };
Display.make('re');
```
**SpuckJs - no state**
```js
const Input = new Spuck({ type: 'input', parent: '#app' }, {}, {}, { autofocus: 'true' }).render();
const Display = new Spuck({ type: 'h4', parent: '#app' }).render();
Display.prop = { text: '', css: { color: 'red', userSelect: 'none' } }
Display.events = { click: () => Display.prop.css.color = Display.prop.css.color === 'blue' ? 'red' : 'blue'; Display.render('re') };
Input.events = { keyup: e => { Display.prop.text = e.target.value; Display.render('re') } };
[Input, Display].forEach(i => i.make('re'));
```
**VanillaJS - no state**
```js
const Input = document.createElement('input');
const Display = document.createElement('h4');
Input.setAttribute('autofocus', true);
Input.addEventListener('keyup', e => Display.innerHTML = e.target.value);
Object.assign(Display.style, { color: 'red', userSelect: 'none', cursor: 'pointer' });
Display.addEventListener('click', () => Display.style.color = Display.style.color === 'blue' ? 'red': 'blue');
document.querySelector('#app').appendChild(Input);
document.querySelector('#app').appendChild(Display);
```

# Comparison 2:
**SpuckJs - state managed**
```js
const Parent = new Spuck({ type: 'div', parent: '#app' }).render();
const setBg = Parent.$state('color', 'red');
Parent.prop = { css: { width: '50px', height:'50px', background: '$-color', cursor: 'pointer', marginBlock: '2em' } };
Parent.events = { click: () => setBg('#'+Math.floor(Math.random()*16777215).toString(16)) };
Parent.make('re');
for (i=1; i <= 3; i++) {
	const Child = new Spuck({ type: 'div', parent: '#app', id: `${i}` }).render();
	Parent.init.pseudoChildren = Parent.init.pseudoChildren ? [...Parent.init.pseudoChildren, Child] : [Child];
	Parent.render('re');
	Child.prop = { css: { width: '50px', height: '50px', background: '$$-color', marginBlock: '2px' } };
	Child.make('re')
}
```
**VanillaJs - no state**
```js
let Parent = document.createElement('div');
Object.assign(Parent.style, { width: '50px',height: '50px',background: 'red',cursor: 'pointer',marginBlock: '2em' });
let children = [];
for (i=1; i<=3; i++) {
	let Child = document.createElement('div')
	Object.assign(Child.style, { width: '50px', height: '50px', background: 'red', marginBlock: '2px' })
	children.push(Child)
}
Parent.addEventListener('click', () => {
	let color = '#'+Math.floor(Math.random()*16777215).toString(16)
	Object.assign(Parent.style, { background: color })
	children.forEach(child => child.style.background = color);
})
document.querySelector('#app').appendChild(Parent)
children.forEach(el => document.querySelector('#app').appendChild(el))
```

**When first block is clicked, all the blocks change their color**<br/>
<img width="46" alt="Screenshot 2022-05-02 094632" src="https://user-images.githubusercontent.com/70335252/166183626-e4e437e4-2192-42d5-9bfa-8cdf664e8632.png">


