//-------------------------------//
//----- Global Declarations -----//
//-------------------------------//

let gameResponseLocation;
let userInputLocation;





//----------------------------//
//----- Protoype Objects -----//
//----------------------------//

function Player(gameData) {
    this.startingRoom = this.setStartingRoom(gameData);
    this.wealth = 0;
    this.wealthElem = document.querySelector('.js-wealth');
    
    // set initial wealth (0)
    this.wealthElem.innerText = this.wealth;
}

Player.prototype.setStartingRoom = function(gameData) {
    
    return Math.floor(Math.random() * gameData.Maze.rooms.length) + 1;
}




function Game(gameData) {
    this.gameData = gameData;
    this.navigationButtonsContainer = document.querySelector('.input__directions');
    this.user = new Player(this.gameData);
    this.currentRoomNumber = this.user.startingRoom;
    this.currentRoom = this.gameData.Maze.rooms[this.currentRoomNumber - 1]; // minus 1 ass array index starts at 0, not 1
    
    // Add click events to buttons
    let _this = this;
    
    document.querySelector('.js-button-collect').addEventListener('click', function(){
        _this.updateRoomWealth('add');
    }, false);
    document.querySelector('.js-button-deposit').addEventListener('click', function(){
        _this.updateRoomWealth('subtract');
    }, false);
     document.querySelector('.js-button-leave').addEventListener('click', this.leaveRoom, false);
    
//    document.querySelectorAll('.js-button-action').forEach(function(button){
//        button.addEventListener('click', function(){
//            
//            let actionType = this.dataset.action;
//            
//            _this.doUserAction(actionType);
//        }, false);
//    });
    
//    console.info(this);
}

let timesCalled = 0;
Game.prototype.roomLoop = function() {
    
    timesCalled += 1;
    
    // enter room
    // check for threats
    // if threats, defeat each threat until there are 0
    // if 0 threats
    // run gold functions
    
    this.enterRoom(null);
    
}

Game.prototype.goToRoom = function(roomID, passageUserCameFrom) {
    
    let _this = this;
    
    this.currentRoomNumber = roomID;
    this.currentRoom = this.gameData.Maze.rooms.find(function(room) {
        return room.roomID === _this.currentRoomNumber;
    });
    
    let directionEnteredFrom;
    
    if (passageUserCameFrom.direction === 'east') {
        directionEnteredFrom = 'west';
    } else if ((passageUserCameFrom.direction === 'west')) {
        directionEnteredFrom = 'east';
    } else if ((passageUserCameFrom.direction === 'north')) {
        directionEnteredFrom = 'south';
    } else {
        directionEnteredFrom = 'north';
    }
    
    this.enterRoom(directionEnteredFrom);
    
}

Game.prototype.leaveRoom = function() {
    
    removeAllActiveButtonScenes();
    document.querySelector('.input__directions').classList.add('active');
    
    appendToResponseLocation(`<p>Choose a direction to go in.</p>`);
    
}

// Used to make sure that the threat message is only printed once. Has to be declared globally otherwise it would be rest every time the function is called.
let threatCount = 0;

Game.prototype.checkForThreats = function() {
    
    //--------------------------------------------------------------------------//
    //----- This function checks if the current room has any threats in it -----//
    //--------------------------------------------------------------------------//
    
    // retrieves the threat objects and places them in an array
    let thisRoomItemsThreat = this.currentRoom.items.filter(function(item){
        return item.itemType === 'threat';
    });
    
    // IF this room has threats
    if (thisRoomItemsThreat.length > 0) {
        
        threatCount += 1;
        
        if (threatCount === 1) {
        
            let pluralOrSingularThreats = thisRoomItemsThreat.length === 1 ? 'threat' : 'threats';

            appendToResponseLocation(`<p>You will need to use an action below to defeat the <span class='threat'>${pluralOrSingularThreats}</span> before you can move on.</p>`);
            appendToResponseLocation(`<p>Select an action in the bottom right Player box, and then select the <span class='threat'>threat</span> that you want to perform the action on to see if you can defeat it!</p>`);

            this.threatScene();
            
        } else {
            
            this.threatScene();
            
        }
        
    } else {
        
        threatCount = 0;
        
        // remove active class from action buttons
        removeAllActiveButtonScenes();
        document.querySelectorAll('.js-button-action').forEach(function(button){button.classList.remove('active')});
        
        this.checkForGold();
        
        // display the buttons that allow the user to interact with the room's gold as there are no threats for them to defeat
        document.querySelector('.input__gold').classList.add('active');
        
        appendToResponseLocation(`<p>As there are no <span class='threat'>threats</span> in this room, you may collect any <span class='gold'>Gold</span> in this room, deposit <span class='gold'>Gold</span> in to this room, or leave this room.</p>`);
        
    }
}



