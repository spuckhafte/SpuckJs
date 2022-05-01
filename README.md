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

