# SpuckJs
**Javscript Library**<br/>
*Under Development*

# What?
`SpuckJs` is a Js library which converts pure Js Objects into DOM elements.<br/> 
Each object of class `Spuck` is a Virtual element which you can put in the DOM.<br/><br/> 
It features **state management**.<br/>
You can pass `states` of an element to others (parents or children or partners, doesn't matter) by making them `pseudo-children` of the main element.


# How?
### index.html
```html
<head>
  <script src='spuck.js'></script>
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


