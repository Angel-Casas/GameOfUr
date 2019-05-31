// GLOBAL VARIABLES

let parseP1 = {0:"xx", 1:"da", 2:"ca", 3:"ba", 4:"aa", 5:"ab", 6:"bb", 7:"cb", 8:"db", 9:"eb", 10:"fb", 11:"gb", 12:"hb", 13:"ha", 14:"ga", 15:"end0"};
let parseP2 = {0:"yy", 1:"dc", 2:"cc", 3:"bc", 4:"ac", 5:"ab", 6:"bb", 7:"cb", 8:"db", 9:"eb", 10:"fb", 11:"gb", 12:"hb", 13:"hc", 14:"gc", 15:"end1"};
let routeArr = [parseP1, parseP2];
let newRoll = document.querySelector("#newRoll");
let newGame = document.querySelector("#newGame");
let restart = document.querySelector("#restart");
let skipTurn = document.querySelector("#skipTurn");
let p1Token = document.querySelector("#infoDisplayp1Token");
let p2Token = document.querySelector("#infoDisplayp2Token");
let p1Points = document.querySelector("#infoDisplayp1Points");
let p2Points = document.querySelector("#infoDisplayp2Points");
var newB;
var dragged;
var listPlaces = ["xx", "yy", "aa", "ab", "ac", "ba", "bb", "bc", "ca", "cb", "cc", "da", "db", "dc", "eb", "end0", "fb", "end1", "ga", "gb", "gc", "ha", "hb", "hc"];

// INIT

window.onload = init;
function init() {
  newPlayerxx = new player("tana", 0, routeArr[0]);
  newPlayeryy = new player("suso", 1, routeArr[1]);
  newPlayerxx.populateTokens();
  newPlayeryy.populateTokens();
  newB = new board([newPlayerxx, newPlayeryy], randomZeroToOne());
  console.log(newB.populateBoard());
}

// BOARD

class board {
  constructor(participants, turn) {
    this.participants = [participants[0], participants[1]];
    this.board = {};
    this.turn = turn;
    this.roll = 0;
    this.rolled = false;
  }
  populateBoard() {
    /* Function: create playing field
       Return: populated Board array */
    let newParcel;
    for (let parcel of listPlaces) {
      if (parcel == "aa" || parcel == "ac" || parcel == "ga" || parcel == "gc") {
        newParcel = new boardElement("special");
      } else if (parcel == "db") {
        newParcel = new boardElement("specialInvulnerable");
      } else if (parcel == "end0" || parcel == "end1") {
        newParcel = new boardElement("end");
      } else {
        newParcel = new boardElement("");
      }
      this.board[parcel] = newParcel;
    }
    this.placeInitialTokens();
    return this.board;
  }
  placeInitialTokens() {
    /* Function: place Initial tokens on the board
       Return: none; */
    let p1 = this.participants[0];
    let p2 = this.participants[1];
    let _this = this;
    p1.tokens.forEach(function(element) {
      let pos = element.position;
      _this.board[pos].addToken(element);
    });
    p2.tokens.forEach(function(element) {
      let pos = element.position;
      _this.board[pos].addToken(element);
    });
    return;
  }
  newBoard(participants, turn) {
    /* Function: create new Class Board
       Return: new board */
    let newGame = new board(participants, turn);
    return newGame;
  }
  findBoard(boardId) {
    /* Function: find boardElement
       Return: boardElement */
    return this.board[boardId];
  }
  newTurn() {
    this.turn = (this.turn == 0) ? 1 : 0;
    turnDisplay(this.turn);
    return this.turn;
  }
  newRoll(roll) {
    this.roll = roll;
    this.rolled = true;
    if (this.roll == 0) {
      newB.newTurn();
      textDialog(this.roll, this.turn, false, false, true, false);
    }
    return this.roll;
  }
}

