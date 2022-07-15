/*
    * When user clicks first 2 buttons, their state will change.
    * Now the dependency of their effects are their respective states.
    * If user clicks, the state will change => dependency will change => effect will run.
    
    * The third button's effect's dependencies are the states of the first 2 buttons.
    * If any of the two states change (any of the first 2 btns is clicked), the third button's effect will run.
    
    * For passing any state from one element to another, the "second" element should be defined as the pseudo-child of the "first" element.
*/

// First Button
const Button1 = new Spuck({ type: 'button', parent: '#app', id: '1' }).render();
const setCount1 = Button1.$state('count1', 0); // set state of the first button
Button1.render('re');

Button1.prop = { text: 'Clicked: $-count1 times' }; // refer to the state of the first button using "$-" in a string
Button1.events = { click: () => setCount1(count => count + 1) }; // change the state of the first button when it is clicked

Button1.$effect(() => { // effect function for the first button
    console.log('Button1 count is: ' + Button1.getState('count1'));
}, ['$-count1']); // effect dependency is the state of the first button

Button1.make('re'); // render and mount the first button

new Spuck({ type: 'br', parent: '#app' }).make();
new Spuck({ type: 'br', parent: '#app' }).make();

// Second Button
const Button2 = new Spuck({ type: 'button', parent: '#app', id: '2' }).render();

const setCount2 = Button2.$state('count2', 0);
Button2.render('re');

Button2.prop = { text: 'Clicked: $-count2 times' };
Button2.events = { click: () => setCount2(count => count + 1) };

Button2.$effect(() => {
    console.log('Button2 count is: ' + Button2.getState('count2'));
}, ['$-count2']);
Button2.make('re');

new Spuck({ type: 'br', parent: '#app' }).make();
new Spuck({ type: 'br', parent: '#app' }).make();

// // Third Button
const Button3 = new Spuck({ type: 'button', parent: '#app', id: '3' }).render();

Button1.init.pseudoChildren = [Button3]; // set the third button as the pseudo-child of the first button to access its state
Button1.render('re');
Button2.init.pseudoChildren = [Button3]; // set the third button as the pseudo-child of the second button to access its state too
Button2.render('re');

// // refer to the pseudo-states (states of the first 2 buttons) of the third button by using "$$-" in a string
Button3.prop = { text: 'Button1 count: $$-count1 ; Button2 count: $$-count2' };
Button3.attr = { disabled: true };

Button3.$effect(() => { // effect function for the third button
    console.log(`Button3 effected by Button1 (${Button3.getPseudoState('count1')} times) and Button2 (${Button3.getPseudoState('count2')} times)`);
    console.log('')
}, ['$$-count1', '$$-count2']); // effect depends on its pseudo-states (states of the first 2 buttons)

Button3.make('re');