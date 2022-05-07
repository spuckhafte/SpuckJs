const Projects = PROJETCS;
const dict = { 0: 'home', 1: 'work' }
const dictReverse = { 'home': 0, 'work': 1 }


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


const NavHome = new Spuck({ type: 'div', parent: '.navbar', id: 'home' }).render();
const NavWork = new Spuck({ type: 'div', parent: '.navbar', id: 'work' }).render();

Navbar.init.pseudoChildren = [NavHome, NavWork];
Navbar.render('re');

[NavHome, NavWork].forEach(child => {
    let setIsActive = child.$state('isActive', '');

    child.init = { ...child.init, class: 'nav-items $-isActive' };
    child.prop = { text: child.init.id };
    child.events = { click: () => setTabState(dictReverse[child.init.id]) }

    child.$effect(() => {
        setIsActive(child.getPseudoState('tab') === child.init.id ? 'n-active' : '');
    }, ['$$-tab']);

    child.make('re');
});


const Home = new Spuck({ type: 'div', parent: '.App', class: 'home', id: 'home-area' }).render();
const Work = new Spuck({ type: 'div', parent: '.App', class: 'work-window', id: 'work-area' }).render();

App.$effect(() => {
    if (App.getState('tabState') === 0) {
        Work.isMount('#work-area') && Work.unMount();
        Home.make('re');
    } else {
        Home.isMount('#home-area') && Home.unMount();
        Work.make('re');

        const WorkTop = new Spuck({ type: 'div', parent: '#work-area', class: 'work-top', id: 'work-top' }, { text: 'Work' }).render();
        const WorkRacks = new Spuck({ type: 'div', parent: '#work-area', class: 'work-racks', id: 'work-racks-area' }).render();

        if (!WorkTop.isMount('#work-top')) {
            WorkTop.make('re');
            WorkRacks.make('re');
            for (let project of Projects) {
                showProjects(project, '#work-racks-area', undefined, 9);
            }
        }
    }
}, ['$-tabState'])
App.render('re');

const HomeHead = new Spuck({ type: 'div', parent: '#home-area', class: 'home-head', id: 'home-head-area' }).make();

const HomeHeadImage = new Spuck({ type: 'div', parent: '#home-head-area', class: 'home-head-image', id: 'home-head-image-area' }).make();
const HomeHeadImageImg = new Spuck({ type: 'img', parent: '#home-head-image-area' }, {}, {}, { src: 'https://spuckhafte.netlify.app/static/media/Me.bb7b14121491f0f48b4f.png' }).make();
const HomeHeadText = new Spuck({ type: 'div', parent: '#home-head-area', class: 'home-head-text', id: 'home-head-text-area' }).make();
const HomeHeadTextWelcome = new Spuck({ type: 'div', parent: '#home-head-text-area', class: 'home-head-text-welcome' }).render();
const HomeHeadTextSub = new Spuck({ type: 'div', parent: '#home-head-text-area', class: 'home-head-text-sub' }).render();
HomeHeadTextWelcome.prop = { text: "Hi, I am Rakshit,<br/>Web Developer." };
HomeHeadTextSub.prop = { text: "I am a <i>full-stack developer</i> with a passion for programing and web development. I like to create <i>web applications</i> and <i>backend services</i>. <i>Javascript</i> is my forte and I know bunch of others like <i>Python</i> and <i>C#-Unity</i>. I pretty <i>suck</i> at getting <i>ideas for designs</i>." };
[HomeHeadTextWelcome, HomeHeadTextSub].forEach(child => child.make('re'));


new Spuck({ type: 'div', parent: '#home-area', class: 'pinned-work-container', id: 'pinned-work-container-area' }).make();
for (let project of Projects.slice(0, 3)) {
    showProjects(project, '#pinned-work-container-area', 1, 3);
}


function showProjects(project, parent, first, last) {
    let HomeBodyId = `home-body-area-${project.id}`
    let PinnedWorksAreaId = `pinned-works-area-${project.id}`
    let PinnedWorkAreaId = `pinned-work-area-${project.id}`
    let WorkTextAreaId = `work-text-area-${project.id}`

    new Spuck({ type: 'div', parent: parent, class: 'home-body', id: HomeBodyId }).make();

    first && project.id === first && new Spuck({ type: 'span', parent: `#${HomeBodyId}`, class: 'home-body-top' }, { text: 'Pinned Work' }).make();
    new Spuck({ type: 'div', parent: `#${HomeBodyId}`, class: `pinned-works ${project.id !== last && 'border-bottom'} ${project.id !== first && 'not-first'}`, id: PinnedWorksAreaId }).make();

    new Spuck({ type: 'div', parent: `#${PinnedWorksAreaId}`, class: 'pinned-work', id: PinnedWorkAreaId }).make();

    new Spuck({ type: 'div', parent: `#${PinnedWorkAreaId}`, class: 'work-logo', id: `work-logo-${project.id}` }).make();
    new Spuck({ type: 'img', parent: `#${`work-logo-${project.id}`}`, class: 'work-img' }, {}, {}, { src: `./assets/logo${project.id}.png` }).make();

    new Spuck({ type: 'div', parent: `#${PinnedWorkAreaId}`, class: 'work-text', id: WorkTextAreaId }).make();

    new Spuck({ type: 'div', parent: `#${WorkTextAreaId}`, class: 'work-title' }, { text: project.title }).make();
    new Spuck({ typr: 'div', parent: `#${WorkTextAreaId}`, class: 'work-lang' }, { text: project.language }).make();
    new Spuck({ type: 'div', parent: `#${WorkTextAreaId}`, class: 'work-description' }, { text: project.description }).make();
    new Spuck({ type: 'div', parent: `#${WorkTextAreaId}`, class: 'work-links', id: `work-links-area-${project.id}` }).make();

    if (project.github !== 'N/A') {
        const WorkGithub = new Spuck({ type: 'div', parent: `#${`work-links-area-${project.id}`}`, class: 'work-github' }).render();
        WorkGithub.prop = { text: `<a target='_blank' href=${project.github}>Github</a>` };
        WorkGithub.make('re');
    }

    if (project.live !== 'N/A') {
        const WorkLive = new Spuck({ type: 'div', parent: `#${`work-links-area-${project.id}`}`, class: 'work-live' }).render();
        WorkLive.prop = { text: `<a target='_blank' href=${project.live}>Check It</a>` };
        WorkLive.make('re');
    }
}