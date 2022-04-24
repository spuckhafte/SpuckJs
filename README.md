# SpuckJs
**Javscript Library**<br/>
*Under Development*

# How?
Each object of class `Spuck` is an HTML element, which can be worked upon.
<br/>
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
Heading.render(); // render element
Heading.mount(); // Put the element in DOM


const NameInput = new Spuck({ type: 'input', parent: '#app', class: 'name' })
NameInput.prop = {
  css: {
    width: '20rem', height: '3rem', backgroundColor: 'black',
    outline: 'none', border: 'none', color: 'white',
    fontSize: '1.5rem', fontWeight: 'bold',
  }
}
NameInput.attr = { autofocus: 'true', autocomplete: 'off' }

// define events on an element and assign callbacks to them
NameInput.events = {
  keyup: e => putName(e.target.value)
}

NameInput.render();
NameInput.mount();


const NameDisplay = new Spuck({ type: 'h2', parent: '#app' })
NameDisplay.prop = { text: '', css: { cursor: 'pointer', color: 'red', width: 'fit-content' } }
NameDisplay.events = { click: changeColor }

NameDisplay.render();
NameDisplay.mount();


function putName(nameVal) {
  NameDisplay.prop.text = nameVal;
  NameDisplay.reRender(); // render the element again to see changes
}

function changeColor() {
  let color = NameDisplay.prop.css.color === 'red' ? 'blue' : 'red';
  NameDisplay.prop.css.color = color;

  NameDisplay.reRender();
}
```

### Result:

https://user-images.githubusercontent.com/70335252/164968898-17029eb5-cca6-4769-ace1-b67455bc495a.mp4

