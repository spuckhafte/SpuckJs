const Navbar = new Spuck({ type: 'nav', parent: '#head', class: 'navbar' });
Navbar.render();
Navbar.mount();

const ItemName = ['Home', 'About', 'Contact'];
const NavItems = []
for (let item of ItemName) {
    const Item = new Spuck({ type: 'a', parent: '.navbar', class: 'nav-item', id: ItemName.indexOf(item).toString() });
    Item.prop = { text: item }
    Item.render();
    Item.mount();
    NavItems.push(Item);
}

const Form = new Spuck({ type: 'form', parent: '#body', class: 'form' });
Form.events = { submit: e => { e.preventDefault(); sayName(NameInput.attr.value) } }
Form.render();
Form.mount();

const NameInput = new Spuck({ type: 'input', parent: '.form', class: 'form-control', id: 'name-inp' });
NameInput.prop = { text: 'Name' }
NameInput.attr = { placeholder: 'Enter your name', autofocus: 'true', required: 'true', maxlength: '20', minlength: '3', autocomplete: 'off' };
NameInput.events = { keyup: (e) => { NameInput.attr.value = e.target.value } }
NameInput.render();
NameInput.mount();

const Button = new Spuck({ type: 'button', parent: '.form', class: 'btn', id: 'submit-btn' });
Button.prop = { text: 'Submit' }
Button.render();
Button.mount();

const DisplayName = new Spuck({ type: 'h1', parent: '#body', class: 'display-name' });
DisplayName.prop = {
    text: '',
    css: {
        textAlign: 'center',
        fontSize: '50px',
        color: '#fff'
    }
}
DisplayName.render();
DisplayName.mount();

function sayName(name) {
    DisplayName.prop.text = `Hellow ${name}`;
    DisplayName.reRender();
}
