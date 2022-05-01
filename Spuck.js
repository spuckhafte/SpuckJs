class Spuck {
    constructor(init, prop, events, attr) {
        this.init = init; // {} type:_, parent:_, pseudoChildren[], class[], id:_
        this.prop = prop; // {} text:_, value:_, css{}
        this.events = events; // {} click:f, mouseover:f, etc.
        this.attr = attr; // {} value:_, placeholder:_, etc.
        this._state = {}; // { stateName: [stateValue, changeStateFunction] }
        this._pseudoState = {}; // { stateName: [stateValue, changeStateFunction] }
    }
 
    #_SP = '$-' // state prefix
    #_CSP = '$$-' // children (pseudo) state prefix

    _state // states of the elements
    _pseudoState // states of the pseudo-parent elements (pseudo states), if any

    render(query, t) { // creates or updates an element
        // query -> argument to trigger re-rendering, if need, it just updates the properties of the existing element

        const el = query === 're' ? this.el : document.createElement(this.init.type); // grab the HTML element 
        this.el = el;
        this.init.class && this.init.class.split(' ').forEach(_cl => el.classList.add(_cl)) // add classes
        this.init.id && !this.check(this.init.id) && el.setAttribute('id', this.init.id); // add id

        // add id if it's set as some state's name by extracting it
        if (this.init.id && this.check(this.init.id)) el.setAttribute('id', this.changeVal(this.init.id));

        // set pseudo-states of the pesudo-children if any 
        this.init.pseudoChildren && this.init.pseudoChildren.forEach(child => {
            child._pseudoState = { ...this._state }
        })

        // set attributes, either hard-coded or state-managed 
        if (this.attr && Object.keys(this.attr).length > 0) { 
            for (let key in this.attr) {
                if (!this.check(this.attr[key])) el.setAttribute(key, this.attr[key]);
                else el.setAttribute(key, this.changeVal(this.attr[key]));
            }
        }

        // set properties (hard-coded or state-managed)
        if (this.prop) {
            if (this.prop.text) {
                if (!this.check(this.prop.text)) el.innerHTML = this.prop.text;
                else el.innerHTML = this.changeVal(this.prop.text);
            }
            if (this.prop.value) {
                if (!this.check(this.prop.value)) el.value = this.prop.value;
                else el.value = this.changeVal(this.prop.value);
            }
            if (this.prop.css) {
                for (let style of Object.keys(this.prop.css)) {
                    if (!this.check(this.prop.css[style])) el.style[style] = this.prop.css[style];
                    else el.style[style] = this.changeVal(this.prop.css[style]);
                }
            }
        }

        // declare events
        if (this.events !== undefined) {
            for (let event of Object.keys(this.events)) {
                el.addEventListener(event, this.events[event]);
            }
        }
    }

    mount() { // put the element in dom
        let parent = document.querySelector(this.init.parent);
        parent.appendChild(this.el);
    }

    unMount() { // remove the element from dom
        let parent = document.querySelector(this.init.parent);
        parent.removeChild(this.el);
    }

    make(query) { // combines render and mount
        this.render(query);
        this.mount();
    }

    $state(_name, _val) { // sets element's state
        let _theStateArray = [
            _val,
            _newVal => this.#_alterState(_newVal, _name)
        ];
        this._state[_name] = _theStateArray;
        return _theStateArray[1]; // returns a function to change the state
    }

    getState(_name) { // gets the current value of a particular state
        return this._state[_name][0]
    }

    getPseudoState(_name) { // gets the current value of a particular pseudo state
        return this._pseudoState[_name][0]
    }

    #_alterState(_finVal, _name) { // changes the state value and resp. makes changes in element
        this._state[_name][0] = _finVal;
        this.render('re'); // reRender the element
        // reRender all the children
        if (this.init.pseudoChildren) this.init.pseudoChildren.forEach(child => child.render('re'));
    }

    #_getStateName(_stateName) { // gets the name of the value by removing the State Prefix or Children SP
        _stateName = _stateName.replace(_stateName.startsWith(this.#_SP) ? this.#_SP : this.#_CSP, '')
        return _stateName;
    }

    changeVal(val) { // converts prefixed state name or "pseudo-state name" to the state value
        if (val.startsWith(this.#_SP)) return this.getState(this.#_getStateName(val));
        if (val.startsWith(this.#_CSP)) return this.getPseudoState(this.#_getStateName(val));
    }

    check(query) { // checks if query is a prefixed state name
        return query.toString().startsWith(this.#_SP) || query.toString().startsWith(this.#_CSP)
    }
}
