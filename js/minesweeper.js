var minesweeper = (function(){

// smile busenos:   :)     ;(      :O

// kintamieji
var boardSize = {
        x: 10,
        y: 10
    },
    bombCount = 10,
    gameState = 'start',    // start / inprogress / victory / gameover
    cellState = [];

// DOM cache
var game = document.querySelector('#game'),
        header = game.querySelector('header'),
            bombCounter = header.querySelector('.bombs'),
            smile = header.querySelector('.smile'),
            clock = header.querySelector('.clock'),
        board = game.querySelector('.board');

// game init
resetGame();

// event
smile.addEventListener('click', resetGame);

board.querySelectorAll('.cell').forEach( cell => {
    cell.addEventListener('click', handleCellClick);
});

// funkcijos
function resetGame() {
    console.log('reset');
    
    bombCounter.innerText = bombCount;
    clock.innerText = '000';
    smile.innerText = ':)';
    board.innerHTML = renderEmptyCells();
    game.style.width = (30 * boardSize.x + 2)+'px';
    return;
}

function renderEmptyCells() {
    var HTML = '';
    for ( var i=0; i<(boardSize.x * boardSize.y); i++ ) {
        HTML += '<div class="cell"></div>';
    }
    return HTML;
}

function handleCellClick( event ) {
    var cellIndex = childIndex(event.path[0]);

    console.log(cellIndex);

    switch ( gameState ) {
        case 'start':
            gameFirstClick();
            break;
    
        case 'inprogress':
            gameInProgressClick();
            break;

        case 'victory':
            // spaudziant ant langeliu - nieko nevyksta
            break;

        case 'gameover':
            // spaudziant ant langeliu - nieko nevyksta
            break;

        default:
            break;
    }

    console.log( gameState );
    
    return;
}

function childIndex( elem ){
    var  i= 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

function gameFirstClick() {    // generuojame bombu sarasa, isskyrus paspaustame langelyje
    // likusiuose langeliuose suskaiciuojame aplinkiniu bombu kieki
    // atidenginejame langelius, nuo paspaustoje vietos
    // paleidziame laikrodi
    // atnaujiname zaidimo busena
    gameState = 'inprogress';
    return;
}

function gameInProgressClick(){
    // ar langelyje yra bomba
        // jei yra:
            // parodome visas likusias bombas
            // sustabdome laikrodi
            // atnaujiname zaidimo busena
            gameState = 'gameover';

        // jei nera:
            // atidengiame einamaji langeli
            // jeigu skaicius yra nulis, tai atidengiame aplinkinius
                // kartojame procesa, kol:
                    // tame langelyje nera lygu nuliui
                    // pasiektas lentos krastas
                    // jei langelis su velevele - jo neliesti
    
    // tikriname ar atidaryti visi langeliai kurie neturi bombu
        // jei taip:
            // atnaujiname zaidimo busena
            gameState = 'victory';
        // jei ne:
            // tesiam zaidima
    return;
}

// return





})();