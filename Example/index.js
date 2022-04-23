const globalStyle = {
    fontSize: '20px',
    padding: '10px',
    border: 'none',
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center'
}
let listData = [
    'America', 'India', 'Pakistan', 'China', 'Japan', 'Russia', 'Brazil', 'Australia', 'New Zealand', 'South Africa', 'Egypt', 'Iran', 'Turkey'
]

const ButtonPlus = new Spuck({ type: 'button', parent: '#app' });
ButtonPlus.prop = {
    text: 'Plus',
    css: {
        ...globalStyle,
        backgroundColor: 'red',
        color: 'white',
        cursor: 'pointer',
        marginInlineEnd: '5px'
    }
}

const ButtonMinus = new Spuck({ type: 'button', parent: '#app' });
ButtonMinus.prop = {
    text: 'Minus',
    css: { ...ButtonPlus.prop.css, backgroundColor: 'blue' }
}

const Count = new Spuck({ type: 'div', parent: '#app', class: 'count', id: 'count' });
Count.prop = {
    text: '0',
    css: {
        ...globalStyle,
        backgroundColor: 'white'
    }
}

const Text = new Spuck({ type: 'span', parent: '#app' });
Text.prop = { text: 'Click on the buttons to change the count', css: { ...globalStyle, color: 'gray', fontSize: '15px' } }

ButtonMinus.events = { click: () => change('-') };
ButtonPlus.events = { click: () => change('+') };

function change(type) {
    let currentCount = Count.prop.text;
    let newCount = type === '+' ? parseInt(currentCount) + 1 : parseInt(currentCount) - 1;
    Count.prop.text = newCount.toString();
    appRender();
}

const App = [ButtonMinus, ButtonPlus, Count, Text];
const appRender = () => App.forEach(item => item.reRender());

ButtonMinus.render();
ButtonPlus.render();
Count.render();
Text.render();

ButtonMinus.mount();
ButtonPlus.mount();
Count.mount();
Text.mount();


const List = new Spuck({ type: 'ul', parent: '#app2', id: 'list' });

List.prop = {
    css: {
        listStyle: 'none',
        padding: '0',
        margin: '0',
        width: 'fit-content',
    }
}

List.render();
List.mount();

const Li = [];
const listRender = () => Li.forEach(item => item.reRender());

for (let list of listData) {
    let li = new Spuck({ type: 'li', parent: '#list', id: `#${listData.indexOf(list, 0)}` });
    li.prop = {
        text: list,
        css: {
            ...globalStyle,
            backgroundColor: 'white',
            margin: '5px',
            cursor: 'pointer'
        }
    }
    li.events = { click: () => changeColor(li) };
    li.render();
    li.mount();
    Li.push(li);
}

function changeColor(el) {
    let color = el.prop.css.backgroundColor === 'white' ? 'wheat' : 'white';
    el.prop.css.backgroundColor = color;
    listRender();
}