function boardElement(type) {
  /* Function: BoardElement Object with Id and content */
  this.type = type;
  this.content = [];
  this.addToken = function(token) {
    /* Function: add new token to array
       Return: Content of board Array */
    this.content.push(token);
    return this.content;
  }
  this.removeToken = function() {
    /* Function: delete token from content
       Return: deleted token */
    return this.content.pop();
  }
  this.hasToken = function() {
    /* Function: Check if boardElement non-empty
       Return: boolean, true if token in boardElement */
    if (this.content[0] !== undefined) {
      return true;
    }
    return false;
  }
  this.replaceToken = function(token, initialBoard) {
    /* Function: replace current token for new
       Return: Content of board Array */
    this.tokenToOrigin(this, initialBoard);
    return this.addToken(token);
  }
  this.tokenToOrigin = function(targetBoard, initialBoard) {
    /* Function: send Token to Origin
       Return: token at Origin */
    return initialBoard.addToken(this.removeToken());
  }
}

// PLAYER

class player {
  constructor(name, playerNum, route) {
    this.name = name;
    this.route = route[playerNum];
    this.tokens = [];
    this.playerNum = playerNum;
    this.playerSign = (this.playerNum == 0) ? "xx" : "yy";
    this.points = 0;
  }
  newPlayer(name, playerNum, route) {
    /* Function: create new Player
       Return: new Player */
    return new player(name, playerNum, route);
  }
  createToken() {
    /* Function: create new Token Object
       Return: new Token */
    return new token(this.playerNum, this.playerSign);
  }
  populateTokens() {
    /* Function: populate Player with 7 tokens
       Return: tokens collection */
    for (var i = 0; i<7; i++) {
      this.tokens.push(this.createToken());
    }
    return this.tokens;
  }
  moveToken(currentId, token, targetId) {
    /* Function: place a new Token on field
       Return: new tokenPosition or empty if failed */
    let route = routeArr[newB.turn];
    let currentNum = getKeyByValue(route, currentId);
    let predictedId = route[Number(getKeyByValue(route, currentId)) + newB.roll];
    let currentBoard = newB.findBoard(currentId);
    let targetBoard = newB.findBoard(targetId);
    if (predictedId == targetId) {
      let content = targetBoard.content;
      if (targetBoard.hasToken() && targetBoard.content[0].playerNumber !== newB.turn) {
        if (targetBoard.type == "specialInvulnerable") {
          textDialog(newB.roll, newB.turn, false, false, true, false);
          return;
        } else {
          let adversaryId = (this.playerSign == "xx") ? "yy" : "xx";
          let initialBoard = newB.findBoard(adversaryId);
          let span = document.querySelector("#" + targetId).firstChild;
          let initial = document.querySelector("#" + adversaryId);
          span.parentNode.removeChild(span);
          initial.appendChild(span);
          currentBoard.removeToken();
          targetBoard.replaceToken(token, initialBoard);
          newB.newTurn();
          textDialog(newB.roll, newB.turn, true, false, false, false);
        }
        return targetId;
      } else if (targetBoard.hasToken()) {
        textDialog(newB.roll, newB.turn, false, false, true, false);
        return;
      } else if (targetBoard.type == "end") {
        currentBoard.removeToken();
        this.addPoint();
        newB.newTurn();
        textDialog(newB.roll, newB.turn, false, true, false, false);
        return targetId;
      } else {
        if (targetBoard.type == "special" || targetBoard.type == "specialInvulnerable") {
          textDialog(newB.roll, newB.turn, false, false, false, true);
          currentBoard.removeToken();
          targetBoard.addToken(token);
        } else {
          textDialog(newB.roll, newB.turn, false, false, false, false);
          currentBoard.removeToken();
          targetBoard.addToken(token);
          newB.newTurn();
        }
        return targetId;
      }
    }
    return;
  }
  addPoint() {
    /* Function: add a point to score or show Victory
       Return: total score */
    this.points += 1;
    if (this.isFinish()) {
      displayVictory(this.name);
    }
    return this.points;
  }
  isFinish() {
    /* Function: check if victory reached
       Return: boolean */
    if (this.points == 7) {
      return true;
    }
    return false;
  }

}

