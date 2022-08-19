
function createShip(x, y, hit, team){
    return {
        x: x,
        y: y,
        hit: hit
    };
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

    var gameInfo = {gameState: "SETUP", teamId: 1, shipList: [], shipCount: 3, tdObjects: tdObjects, opponent: ""};
    // firebaseSignIn().then(() => {
    //     startGame(gameInfo).then(() => {
    //         findOpponent(gameInfo).then(() => {
    //             console.log(gameInfo.opponent);
    //         });
    //     });
    // })
    
}

document.addEventListener("DOMContentLoaded", main);