Game.prototype.checkForGold = function() {
    
    let thisRoomItemsTreasure = this.currentRoom.items.filter(function(item){
        return item.itemType === 'treasure' && item.itemValue > 0;
    });
    
    // IF room has treasure display collect button
    
    if (thisRoomItemsTreasure.length > 0) {
        
        document.querySelector('.js-button-collect').classList.add('visible');
        
    } else {
        
        document.querySelector('.js-button-collect').classList.remove('visible');
        
    }
    
    
    
    if (this.user.wealth > 0) {
        
        document.querySelector('.js-button-deposit').classList.add('visible');
        
    } else {
        
        document.querySelector('.js-button-deposit').classList.remove('visible');
        
    }
}



Game.prototype.enterRoom = function(fromDirection) {
    
    //----------------------------------------------------------------------------------//
    //----- This function displays the room explanation when first entering a room -----//
    //----------------------------------------------------------------------------------//
    
    this.navigationButtonsContainer.classList.remove('active');
    
    resetResponseLocation();
    
    let firstMessage = `<h2>You have just entered a new room`;
    
    if (fromDirection) {
        firstMessage += ` from the ${fromDirection}.</h2>`;
    } else {
        firstMessage += `.</h2>`;
    }
    
    appendToResponseLocation(firstMessage);
    
    // Need to:
        // display items in rooms with their count i.e. "...27 gold, 1 troll, and 1 skeleton...".
        // IF the number of threats is > 0 i.e. there is a threat
            // tell the user they have to use one of their actions to defeat it
            // loop through all threats until number of threats = 0
        // ELSE if no threats
            // display collect gold buttons
    
    // IF room has items
        
    // retrieves the treasure objects and places them in an array
    let thisRoomItemsTreasure = this.currentRoom.items.filter(function(item){
        return item.itemType === 'treasure';
    });
    
    // retrieves the threat objects and places them in an array
    let thisRoomItemsThreat = this.currentRoom.items.filter(function(item){
        return item.itemType === 'threat';
    });
    
    let allItemsInThisRoom = thisRoomItemsTreasure.concat(thisRoomItemsThreat);
    
    // create the initial explanation statement for this room
    let allItemsString = `<p>This room contains `;
    
    allItemsInThisRoom.forEach(function(item, i) {
        
        // wrapping items in correct colours
        if (item.itemType === 'treasure') {
            
            allItemsString += `<span class='gold'>${item.itemValue} ${item.itemName}</span>`;
                
        } else {
            
            allItemsString += `<span class='threat'>1 ${item.itemName}</span>`;
            
        }
        
        // sentence ending
        if (i === (allItemsInThisRoom.length - 1)) {
            
            // last item in array
            allItemsString += ".";
            
        } else if (i === (allItemsInThisRoom.length - 2)) {
            
            // second last item in array
            allItemsString += ", and ";
            
        } else {
            
            // all else
            allItemsString += ", ";
            
        }
        
    });
    
    allItemsString += `</p>`;
    
    // add initial explanation to the response location
    appendToResponseLocation(allItemsString);
    
    
    
    this.checkForThreats();
    this.addThreatButtonClickEvents();
    
}



