var minesweeper = (function(){

// smile busenos:   :)     ;(      :O

// kintamieji
var boardSize = {
        x: 16,
        y: 10
    },
    bombCount = 15,
    gameState = 'start',    // start / inprogress / victory / gameover
    cellState = [],
    cellWidth = 16;

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

    // isvalome eventListener'ius nuo buvusio zaidimo sesijos
    board.querySelectorAll('.cell').forEach( cell => {
        cell.removeEventListener('click', handleCellClick);
    });

    board.innerHTML = renderEmptyCells();
    game.style.width = (cellWidth * boardSize.x + 2)+'px';
    gameState = 'start';

    board.querySelectorAll('.cell').forEach( cell => {
        cell.addEventListener('click', handleCellClick);
    });
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

    // atidenginejame langelius, nuo paspaustoje vietos
    openCell( clickedCellIndex );

    // paleidziame laikrodi
    // atnaujiname zaidimo busena
    gameState = 'inprogress';
    return;
}

function gameInProgressClick( cellIndex ){
    // ar langelyje yra bomba
    if ( cellState[cellIndex].bomb === true ) {
        // parodome visas likusias bombas
        showBombs( cellIndex );

        // sustabdome laikrodi

        // pakeisti smile
        smile.innerText = ';(';
        // atnaujiname zaidimo busena
        gameState = 'gameover';
    } else {
        openCell( cellIndex );
    }

    
    // tikriname ar atidaryti visi langeliai kurie neturi bombu
    if ( notOpenedCells() === 0 ) {
        // atnaujiname zaidimo busena
        gameState = 'victory';

        smile.innerText = ':D';

    } else {
        // tesiam zaidima
    }
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
            if ( (c.x - 1) >= 0 && (c.y - 1) >= 0 && cellState[ (c.x - 1) + boardSize.x * (c.y - 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // top
            if ( (c.y - 1) >= 0 && cellState[ (c.x) + boardSize.x * (c.y - 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // top right
            if ( (c.x + 1) < boardSize.x && (c.y - 1) >= 0 && cellState[ (c.x + 1) + boardSize.x * (c.y - 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // right
            if ( (c.x + 1) < boardSize.x && cellState[ (c.x + 1) + boardSize.x * (c.y) ].bomb === true ) {
                cellState[i].number++;
            }
            // bottom right
            if ( (c.x + 1) < boardSize.x && (c.y + 1) < boardSize.y && cellState[ (c.x + 1) + boardSize.x * (c.y + 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // bottom
            if ( (c.y + 1) < boardSize.y && cellState[ (c.x) + boardSize.x * (c.y + 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // bottom left
            if ( (c.x - 1) >= 0 && (c.y + 1) < boardSize.y && cellState[ (c.x - 1) + boardSize.x * (c.y + 1) ].bomb === true ) {
                cellState[i].number++;
            }
            // left
            if ( (c.x - 1) >= 0 && cellState[ (c.x - 1) + boardSize.x * (c.y) ].bomb === true ) {
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

function openCell( cellIndex ) {
    var c = cellState[cellIndex],
        coordinate = 0;

    // atidengiame einamaji langeli
    board.querySelector('#c'+cellIndex).classList += ' c-'+c.number;
    cellState[cellIndex].open = true;

    // jeigu skaicius yra nulis, tai atidengiame aplinkinius
    if ( c.number === 0 ) {
        // kartojame procesa, kol:
            // tame langelyje nera lygu nuliui
            // pasiektas lentos krastas
            // jei langelis su velevele - jo neliesti
        for ( var x=-1; x<2; x++ ) {
            for ( var y=-1; y<2; y++ ) {
                // tikriname aplinkinius langelius, ar jie egzistuoja lentoje
                if ( c.x + x >= 0 && c.x + x < boardSize.x &&
                     c.y + y >= 0 && c.y + y < boardSize.y ) {
                    coordinate = (c.x + x) + boardSize.x * (c.y + y);
                    if ( cellState[ coordinate ].open === false ) {
                        openCell( coordinate );
                    }
                }
            }
        }
    }
    return;
}

function showBombs( cellDetonated ) {
    for ( var i=0; i<boardSize.x * boardSize.y; i++ ) {
        if ( cellState[i].bomb === true ) {
            board.querySelector('#c'+i).innerHTML = '';
        }
    }

    // paryskinti bomba, del kurios ivyko sprogimas (prideti klase: detonated)
    board.querySelector('#c'+cellDetonated).className += " detonated"

    return;
}

function notOpenedCells() {
    for ( var i=0; i<boardSize.x * boardSize.y; i++ ) {
        if ( cellState[i].open === false && cellState[i].bomb === false ) {
            return 1;
        }
    }
    return 0;
}

// return
return {
    cheatMode: cheatMode,
    gameState: gameState
}




})();