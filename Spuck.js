class Spuck {
    constructor(init, prop, events, attr) {
        this.init = init; // {} type:_, parent:_, pseudoChildren[], class[], id:_
        this.prop = prop; // {} text:_, value:_, css{}
        this.events = events; // {} click:f, mouseover:f, etc.
        this.attr = attr; // {} value:_, placeholder:_, etc.
        this._state = {}; // { stateName: [stateValue, changeStateFunction] }
        this._pseudoState = {}; // { stateName: [stateValue, changeStateFunction] }
        this.#_effects = {}; // { 1: [effectFunc, [dep]] }
        this.#_deps = {}; // { '$-state': [value, firstTimeOrNot] }
    }
 
    #_SP = '$-' // state prefix
    #_CSP = '$$-' // children (pseudo) state prefix

    _state // states of the elements
    _pseudoState // states of the pseudo-parent elements (pseudo states), if any
    #_effects // functions that run when change occurs in some state
    #_deps // all the states that are triggering some effects

    render(query) { // creates or updates an element
        // query -> argument to trigger re-rendering, if need, it just updates the properties of the existing element

        const el = query === 're' ? this.el : document.createElement(this.init.type); // grab the HTML element 
        this.el = el;
        this.init.class && this.init.class.split(' ').forEach(_cl => el.classList.add(_cl)) // add classes
        this.init.id && !this.check(this.init.id) && el.setAttribute('id', this.init.id); // add id

        // add id if it's set as some state's name by extracting it
        if (this.init.id && this.check(this.init.id)) el.setAttribute('id', this.formatString(this.init.id));

        // set pseudo-states of the pesudo-children if any 
        this.init.pseudoChildren && this.init.pseudoChildren.forEach(child => {
            child._pseudoState = { ...this._state }
        })

        // set attributes, either hard-coded or state-managed 
        if (this.attr && Object.keys(this.attr).length > 0) { 
            for (let key in this.attr) {
                if (!this.check(this.attr[key])) el.setAttribute(key, this.attr[key]);
                else el.setAttribute(key, this.formatString(this.attr[key]));
            }
        }

        // set properties (hard-coded or state-managed)
        if (this.prop) {
            if (this.prop.text) {
                if (!this.check(this.prop.text)) el.innerHTML = this.prop.text;
                else el.innerHTML = this.formatString(this.prop.text);
            }
            if (this.prop.value) {
                if (!this.check(this.prop.value)) el.value = this.prop.value;
                else el.value = this.formatString(this.prop.value);
            }
            if (this.prop.css) {
                for (let style of Object.keys(this.prop.css)) {
                    if (!this.check(this.prop.css[style])) el.style[style] = this.prop.css[style];
                    else el.style[style] = this.formatString(this.prop.css[style]);
                }
            }
        }

        // declare events
        if (this.events !== undefined) {
            for (let event of Object.keys(this.events)) {
                el.addEventListener(event, this.events[event]);
            }
        }


        if (Object.keys(this.#_deps).length > 0) { // run effect functions if dependencies change
            let dependencies = Object.keys(this.#_deps);
            let alteredDeps = []
            dependencies.forEach(depend => {
                if (this.#_deps[depend][0] !== this.changeVal(depend) || this.#_deps[depend][1]) {
                    if (this.#_deps[depend][1]) this.#_deps[depend][1] = false;
                    else this.#_deps[depend][0] = this.changeVal(depend);
                    alteredDeps.push(depend)
                }
            })
            
            Object.keys(this.#_effects).forEach(_effectIndex => {
                let effect = this.#_effects[_effectIndex];
                for (let dep of effect[1]) {
                    if (alteredDeps.includes(dep)) {
                        effect[0]();
                        break;
                    }
                }
            })
        }

        return this
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

    getPseudoState(_name) { // gets the current value of a particular pseudo state]
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

    formatString(text) { // formats a string, converting any $-state to its value
        if (!text.includes(this.#_SP) && !text.includes(this.#_CSP)) return text;
        let formatted = ''
        if (text.split(' ').length === 1) return this.changeVal(text)
        text.split(' ').forEach(tx => formatted += this.check(tx) ? `${this.changeVal(tx)} ` : `${tx} `)
        return formatted
    }

    check(query) { // checks if query is a prefixed state name
        return query.toString().includes(this.#_SP) || query.toString().includes(this.#_CSP)
    }

    $effect(_func, _deps) { // run an effect (function) when one of the dependency (state) change
        let effectIndex = Object.keys(this.#_effects).length + 1;
        _deps.forEach(_dep => this.#_deps[_dep] = [this.formatString(_dep), true])
        this.#_effects[effectIndex] = [_func, _deps]
    }
}