Game.prototype.navigate = function(direction) {
    
    let attemptedDirection = this.currentRoom.passages.find(function(passage){
        return passage.direction === direction;
    });
    
    if (attemptedDirection !== undefined) {
        
        if (!attemptedDirection.isExit) {
            
            // go to chosen room
            this.goToRoom(attemptedDirection.roomID, attemptedDirection);
            
        } else {
            
            // exit found. game over.
            this.completeGame();
        }
        
    } else {
        
        // no passage in chosen direction
        appendToResponseLocation("<p class='error'>You cannot move in that direction. There is no passage there.</p>");
    }
}



Game.prototype.updateRoomWealth = function(action) {
    
    // type is either add or subtract wealth
    
    let newWealth = this.user.wealth;
    let thisRoomTreasure = this.currentRoom.items.find(function(item){
        return item.itemType === 'treasure';
    });
    
    
    // actions:
        // collect gold from room
            // IF room has gold and action is 'add' {
                // thisRoomTreasure.itemValue = 0
                // this.user.wealth += thisRoomTreasure.itemValue
            // } ELSE IF room doesnt not have gold and action is 'add' {
                // error message "no gold to collect"
            // }
        // deposit gold to room
            // IF user has gold and action is 'subtract' {
                // thisRoomTreasure.itemValue += 1
                // this.user.wealth -= 1
            // } ELSE IF user has no gold and action is 'subtract' {
                // error message "you have no gold to deposit
            // }
    
    // if room has gold in it and user is collecting this gold
    if (thisRoomTreasure.itemValue !== 0 && action === 'add') {
        
        this.user.wealth += thisRoomTreasure.itemValue;
        this.user.wealthElem.innerText = this.user.wealth;
        
        appendToResponseLocation(`<p><span class='gold'>${thisRoomTreasure.itemValue} Gold</span> collected. You now have <span class='gold'>${this.user.wealth} Gold</span>.</p>`);
        
        thisRoomTreasure.itemValue -= thisRoomTreasure.itemValue;
        
        appendToResponseLocation(`<p>There is now <span class='gold'>${thisRoomTreasure.itemValue} Gold</span> in this room.</p>`);
        
    } else if (thisRoomTreasure.itemValue === 0 && action === 'add') {
        
        appendToResponseLocation("<p class='error'>There is no gold to collect in this room</p>");
        
    }
    
    // if room does not have gold in it and user is depositing gold
    if (this.user.wealth > 0 && action === 'subtract') {
              
        this.user.wealth -= 1;
        this.user.wealthElem.innerText = this.user.wealth;
        
        appendToResponseLocation(`<p>You have deposited <span class='gold'>1 Gold</span> in this room. You now have <span class='gold'>${this.user.wealth} Gold</span>.</p>`);
        
        thisRoomTreasure.itemValue += 1;
        
        appendToResponseLocation(`<p>There is now <span class='gold'>${thisRoomTreasure.itemValue} Gold</span> in this room.</p>`);
    
    // if room does not have gold in it and user is trying to collect gold
    } else if (this.user.wealth === 0 && action === 'subtract') {
        
        appendToResponseLocation("<p class='error'>You have no more gold to deposit</p>");
        
    }
    
    this.checkForGold();
}


Game.prototype.addThreatButtonClickEvents = function() {
    
    // separate function so that each button only has one click event listener added to it.
    // Otherwise doing it inside the threatScene() function meant that clicking a button fired more than one event if there was more than one threat in the room
    
    // reset event listeners by cloning and replacing buttons each time function is called
    let current_button = document.querySelector('.input__threats');
    let new_button = current_button.cloneNode(true);
    current_button.parentNode.replaceChild(new_button, current_button);
    
    let _this = this;
    
    let threatButtons = document.querySelectorAll('.js-button-threat.visible');
    
    threatButtons.forEach(function(button) {
        
        button.addEventListener('click', function(){
            
            // IF .js-button-action with matching data attribute has class 'active':
            // run doActionOnThreat function with parameter 'success' set to true
            // ELSE run with parameter false
            
            if (document.querySelector(`.js-button-action[data-threat='${button.dataset.threat}']`).classList.contains('active')) {
                _this.doActionOnThreat('success', button.dataset.threat);
            } else {
                _this.doActionOnThreat('fail', button.dataset.threat);
            }
            
        }, false);
        
    });
    
}


