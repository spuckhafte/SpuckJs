const dict = { 0: 'home', 1: 'work', 2: 'contact' }
const dictReverse = { 'home': 0, 'work': 1, 'contact': 2 }


const App = new Spuck({ type: 'div', parent: '#index', class: 'App' }).render();

let setTabState = App.$state('tabState', 0);
App.make('re');


const Navbar = new Spuck({ type: 'nav', parent: '.App', class: 'navbar' }).render();

App.init.pseudoChildren = [Navbar];
App.render('re');

let setTab = Navbar.$state('tab', dict[Navbar.getPseudoState('tabState')]);
Navbar.$effect(() => {
    setTab(dict[Navbar.getPseudoState('tabState')]);
}, ['$$-tabState']);
Navbar.make('re');


const Home = new Spuck({ type: 'div', parent: '.navbar', id: 'home' }).render();
const Work = new Spuck({ type: 'div', parent: '.navbar', id: 'work' }).render();
const Contact = new Spuck({ type: 'div', parent: '.navbar', id: 'contact' }).render();

Navbar.init.pseudoChildren = [Home, Work, Contact];
Navbar.render('re');

[Home, Work, Contact].forEach(child => {
    let setIsActive = child.$state('isActive', '');
    
    child.init = { ...child.init, class: 'nav-items $-isActive' };
    child.prop = { text: child.init.id };
    child.events = { click: () => setTabState(dictReverse[child.init.id]) }

    child.$effect(() => {
        setIsActive(child.getPseudoState('tab') === child.init.id ? 'n-active' : '');
    }, ['$$-tab']);

    child.make('re');
})

console.log(App);
