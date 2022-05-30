/*
    Copyright (c) 2022, Spuck.js, Rakshit
    All rights reserved.
*/

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
        this.#_partialEffects = {}; // { 1: [effectFunc, type] } // type: 'f' or 'e' (first time or everytime)
    }

    #_SP = '$-' // state prefix
    #_CSP = '$$-' // children (pseudo) state prefix

    _state // states of the elements
    _pseudoState // states of the pseudo-parent elements (pseudo states), if any
    #_effects // functions that run when change occurs in some state
    #_deps // all the states that are triggering some effects
    #_partialEffects // functions that run first time or everytime

    render(query) { // creates or updates an element
        // query -> argument to trigger re-rendering, if need, it just updates the properties of the existing element

        const el = query === 're' ? this.el : document.createElement(this.init.type); // grab the HTML element 
        this.el = el;

        // set element class
        this.el.className = ''; // empty it first
        // add classes, either hardcoded or from state/pseudo-state names
        this.init.class && this.init.class.split(' ').forEach(_cl => {
            if (this._check(_cl)) {
                if (_cl.startsWith(this.#_SP)) {
                    let _stateName = this.#_getStateName(_cl);
                    if (this.getState(_stateName) !== '') el.classList.add(this.getState(_stateName));
                } else {
                    let _stateName = this.#_getStateName(_cl);
                    if (this.getPseudoState(_stateName) !== '') el.classList.add(this.getPseudoState(_stateName));
                }
            } else el.classList.add(_cl);
        })
        this.init.id && !this._check(this.init.id) && el.setAttribute('id', this.init.id); // add id

        // add id if it's set as some state's name by extracting it
        if (this.init.id && this._check(this.init.id)) el.setAttribute('id', this._formatString(this.init.id));

        // set pseudo-states of the pesudo-children if any 
        this.init.pseudoChildren && this.init.pseudoChildren.forEach(child => {
            child._pseudoState = Object.keys(child._pseudoState).length === 0 ? { ...this._state } : { ...child._pseudoState, ...this._state }
        })

        // set attributes, either hard-coded or state-managed 
        if (this.attr && Object.keys(this.attr).length > 0) {
            for (let key in this.attr) {
                if (!this._check(this.attr[key])) el.setAttribute(key, this.attr[key]);
                else el.setAttribute(key, this._formatString(this.attr[key]));
            }
        }

        // set properties (hard-coded or state-managed)
        if (this.prop) {
            if (this.prop.text) {
                if (!this._check(this.prop.text)) el.innerHTML = this.prop.text;
                else el.innerHTML = this._formatString(this.prop.text);
            }
            if (this.prop.value) {
                if (!this._check(this.prop.value)) el.value = this.prop.value;
                else el.value = this._formatString(this.prop.value);
            }
            if (this.prop.css) {
                for (let style of Object.keys(this.prop.css)) {
                    if (!this._check(this.prop.css[style])) el.style[style] = this.prop.css[style];
                    else el.style[style] = this._formatString(this.prop.css[style]);
                }
            }
        }

        // declare events
        if (this.events !== undefined) {
            for (let event of Object.keys(this.events)) {
                el.addEventListener(event, this.events[event]);
            }
        }


        // partial effects
        if (Object.keys(this.#_partialEffects).length > 0) {
            for (let key of Object.keys(this.#_partialEffects)) {
                if (this.#_partialEffects[key][1] === 'f') {

                    this.#_partialEffects[key][0]();
                    delete this.#_partialEffects[key];

                } else this.#_partialEffects[key][0]();
            }
        }

        if (Object.keys(this.#_deps).length > 0) { // run effect functions if dependencies change
            let dependencies = Object.keys(this.#_deps);
            let alteredDeps = []
            dependencies.forEach(depend => {
                if (this.#_deps[depend][0] !== this._changeVal(depend) || this.#_deps[depend][1]) {
                    if (this.#_deps[depend][1]) this.#_deps[depend][1] = false;
                    else this.#_deps[depend][0] = this._changeVal(depend);
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

    isMount() { // _checks if the element is mounted or not
        let parent = document.querySelector(this.init.parent);
        let el = parent.querySelector(`#${this.init.id}`);
        return !!el;
    }

    make(query) { // combines render and mount
        let el = this.render(query);
        this.mount();
        return el
    }

    $state(_name, _val, _autoRender=true) { // sets element's state
        let _theStateArray = [
            _val,
            _newVal => this.#_alterState(_newVal, _autoRender, _name)
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

    #_alterState(_finVal, _autoRender, _name) { // changes the state value and resp. makes changes in element
        if (typeof _finVal === 'function') {
            let _actualFinVal = _finVal(this.getState(_name));
            this._state[_name][0] = _actualFinVal;
        } else this._state[_name][0] = _finVal;

        if (_autoRender) this.render('re'); // reRender the element
        // reRender all the children
        if (_autoRender) if (this.init.pseudoChildren) this.init.pseudoChildren.forEach(child => child.render('re'));
        return _finVal;
    }

    #_getStateName(_stateName) { // gets the name of the value by removing the State Prefix or Children SP
        _stateName = _stateName.replace(_stateName.startsWith(this.#_SP) ? this.#_SP : this.#_CSP, '')
        return _stateName;
    }

    _changeVal(val) { // converts prefixed state name or "pseudo-state name" to the state value
        if (val.startsWith(this.#_SP)) {
            let _stateName = this.#_getStateName(val);
            if (this._state[_stateName]) return this.getState(_stateName);
            else return val;
        }
        if (val.startsWith(this.#_CSP)) {
            let _stateName = this.#_getStateName(val);
            if (this._pseudoState[_stateName]) return this.getPseudoState(_stateName);
            else return val;
        }

    }

    _formatString(text) { // formats a string, converting any $-state to its value
        if (!text.includes(this.#_SP) && !text.includes(this.#_CSP)) return text;
        let formatted = ''
        if (text.split(' ').length === 1) return this._changeVal(text)
        text.split(' ').forEach(tx => formatted += this._check(tx) ? `${this._changeVal(tx)} ` : `${tx} `)
        return formatted
    }

    _check(query) { // _checks if query is a prefixed state name
        return query.toString().includes(this.#_SP) || query.toString().includes(this.#_CSP)
    }

    $effect(_func, _deps) { // run an effect (function) when one of the dependency (state) change
        let effectIndex = Object.keys(this.#_effects).length + 1;
        _deps.forEach(_dep => {

            // partial effects
            if (_dep === 'f' || _dep === 'e') this.#_partialEffects[Object.keys(this.#_partialEffects).length] = [_func, _dep];

            // effects
            else this.#_deps[_dep] = [this._formatString(_dep), true]
        })
        this.#_effects[effectIndex] = [_func, _deps]
    }
}