Game.prototype.threatScene = function() {
    
    let _this = this;
    
    let currentThreats = this.currentRoom.items.filter(function(item){
        return item.itemType === 'threat';
    });
    
    // makes the buttons for each of the current threats visible
    currentThreats.forEach(function(threat){
        
        document.querySelector(`.js-button-threat[data-threat='${threat.itemName.toLowerCase()}']`).classList.add('visible');
        
    });
    
    
    document.querySelector('.input__threats').classList.add('active');
    
    let actionButtons = document.querySelectorAll('.js-button-action');
    let threatButtons = document.querySelectorAll('.js-button-threat.visible');
    
    actionButtons.forEach(function(button){
        
        button.addEventListener('click', function(){
            
            actionButtons.forEach(function(button){button.classList.remove('active')});
            button.classList.add('active');
            
        }, false);
        
    });
}



Game.prototype.doActionOnThreat = function(status, nameOfThreatClicked) {
    
    let nameOfThreatClickedUppercase = nameOfThreatClicked.charAt(0).toUpperCase() + nameOfThreatClicked.slice(1);;
    
    if (status === 'success') {
        
        appendToResponseLocation(`<p class='success'>You have defeated the ${nameOfThreatClickedUppercase}!</p>`);
        
        document.querySelector(`.js-button-threat[data-threat='${nameOfThreatClicked}']`).classList.remove('visible');
        
        // remove threats from room object
        
        let positonInCurrentRoomItemsArray = this.currentRoom.items.map(function(item) { return item.itemName }).indexOf(`${nameOfThreatClickedUppercase}`);
        
        this.currentRoom.items.splice(positonInCurrentRoomItemsArray, 1);
        
        this.checkForThreats();
        
    } else {
        
        appendToResponseLocation(`<p class='error'>That is not the right action needed to defeat the ${nameOfThreatClickedUppercase}...</p>`);
        
    }
}



Game.prototype.completeGame = function() {
    
    resetResponseLocation();
    removeAllActiveButtonScenes();

    this.navigationButtonsContainer.classList.remove('active');
    document.querySelector('.input__reset').classList.add('active');
    
    appendToResponseLocation("<h2 class='success'>Congratulations! You found the exit and beat the game.</h2>");
    appendToResponseLocation("<p>You finished with a wealth of: <span class='gold'>" + this.user.wealth + " Gold</span>!</p>");
}










//----------------------//
//----- Game Setup -----//
//----------------------//

// steps should be as follows:
// 1. welcome message with prompt to upload a maze configuration.
    // ability to use exisiting maze configuration if one is available.
// 2. if maze config is valid, display game instructions/info and "start new game" button
    // this places player in random room and starts game


function init() {
    
    //------------------------------------------------------------------------------------------------//
    //----- This function displays the welcome message and asks for a maze config to be uploaded -----//
    //------------------------------------------------------------------------------------------------//
    
    gameResponseLocation = document.querySelector('.js-game-response');
    userInputLocation = document.querySelector('.js-game-input');
    
    appendToResponseLocation("<h2>Welcome to the Maze Game!</h2>");
    appendToResponseLocation("<p>Please decide whether you want to upload your own new Maze Configuration or use the default Maze Configuration.</p>");
    
    document.querySelector('.js-button-reset').addEventListener('click', resetGame, false);
    document.querySelector('.js-button-quit').addEventListener('click', quitGame, false);
    document.querySelector('.input__upload').classList.add('active');
    
    
    
    document.querySelector('.js-uploaded-file').addEventListener('change', function() {
        
        let formElement = document.querySelector('.js-upload-form');
        let file = this.files[0];
        let formData = new FormData(formElement);
        
        formData.append('file', file);
        
        let xhr = new XMLHttpRequest();
        xhr.open('POST', 'upload.php', true);

        xhr.upload.onprogress = function(e) {
            
            if (e.lengthComputable) {

                let percentComplete = (e.loaded / e.total) * 100;
                appendToResponseLocation(`<p>${percentComplete}% uploaded</p>`);

            }
        };
        
        xhr.onload = function() {
            
            if (this.status == 200) {
                
//                console.info(this.response);
                
                readGameData(`/maze-game/uploads/${this.response}`);
                
            }
        };
        
        xhr.send(formData);
        
    }, false);
    
    
    
    document.querySelector('.js-use-existing').addEventListener("click",function() {
        
        readGameData('maze-config-default.json');
        
    }, false);
    
}



