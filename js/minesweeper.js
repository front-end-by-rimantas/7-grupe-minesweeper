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
    if ( bombCount <= 0 ) {
        console.error('Reikia bent vienos bombos.');
        return;
    }
    if ( boardSize.x < 1 && boardSize.y < 1 ) {
        console.error('Lenta negali tureti maziau nei po 1 langeli stulpelyje ir eiluteje.');
        return;
    }
    if ( boardSize.x * boardSize.y < 2 ) {
        console.error('Lenta negali buti mazesne nei 2 langaliu.');
        return;
    }
    if ( boardSize.x * boardSize.y <= bombCount ) {
        console.error('Bombu yra per daug, jog tilptu i lenta.');
        return;
    }

    bombCounter.innerText = bombCount;
    clock.innerText = '000';
    smile.innerText = ':)';
    board.innerHTML = renderEmptyCells();
    game.style.width = (30 * boardSize.x + 2)+'px';
    return;
}

function renderEmptyCells() {
    var HTML = '';
        cellState = [],
        cell = {};
    for ( var i=0; i<(boardSize.x * boardSize.y); i++ ) {
        HTML += '<div id="c'+i+'" class="cell"></div>';
        cell = {
            x: i % boardSize.x,
            y: (i - (i % boardSize.x)) / boardSize.x,
            bomb: false,
            flag: false,
            open: false,
            number: null
        };
        cellState.push(cell);
    }
    
    return HTML;
}

function handleCellClick( event ) {
    var cellIndex = childIndex(event.path[0]);

    switch ( gameState ) {
        case 'start':
            gameFirstClick( cellIndex );
            break;
    
        case 'inprogress':
            gameInProgressClick( cellIndex );
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
    return;
}

function childIndex( elem ){
    var  i= 0;
    while((elem=elem.previousSibling)!=null) ++i;
    return i;
}

function gameFirstClick( clickedCellIndex ) {
    console.log('gameFirstClick: ' + clickedCellIndex);
    
    // generuojame bombu sarasa, isskyrus paspaustame langelyje
    generataRandomBombs( clickedCellIndex );

    // likusiuose langeliuose suskaiciuojame aplinkiniu bombu kieki
    countSurroundingBombs();
    cheatMode();

    // atidenginejame langelius, nuo paspaustoje vietos
    // paleidziame laikrodi
    // atnaujiname zaidimo busena
    gameState = 'inprogress';
    return;
}

function gameInProgressClick( clickedCellIndex ){
    console.log('gameInProgressClick: '+ clickedCellIndex);
    
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

function generataRandomBombs( clickedCellIndex ) {
    var randomIndex = 0;
    for ( var i=0; i<bombCount; i++ ) {
        randomIndex = Math.floor(Math.random() * boardSize.x * boardSize.y);
        if ( clickedCellIndex !== randomIndex &&
             cellState[randomIndex].bomb === false ) {
            cellState[randomIndex].bomb = true;
        } else {
            i--;
        }
    }

    console.log( cellState );
    
    
    return;
}

function countSurroundingBombs() {
    var c;
    for ( var i=0; i<(boardSize.x * boardSize.y); i++ ) {
        // skaiciuojame langeliuose, kuriuose nera bombos
        c = cellState[i];
        if ( c.bomb === false ) {
            cellState[i].number = 0;
            // top left
            if ( (c.x - 1) >= 0 && (c.y - 1) >= 0 && cellState[ (c.x - 1) * (c.y - 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // top
            if ( (c.y - 1) >= 0 && cellState[ (c.x) * (c.y - 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // top right
            if ( (c.x + 1) < boardSize.x && (c.y - 1) >= 0 && cellState[ (c.x + 1) * (c.y - 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // right
            if ( (c.x + 1) < boardSize.x && cellState[ (c.x + 1) * (c.y) ].bomb === true ) {
                cellState[i].number++;
            }
            // bottom right
            if ( (c.x + 1) < boardSize.x && (c.y + 1) < boardSize.y && cellState[ (c.x + 1) * (c.y + 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // bottom
            if ( (c.y + 1) < boardSize.y && cellState[ (c.x) * (c.y + 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // bottom left
            if ( (c.x - 1) >= 0 && (c.y + 1) < boardSize.y && cellState[ (c.x - 1) * (c.y + 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // left
            if ( (c.x - 1) >= 0 && cellState[ (c.x - 1) * (c.y) ].bomb === true ) {
                cellState[i].number++;
            }
        }
    }
    return;
}



function cheatMode() {
    for ( var i=0; i<boardSize.x * boardSize.y; i++ ) {
        if ( cellState[i].bomb === true ) {
            board.querySelector('#c'+i).innerHTML = 'B';
        } else {
            if ( cellState[i].number > 0 ) {
                board.querySelector('#c'+i).innerHTML = cellState[i].number;
            }
        }
    }
    return;
}

// return
return {
    cheatMode: cheatMode
}




})();