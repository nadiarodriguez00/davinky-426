
// idea from https://github.com/efyang/portal-0.5/blob/main/src/app.js
// https://github.com/efyang/portal-0.5/blob/main/src/instructions.html

// initialize menu/start screen
export function init_page(document, menuCanvas) {
    document.body.innerHTML = '';
    document.body.appendChild(menuCanvas);
    let menu = document.createElement('div');
    menu.id = 'menu';
    let start = document.createElement('div');
    start.id = "start"
    menu.innerHTML = start;
    document.body.appendChild(menu)

    let footer = document.createElement('div');
    footer.id = 'footer';
    document.body.appendChild(footer)
}

// render game screen
export function start(document, canvas) {
    document.body.appendChild(canvas);

    let scoreCounter = document.createElement('div');
    scoreCounter.id = 'score';

    let fillScreen = document.createElement('div');
    fillScreen.id = 'fillScreen';
    fillScreen.style.pointerEvents = "none";
    document.body.appendChild(fillScreen);
}

export function init_fonts(document) {
    let titleFont = document.createElement('link');
    titleFont.id = 'titleFont'
    titleFont.rel = "stylesheet";
    titleFont.href = "https://fonts.googleapis.com/css?family=Audiowide";
    document.head.appendChild(titleFont)

    let font = document.createElement('link');
    font.id = 'font'
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css?family=Radio+Canada";
    document.head.appendChild(font)
}
