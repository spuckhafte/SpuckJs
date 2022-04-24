class Spuck {
    constructor(init, prop, events, attr) {
        this.init = init; // {} type, parent, class, id
        this.prop = prop; // {} text, value, css
        this.events = events; // {} click, mouseover, etc.
        this.attr = attr; // {} value, placeholder, etc.
    }


    render() {
        const el = document.createElement(this.init.type);
        this.el = el;
        this.init.class && el.classList.add(this.init.class);
        this.init.id && el.setAttribute('id', this.init.id);

        if (this.attr && Object.keys(this.attr).length > 0) {
            for (let key in this.attr) {
                el.setAttribute(key, this.attr[key]);
            }
        }

        if (this.prop && this.prop.text) el.innerHTML = this.prop.text;
        if (this.prop && this.prop.value) el.value = this.prop.value;
        this.prop && this.prop.css && Object.assign(el.style, this.prop.css);

        if (this.events !== undefined) {
            for (let event of Object.keys(this.events)) {
                el.addEventListener(event, this.events[event]);
            }
        }
    }

    reRender() {
        this.unMount();
        this.render();
        this.mount();
    }

    mount() {
        let parent = document.querySelector(this.init.parent);
        parent.appendChild(this.el);
    }

    unMount() {
        let parent = document.querySelector(this.init.parent);
        parent.removeChild(this.el);
    }
}
