const socket = io.connect('http://localhost:3000');

const Page = new Spuck({ type: 'main', parent: '#app', class: 'page' });
Page.prop = { css: { display: 'flex', flexDirection: 'column', alignItems: 'center' } };
Page.make();

const MsgArea = new Spuck({ type: 'div', parent: '.page', class: 'msg-area' });
MsgArea.prop = { css: { width: '100%', display: 'flex', flexDirection: 'column', height: '80vh', border: 'solid', paddingBlock: '0.5rem' } };
MsgArea.make();
const InputArea = new Spuck({ type: 'div', parent: '.page', class: 'inp-area' }, { css: { width: '100%', display: 'flex', height: '10vh', border: 'solid' } }).make();

const Input = new Spuck({ type: 'input', parent: '.inp-area', class: 'input' }).render();

const setVal = Input.$state('value', '');

Input.prop = { value: '$-value', css: { width: '100%', fontSize: 'larger' } };
Input.events = { input: e => setVal(e.target.value), keyup: e => sendMsg(e) };
Input.attr = { autofocus: true };
Input.make();

socket.on('show-msg', (msg, id) => {
    createMsg(msg, id === socket.id, id);
});

function createMsg(content, me, msgid) {
    let id = msgid.substring(0, 3) + '...';
    const Msg = new Spuck({ type: 'div', parent: '.msg-area', class: 'msg' });
    Msg.prop = { 
        text: `<span style='color: ${me?'blue':'red'}; font-weight:bold'>${me?'You':id} </span> ${content}`, 
        css: { width: '100%', fontSize: 'larger', marginInline: '0.5rem' } 
    };
    Msg.attr = { title: me?socket.id:msgid };
    Msg.make();
}

function sendMsg(event) {
    if (event.keyCode === 13) {
        if (event.target.value.trim() === '') {
            setVal('');
            return;
        }
        let msg = Input.getState('value').trim();
        socket.emit('send-msg', msg);
        setVal('');
    }
}