var gameInfo = {gameState: "SETUP", shipList: [], shipCount: 5};


function createShip(x, y, l, w, hit){
    return {
        x: x,
        y: y,
        length: l,
        width: w,
        hit: hit
    };
}

function enableDragElement(elmnt) {
    
    elmnt.addEventListener("mousedown", ()=>{
        elmnt.classList.add("active");
        document.addEventListener("mousemove", onDrag);
    });
    document.addEventListener("mouseup", ()=>{
        elmnt.classList.remove("active");
        document.removeEventListener("mousemove", onDrag);
    });
}

function enableRotateElement(elmnt) {
    var rotated = false;

    elmnt.onclick = function() {
        var deg = rotated ? 0 : 90;

        elmnt.style.webkitTransform = 'rotate('+deg+'deg)'; 
        elmnt.style.mozTransform    = 'rotate('+deg+'deg)'; 
        elmnt.style.msTransform     = 'rotate('+deg+'deg)'; 
        elmnt.style.oTransform      = 'rotate('+deg+'deg)'; 
        elmnt.style.transform       = 'rotate('+deg+'deg)'; 

        rotated = !rotated;
    }
}

function enableRotateAndDrag(elmnt) {
    const delta = 10;
    var rotated = false;
    let startX;
    let startY;

    function onDrag({movementX, movementY}){
        let getStyle = window.getComputedStyle(elmnt);
        let leftVal = parseInt(getStyle.left);
        let topVal = parseInt(getStyle.top);
        elmnt.style.left = `${leftVal + movementX}px`;
        elmnt.style.top = `${topVal + movementY}px`;
    }

    elmnt.addEventListener('mousedown', function (event) {
        startX = event.pageX;
        startY = event.pageY;
        document.addEventListener("mousemove", onDrag);
    });

    elmnt.addEventListener('mouseup', function (event) {
        const diffX = Math.abs(event.pageX - startX);
        const diffY = Math.abs(event.pageY - startY);
        
        // elmnt has been clicked, ensures no accidental clicks
        if (diffX < delta && diffY < delta) {
            // rotates elmnt
            var deg = rotated ? 0 : 90;

            elmnt.style.webkitTransform = 'rotate('+deg+'deg)'; 
            elmnt.style.mozTransform    = 'rotate('+deg+'deg)'; 
            elmnt.style.msTransform     = 'rotate('+deg+'deg)'; 
            elmnt.style.oTransform      = 'rotate('+deg+'deg)'; 
            elmnt.style.transform       = 'rotate('+deg+'deg)'; 

            rotated = !rotated;
        }
        document.removeEventListener("mousemove", onDrag);
    });
}

function renderShips() {
    console.log(gameInfo.shipList);
    for(let i = 0; i < gameInfo.shipCount; i++) {
        ship = gameInfo.shipList[i]

        // add div under the coords representing the ship
        div = document.createElement('div');
        div.setAttribute("id", "ship");
        length = 75 * ship.length;          // hardcoded height of grid
        div.style.height = length.toString() + 'px';

        document.getElementById(ship.x.toString() + ship.y.toString()).appendChild(div);
        shipDiv = document.getElementById(ship.x.toString() + ship.y.toString()).childNodes[0];
        // enable dragging and rotating the blocks representing the ships
        enableRotateAndDrag(shipDiv);
    }
}

// initializes board for player
function setupBoard() {
    // stores numerical id representing each table in the array
    var coords = [];
    // pushes ids into coords
    for(let i = 0; i < 10; i++){
        for(let j = 0; j < 10; j++){
            coords.push(j.toString() + i.toString());
        }
    }

    // stores dom objects for each table in array
    var tdObjects = [];

    // gets dom objects and stores them
    for(let i = 0; i < coords.length; i++) {
        tdObjects.push(document.getElementById(coords[i]));
    }

    // changes color of boxes on hover
    for(let i = 0; i < tdObjects.length; i++) {
        tdObjects[i].onmouseover = () => {
            tdObjects[i].style.color = "#699DCF";
        }
    }

    // changes color of boxes back when no longer hovering
    for(let i = 0; i < tdObjects.length; i++) {
        tdObjects[i].onmouseleave = () => {
            tdObjects[i].style.color = "black";
        }
    }

    // generate ships
    gameInfo.shipList.push(createShip(0, 0, 5, 1, false)) // carrier
    gameInfo.shipList.push(createShip(1, 0, 4, 1, false)) // battleship
    gameInfo.shipList.push(createShip(2, 0, 3, 1, false)) // cruiser / submarine
    gameInfo.shipList.push(createShip(3, 0, 3, 1, false)) // cruiser / submarine
    gameInfo.shipList.push(createShip(4, 0, 2, 1, false)) // destroyer
    renderShips();
}

// Setup phase, placing ships
async function startGame(game) {
    let setupGame = new Promise((resolve) => {
        document.getElementById("title").innerHTML = `Place ships by clicking available spaces <br> Ships left ${game.shipCount}`;
    
        // Handles clicking each square
        for(let i = 0; i < game.tdObjects.length; i++) {
    
            game.tdObjects[i].addEventListener("click", function(){
                if(game.shipCount > 0) {
                    // fill space with red X
                    let uniqueId = idGen(777);
                    game.tdObjects[i].innerHTML = `<h2 id=${uniqueId}> X </h2>`;
                    game.tdObjects[i].innerHTML = `<img id=${uniqueId} src="img/ship.png" alt="Battleship" class="ship">`;
                    document.getElementById(uniqueId).style.color = "red";
    
                    // create new ship and add to global list of ships
                    let shipCoords = game.tdObjects[i].getAttribute('id');
                    game.shipList.push(createShip(shipCoords[0], shipCoords[1], false, game.teamId));
    
                    // decrement ships allowed to be placed and update
                    game.shipCount -= 1;
                    document.getElementById("title").innerHTML = `Place ships by clicking available spaces <br> Ships left ${game.shipCount}`;
                }
                else {
                    let playerRef = firebase.database().ref(`players/${player.uid}/shipList`);
                    playerRef.set(game.shipList);
                    resolve("Done");
                }
            });
        }
    });
    await setupGame;
}


// where execution starts and ends
function main() {
    
    setupBoard();
    // tell server javascript is done loading, waiting on player
    gameInfo.gameState = "READY";

}

document.addEventListener("DOMContentLoaded", main);