function resetGame() {
    
    resetResponseLocation();
    removeAllActiveButtonScenes();

    let current_game = document.querySelector('.game__interface');
    let new_game = current_game.cloneNode(true);
    current_game.parentNode.replaceChild(new_game, current_game);
    
    init();
}


function quitGame() {
    
    resetResponseLocation();
    removeAllActiveButtonScenes();
    appendToResponseLocation("<h2>Thanks for Playing!</h2>");
    
}


function readGameData(path) {
    
    removeAllActiveButtonScenes();
    
    appendToResponseLocation("<p>Initialising the Maze's structure...</p>");
    
    $.getJSON( path )
    
        .done(function( json ) {
        
            // file found and JSON is valid
        
            appendToResponseLocation("<p class='success'>Maze structure successfully loaded</p>");
        
            // set timeout to display game instructions
        
            let initTimeout = setTimeout(function(){
                initGame(json);
            }, 1500);
        })
    
        .fail(function( jqxhr, textStatus, error ) {
            
            // file not found or JSON is invalid
        
            var err = textStatus + ", " + error;
            console.error( "Request Failed: " + err );
        
            appendToResponseLocation("<p class='error'>Request failed: " + err + "</p>");
        
            document.querySelector('.input__upload').classList.add('active');
        
        });
}



// Useful for adding new text to the response location
function appendToResponseLocation(str) {
    
    let div = document.createElement('div');
    div.innerHTML = str;
    
    while (div.children.length > 0) {
        gameResponseLocation.appendChild(div.children[0]);
    }
    
    // makes sure the response container scrolls to the bottom when an element is added so that it is always visible
    let elemToScroll = document.querySelector('.game__response');
    elemToScroll.scrollTop = elemToScroll.scrollHeight;
    
}



// Clear all text inside the game's response location (e.g. when entering a new room)
function resetResponseLocation() {
    
    gameResponseLocation.innerHTML = null;
    
}



function removeAllActiveButtonScenes() {
    
    let scenes = document.querySelectorAll('.input__scene');
    
    scenes.forEach(function(scene) {
        
        if (scene.classList.contains('active')) {
            
            scene.classList.remove('active');
            
        } 
    });  
}



// Add the Game object's navigation function to the 4 directional buttons click event
function addNavigationEvents(game) {
    
    document.querySelectorAll('.js-button-navigate').forEach(function(button){
        
        button.addEventListener('click', function() {
            
            game.navigate(this.dataset.direction);
            
        }, false);
    });
}



function gameIntro() {
    appendToResponseLocation("<h2>Welcome to the Maze Game!</h2>");
    appendToResponseLocation("<p>Use the controls that appear in the box below to navigate through the Maze.</p>");
    appendToResponseLocation("<p>Your goal is to find the Maze's exit, and leave the Maze with as much <span class='gold'>Gold</span> as possible. But be careful, there are also <span class='threat'>threats</span> hidden throughout!</p>");
    appendToResponseLocation("<p><span class='info'>Hint:</span> Depositing <span class='gold'>Gold</span> in to a room may help you keep track of where you've already been!</p>");
    appendToResponseLocation("<p class='no-arrow'>...</p>");
    appendToResponseLocation("<p>Good luck!</p>");
}



function startGame(game) {
    removeAllActiveButtonScenes();
    
    resetResponseLocation();
    
    game.roomLoop();
}



let newGame;
function initGame(gameData) {
    
//    console.info(gameData);
    
    removeAllActiveButtonScenes();
    
    document.querySelector('.input__start').classList.add('active');
    
    resetResponseLocation();
    gameIntro();
    
    newGame = new Game(gameData);
    
    addNavigationEvents(newGame);
    
    document.querySelector('.js-start-game').addEventListener('click', function(){
        startGame(newGame);
    }, false);
}

window.addEventListener('load', init, false);