function token(playerNumber, position) {
  this.playerNumber = playerNumber;
  this.position = position;
  this.update = function(newPos) {
    /* Function: update position
       Return: new Position */
    this.position = newPos;
    return this.position;
  }
}

// GLOBAL FUNCTIONS

function diceRoll(numSides, numRolls) {
  let result = new Array();
  let final = 0;
  for (var count = 0; count < numRolls; count++) {
    result[count] = Math.round(Math.random() * numSides) % numSides + 1;
  }
  for (let roll of result) {
    final += (roll > 2) ? 1 : 0;
  }
  newB.newRoll(final);
  return final;
}
function displayDiceRoll() {
  let diceID = document.querySelector("#diceRoll");
  let warning = document.querySelector("#warning");
  let result = diceRoll(4, 4);
  warning.innerHTML = "";
  diceID.innerHTML = "DiceRoll: <br>" + result;
  newB.roll = result;
  return result;
}
function randomZeroToOne() {
  let result = Math.round(Math.random());
  return result;
}
function turnDisplay(turn) {
  let p1 = document.querySelector("#xx");
  let p2 = document.querySelector("#yy");
  if (turn == 0) {
    p2.classList.remove("turn");
    p1.classList.add("turn");
  }
  else {
    p1.classList.remove("turn");
    p2.classList.add("turn");
  }
}
function joinObject(obj1, obj2) {
  let newObj = obj1;
  for (const [key, value] of Object.entries(obj2)) {
    newObj[key] += value;
  }
  return newObj;
}
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}
function resetTokens() {
  let p1 = document.querySelector("#xx");
  let p2 = document.querySelector("#yy");
  let span1 = document.createElement("span");
  let span2 = document.createElement("span");
  span1.setAttribute("draggable", "true");
  span1.setAttribute("class", "p0 token");
  span2.setAttribute("draggable", "true");
  span2.setAttribute("class", "p1 token")
  p1.innerHTML = "";
  p2.innerHTML = "";
  for (var i = 0; i < 7; i++) {
    p1.appendChild(span1.cloneNode(false));
    p2.appendChild(span2.cloneNode(false));
  }
  return;
}
function clearTokens() {
  let boardMembers = document.querySelectorAll(".boardMember");
  for (var i = 0; i < boardMembers.length; i++) {
    boardMembers[i].innerHTML = "";
  }
  return;
}
function clearDialog() {
  let dialog = document.querySelector("#dialogBox");
  dialog.innerHTML = "";
  return;
}
function textDialog(roll, turn, eat, finish, unavailable, special) {
  let p = document.createElement("p");
  let dialogBox = document.querySelector("#dialogBox");
  p.classList.add("p" + turn);
  if(eat) {
    p.innerHTML = "Player " + turn + " pwned  adversary.";
  } else if(finish) {
    p.innerHTML = "Successful point by player " + turn + "!";
  } else if(roll == 0) {
    p.innerHTML = "Player " + turn + " rolled 0!";
  } else if (unavailable) {
    p.innerHTML = "Space already Occupied!";
  } else if (special) {
    p.innerHTML = "Player " + turn + " has a new turn!";
  } else {
    p.innerHTML = "Player " + turn + " moved " + roll + " spaces.";
  }
  dialogBox.appendChild(p);
  return;
}
function resetEventList() {
  for (var elem of document.querySelectorAll(".token")) {
    elem.addEventListener("dragstart", handleDragStart, false);
    elem.addEventListener("dragend", handleDragEnd, false);
  }
  for (var parcels of document.querySelectorAll(".boardMember")) {
    parcels.addEventListener("dragenter", handleDragEnter, false);
    parcels.addEventListener("dragleave", handleDragLeave, false);
    parcels.addEventListener("dragover", handleDragOver, false);
    parcels.addEventListener("drop", handleDrop, false);
  }
}
function updateInfo() {
  p1Points.innerHTML = newPlayerxx.points;
  p1Token.innerHTML = newB.board["xx"].content.length;
  p2Points.innerHTML = newPlayeryy.points;
  p2Token.innerHTML = newB.board["yy"].content.length;
  return;
}
function displayWarning(message) {
  let warning = document.querySelector("#warning");
  warning.innerHTML = message;
  return;
}
function displayVictory(name) {
  /* Function: display Victory in #victory div
     Return: none */
  let victory = document.querySelector("#victory");
  let p = document.querySelector("#victory p");
  victory.style.display = "block";
  p.innerHTML = name + " won with " + 7 + " points!";
  return;
}
function handleDragStart(e) {
  // this / e.target is the source node.
  e.stopPropagation();
  dragged = e.target;
  this.style.width = "10px";
  this.style.height = "10px";
  e.dataTransfer.setData('text/plain', this.parentNode.id);
  e.dataTransfer.effectAllowed = "move";
  return false;
}
function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add('over');
}
function handleDragLeave(e) {
  // this / e.target is previous target element.
  this.classList.remove('over');
}
function handleDragOver(e) {
 e.preventDefault();
 // Set the dropEffect to move
 e.dataTransfer.dropEffect = "move";
 return false;
}
function handleDrop(e) {
  // this / e.target is current target element.
  let data = e.dataTransfer.getData('text/plain');
  let currentBoard = newB.board[data];
  e.preventDefault();
  this.classList.remove('over');
  if (newB.turn == 0 && newB.rolled) {
    if (newPlayerxx.moveToken(dragged.parentNode.id, currentBoard.content[0], this.id)) {
      newB.rolled = false;
      dragged.parentNode.removeChild(dragged);
      this.appendChild(dragged);
      updateInfo();
      return;
    } else {
      return;
    }
  } else if (newB.turn == 1 && newB.rolled) {
    if (newPlayeryy.moveToken(dragged.parentNode.id, currentBoard.content[0], this.id)) {
      newB.rolled = false;
      dragged.parentNode.removeChild(dragged);
      this.appendChild(dragged);
      updateInfo();
      return;
    } else {
      return;
    }
  }
  // var player = dragged.classList[0].substring(1,) - 1;
  // if (!newBoard.isOccupied(this.id) && newBoard.isTurn(player)) {
  //   if (newBoard.setToken(dragged, this.id)) {
  //     dragged.parentNode.removeChild(dragged);
  //     this.appendChild(dragged);
  //   }
  // } else {
  //
  // }
  this.classList.remove('over');
  return false;
}
function handleDragEnd(e) {
  this.style.width = "20px";
  this.style.height = "20px";
}

// EVENT LISTENERS

document.body.addEventListener("keydown", function(e) {
  e.preventDefault();
  if (e.keyCode ==  32) {
    displayDiceRoll();
  }
}, false);
newRoll.addEventListener("click", function() {
  let turn = newB.turn;
  displayDiceRoll();
  turnDisplay(turn);
}, true);
newGame.addEventListener("click", function() {
  newBoard = newB.newBoard([newPlayerxx, newPlayeryy], randomZeroToOne());
  turnDisplay(newB.turn);
  clearTokens();
  resetTokens();
  clearDialog();
  resetEventList();
}, true);
restart.addEventListener("click", function() {
  document.querySelector("#victory").style.display = "none";
  newBoard = newB.newBoard([newPlayerxx, newPlayeryy], randomZeroToOne());
  turnDisplay(newB.turn);
  clearTokens();
  resetTokens();
  clearDialog();
  resetEventList();
}, false);
skipTurn.addEventListener("click", function() {
  newB.newTurn();
  newB.rolled = false;
}, false);
