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
let newB;
let dragged;
let listPlaces = ["xx", "yy", "aa", "ab", "ac", "ba", "bb", "bc", "ca", "cb", "cc", "da", "db", "dc", "eb", "end0", "fb", "end1", "ga", "gb", "gc", "ha", "hb", "hc"];


// INTRODUCTION HANDLER
function introductionHandle(bool) {
  // Display or hide Introduction and add EventListener
  let intro = document.querySelector("#introduction");

  if (bool) {

    intro.style.display = "block";
    document.querySelector(".nextSlide").addEventListener("click", changeSlide, false);
  } else {
    intro.innerHTML = "";
    intro.style.display = "none";
  }

  return;
}

function changeSlide() {
  // Changes slides in #introduction
  let slides = document.querySelectorAll(".slide");

  for (var el of slides) {
    if (el.style.display == "block") {
      let index = Number(el.getAttribute("data-slide")) + 1;

      el.style.display = "none";
      if (slides[index]) {
        slides[index].style.display = "block";
      } else {
        slides[0].style.display = "block";
        document.querySelector("#introduction").style.display = "none";
        document.querySelector("#winner").style.display = "none";
        document.querySelector("#confetti").style.display = "none";
      }

      return;
    }
  }

  return;
}

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
    // Function: create playing field
    // Return: populated Board array

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
    // Function: place Initial tokens on the board
    //   Return: none

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
    // Function: create new Class Board
    //   Return: new board

    let newGame = new board(participants, turn);

    return newGame;
  }
  findBoard(boardId) {
    // Function: find boardElement
    //   Return: boardElement

    return this.board[boardId];
  }

  newTurn() {
    // Function: Change Turn
    // Return: turn

    this.turn = (this.turn == 0) ? 1 : 0;
    turnDisplay(this.turn);

    return this.turn;
  }

  newRoll(roll) {
    // Function: Perform a new dice roll
    // Return: roll

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
  // Function: BoardElement Object with Id and content

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
    // Function: create new Player
    //   Return: new Player

    return new player(name, playerNum, route);
  }

  createToken() {
    // Function: create new Token Object
    //   Return: new Token

    return new token(this.playerNum, this.playerSign);
  }

  populateTokens() {
    // Function: populate Player with 7 tokens
    //   Return: tokens collection

    for (var i = 0; i<7; i++) {
      this.tokens.push(this.createToken());
    }

    return this.tokens;
  }

  moveToken(currentId, token, targetId) {
    // Function: place a new Token on field
    //   Return: new tokenPosition or empty if failed

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
    // Function: add a point to score or show Victory
    //   Return: total score

    this.points += 1;
    if (this.isFinish()) {
      displayVictory(this.name);
    }

    return this.points;
  }

  isFinish() {
    // Function: check if victory reached
    //   Return: boolean

    if (this.points == 7) {

      return true;
    }

    return false;
  }
}

function token(playerNumber, position) {
  // Function: Token Object containing PlayerNumber and position

  this.playerNumber = playerNumber;
  this.position = position;
  this.update = function(newPos) {
    // Function: update position
    //   Return: new Position

    this.position = newPos;

    return this.position;
  }
}

// GLOBAL FUNCTIONS

function diceRoll(numSides, numRolls) {
  // Function: Perform a new Dice Roll
  // Return: roll

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
  // Function: Display the dice roll
  // return dice roll

  let diceID = document.querySelector("#diceRoll");
  let warning = document.querySelector("#warning");
  let result = diceRoll(4, 4);

  warning.innerHTML = "";
  diceID.innerHTML = "Tirada de dados: <br>" + result;
  newB.roll = result;

  return result;
}

function randomZeroToOne() {
  // Function produce random number (0, 1)
  // Return: random Number

  let result = Math.round(Math.random());

  return result;
}

function turnDisplay(turn) {
  // Function: Display turn for current player

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

  return;
}

function joinObject(obj1, obj2) {
  // Function: Join two Objects by looping entries of object 2 into object 1
  // Return: New Object

  let newObj = obj1;

  for (const [key, value] of Object.entries(obj2)) {
    newObj[key] += value;
  }

  return newObj;
}

function getKeyByValue(object, value) {
  // Function: Get key by value
  // Return: key

  return Object.keys(object).find(key => object[key] === value);
}

function resetTokens() {
  // Function: Reset each players tokens

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
  // Function: Clear Tokens from board

  let boardMembers = document.querySelectorAll(".boardMember");

  for (var i = 0; i < boardMembers.length; i++) {
    boardMembers[i].innerHTML = "";
  }

  return;
}

function clearDialog() {
  // Function: clear Dialog Screen

  let dialog = document.querySelector("#dialogBox");

  dialog.innerHTML = "";

  return;
}

function textDialog(roll, turn, eat, finish, unavailable, special) {
  // Function: Display Text dialog

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
  // Function: reset EventListeners

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

  return;
}

function updateInfo() {
  // Function: Update points Info

  p1Points.innerHTML = newPlayerxx.points;
  p1Token.innerHTML = newB.board["xx"].content.length;
  p2Points.innerHTML = newPlayeryy.points;
  p2Token.innerHTML = newB.board["yy"].content.length;

  return;
}

function displayWarning(message) {
  // Function: Display warning message

  let warning = document.querySelector("#warning");

  warning.innerHTML = message;

  return;
}

function displayVictory(name) {
  // Function: display Victory in #victory div
  //   Return: none

  let victory = document.querySelector("#victory");
  let p = document.querySelector("#victory p");

  victory.style.display = "block";
  document.querySelector("#confetti").style.display = "block";
  p.innerHTML = name + " won with " + 7 + " points!";

  return;
}

function handleDragStart(e) {
  // this / e.target is the source node.
  e.stopPropagation();
  dragged = e.target;
  this.style.width = "10px";
  this.style.height = "10px";
  e.dataTransfer.setData("text/plain", this.parentNode.id);
  e.dataTransfer.effectAllowed = "move";
  return false;
}

function handleDragEnter(e) {
  // this / e.target is the current hover target.
  this.classList.add("over");
}

function handleDragLeave(e) {
  // this / e.target is previous target element.
  this.classList.remove("over");
}

function handleDragOver(e) {
 e.preventDefault();
 // Set the dropEffect to move
 e.dataTransfer.dropEffect = "move";
 return false;
}

function handleDrop(e) {
  // this / e.target is current target element.
  let data = e.dataTransfer.getData("text/plain");
  let currentBoard = newB.board[data];
  e.preventDefault();
  this.classList.remove("over");
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
  this.classList.remove("over");
  return false;
}

function handleDragEnd(e) {
  this.style.width = "20px";
  this.style.height = "20px";
}

// EVENT LISTENERS

document.getElementById('btnIntro').addEventListener("click", introductionHandle, false);

document.getElementById('newRoll').addEventListener('click', function() {
  document.getElementById("diceRoll").style.webkitAnimationPlayState = "running";
    setTimeout(function() {
        document.getElementById("diceRoll").style.webkitAnimationPlayState = "paused";
    }, 200);
});

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
  document.querySelector("#confetti").style.display = "none";
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

skipTurn.addEventListener("click", function(e) {
  e.preventDefault();
  newB.newTurn();
  newB.rolled = false;
}, false);

// CONFETTI - EXTRA

var retina = window.devicePixelRatio,

  // Math shorthands
  PI = Math.PI,
  sqrt = Math.sqrt,
  round = Math.round,
  random = Math.random,
  cos = Math.cos,
  sin = Math.sin,

  // Local WindowAnimationTiming interface
  rAF = window.requestAnimationFrame,
  cAF = window.cancelAnimationFrame || window.cancelRequestAnimationFrame;

document.addEventListener("DOMContentLoaded", function() {
  var speed = 50,
    duration = (1.0 / speed),
    confettiRibbonCount = 11,
    ribbonPaperCount = 30,
    ribbonPaperDist = 8.0,
    ribbonPaperThick = 8.0,
    confettiPaperCount = 95,
    DEG_TO_RAD = PI / 180,
    RAD_TO_DEG = 180 / PI,
    colors = [
      ["#df0049", "#660671"],
      ["#00e857", "#005291"],
      ["#2bebbc", "#05798a"],
      ["#ffd200", "#b06c00"]
    ];

  function Vector2(_x, _y) {
    this.x = _x, this.y = _y;
    this.Length = function() {
      return sqrt(this.SqrLength());
    }
    this.SqrLength = function() {
      return this.x * this.x + this.y * this.y;
    }
    this.Add = function(_vec) {
      this.x += _vec.x;
      this.y += _vec.y;
    }
    this.Sub = function(_vec) {
      this.x -= _vec.x;
      this.y -= _vec.y;
    }
    this.Div = function(_f) {
      this.x /= _f;
      this.y /= _f;
    }
    this.Mul = function(_f) {
      this.x *= _f;
      this.y *= _f;
    }
    this.Normalize = function() {
      var sqrLen = this.SqrLength();
      if (sqrLen != 0) {
        var factor = 1.0 / sqrt(sqrLen);
        this.x *= factor;
        this.y *= factor;
      }
    }
    this.Normalized = function() {
      var sqrLen = this.SqrLength();
      if (sqrLen != 0) {
        var factor = 1.0 / sqrt(sqrLen);
        return new Vector2(this.x * factor, this.y * factor);
      }
      return new Vector2(0, 0);
    }
  }
  Vector2.Lerp = function(_vec0, _vec1, _t) {
    return new Vector2((_vec1.x - _vec0.x) * _t + _vec0.x, (_vec1.y - _vec0.y) * _t + _vec0.y);
  }
  Vector2.Distance = function(_vec0, _vec1) {
    return sqrt(Vector2.SqrDistance(_vec0, _vec1));
  }
  Vector2.SqrDistance = function(_vec0, _vec1) {
    var x = _vec0.x - _vec1.x;
    var y = _vec0.y - _vec1.y;
    return (x * x + y * y + z * z);
  }
  Vector2.Scale = function(_vec0, _vec1) {
    return new Vector2(_vec0.x * _vec1.x, _vec0.y * _vec1.y);
  }
  Vector2.Min = function(_vec0, _vec1) {
    return new Vector2(Math.min(_vec0.x, _vec1.x), Math.min(_vec0.y, _vec1.y));
  }
  Vector2.Max = function(_vec0, _vec1) {
    return new Vector2(Math.max(_vec0.x, _vec1.x), Math.max(_vec0.y, _vec1.y));
  }
  Vector2.ClampMagnitude = function(_vec0, _len) {
    var vecNorm = _vec0.Normalized;
    return new Vector2(vecNorm.x * _len, vecNorm.y * _len);
  }
  Vector2.Sub = function(_vec0, _vec1) {
    return new Vector2(_vec0.x - _vec1.x, _vec0.y - _vec1.y, _vec0.z - _vec1.z);
  }

  function EulerMass(_x, _y, _mass, _drag) {
    this.position = new Vector2(_x, _y);
    this.mass = _mass;
    this.drag = _drag;
    this.force = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.AddForce = function(_f) {
      this.force.Add(_f);
    }
    this.Integrate = function(_dt) {
      var acc = this.CurrentForce(this.position);
      acc.Div(this.mass);
      var posDelta = new Vector2(this.velocity.x, this.velocity.y);
      posDelta.Mul(_dt);
      this.position.Add(posDelta);
      acc.Mul(_dt);
      this.velocity.Add(acc);
      this.force = new Vector2(0, 0);
    }
    this.CurrentForce = function(_pos, _vel) {
      var totalForce = new Vector2(this.force.x, this.force.y);
      var speed = this.velocity.Length();
      var dragVel = new Vector2(this.velocity.x, this.velocity.y);
      dragVel.Mul(this.drag * this.mass * speed);
      totalForce.Sub(dragVel);
      return totalForce;
    }
  }

  function ConfettiPaper(_x, _y) {
    this.pos = new Vector2(_x, _y);
    this.rotationSpeed = (random() * 600 + 800);
    this.angle = DEG_TO_RAD * random() * 360;
    this.rotation = DEG_TO_RAD * random() * 360;
    this.cosA = 1.0;
    this.size = 5.0;
    this.oscillationSpeed = (random() * 1.5 + 0.5);
    this.xSpeed = 40.0;
    this.ySpeed = (random() * 60 + 50.0);
    this.corners = new Array();
    this.time = random();
    var ci = round(random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    for (var i = 0; i < 4; i++) {
      var dx = cos(this.angle + DEG_TO_RAD * (i * 90 + 45));
      var dy = sin(this.angle + DEG_TO_RAD * (i * 90 + 45));
      this.corners[i] = new Vector2(dx, dy);
    }
    this.Update = function(_dt) {
      this.time += _dt;
      this.rotation += this.rotationSpeed * _dt;
      this.cosA = cos(DEG_TO_RAD * this.rotation);
      this.pos.x += cos(this.time * this.oscillationSpeed) * this.xSpeed * _dt
      this.pos.y += this.ySpeed * _dt;
      if (this.pos.y > ConfettiPaper.bounds.y) {
        this.pos.x = random() * ConfettiPaper.bounds.x;
        this.pos.y = 0;
      }
    }
    this.Draw = function(_g) {
      if (this.cosA > 0) {
        _g.fillStyle = this.frontColor;
      } else {
        _g.fillStyle = this.backColor;
      }
      _g.beginPath();
      _g.moveTo((this.pos.x + this.corners[0].x * this.size) * retina, (this.pos.y + this.corners[0].y * this.size * this.cosA) * retina);
      for (var i = 1; i < 4; i++) {
        _g.lineTo((this.pos.x + this.corners[i].x * this.size) * retina, (this.pos.y + this.corners[i].y * this.size * this.cosA) * retina);
      }
      _g.closePath();
      _g.fill();
    }
  }
  ConfettiPaper.bounds = new Vector2(0, 0);

  function ConfettiRibbon(_x, _y, _count, _dist, _thickness, _angle, _mass, _drag) {
    this.particleDist = _dist;
    this.particleCount = _count;
    this.particleMass = _mass;
    this.particleDrag = _drag;
    this.particles = new Array();
    var ci = round(random() * (colors.length - 1));
    this.frontColor = colors[ci][0];
    this.backColor = colors[ci][1];
    this.xOff = (cos(DEG_TO_RAD * _angle) * _thickness);
    this.yOff = (sin(DEG_TO_RAD * _angle) * _thickness);
    this.position = new Vector2(_x, _y);
    this.prevPosition = new Vector2(_x, _y);
    this.velocityInherit = (random() * 2 + 4);
    this.time = random() * 100;
    this.oscillationSpeed = (random() * 2 + 2);
    this.oscillationDistance = (random() * 40 + 40);
    this.ySpeed = (random() * 40 + 80);
    for (var i = 0; i < this.particleCount; i++) {
      this.particles[i] = new EulerMass(_x, _y - i * this.particleDist, this.particleMass, this.particleDrag);
    }
    this.Update = function(_dt) {
      var i = 0;
      this.time += _dt * this.oscillationSpeed;
      this.position.y += this.ySpeed * _dt;
      this.position.x += cos(this.time) * this.oscillationDistance * _dt;
      this.particles[0].position = this.position;
      var dX = this.prevPosition.x - this.position.x;
      var dY = this.prevPosition.y - this.position.y;
      var delta = sqrt(dX * dX + dY * dY);
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      for (i = 1; i < this.particleCount; i++) {
        var dirP = Vector2.Sub(this.particles[i - 1].position, this.particles[i].position);
        dirP.Normalize();
        dirP.Mul((delta / _dt) * this.velocityInherit);
        this.particles[i].AddForce(dirP);
      }
      for (i = 1; i < this.particleCount; i++) {
        this.particles[i].Integrate(_dt);
      }
      for (i = 1; i < this.particleCount; i++) {
        var rp2 = new Vector2(this.particles[i].position.x, this.particles[i].position.y);
        rp2.Sub(this.particles[i - 1].position);
        rp2.Normalize();
        rp2.Mul(this.particleDist);
        rp2.Add(this.particles[i - 1].position);
        this.particles[i].position = rp2;
      }
      if (this.position.y > ConfettiRibbon.bounds.y + this.particleDist * this.particleCount) {
        this.Reset();
      }
    }
    this.Reset = function() {
      this.position.y = -random() * ConfettiRibbon.bounds.y;
      this.position.x = random() * ConfettiRibbon.bounds.x;
      this.prevPosition = new Vector2(this.position.x, this.position.y);
      this.velocityInherit = random() * 2 + 4;
      this.time = random() * 100;
      this.oscillationSpeed = random() * 2.0 + 1.5;
      this.oscillationDistance = (random() * 40 + 40);
      this.ySpeed = random() * 40 + 80;
      var ci = round(random() * (colors.length - 1));
      this.frontColor = colors[ci][0];
      this.backColor = colors[ci][1];
      this.particles = new Array();
      for (var i = 0; i < this.particleCount; i++) {
        this.particles[i] = new EulerMass(this.position.x, this.position.y - i * this.particleDist, this.particleMass, this.particleDrag);
      }
    }
    this.Draw = function(_g) {
      for (var i = 0; i < this.particleCount - 1; i++) {
        var p0 = new Vector2(this.particles[i].position.x + this.xOff, this.particles[i].position.y + this.yOff);
        var p1 = new Vector2(this.particles[i + 1].position.x + this.xOff, this.particles[i + 1].position.y + this.yOff);
        if (this.Side(this.particles[i].position.x, this.particles[i].position.y, this.particles[i + 1].position.x, this.particles[i + 1].position.y, p1.x, p1.y) < 0) {
          _g.fillStyle = this.frontColor;
          _g.strokeStyle = this.frontColor;
        } else {
          _g.fillStyle = this.backColor;
          _g.strokeStyle = this.backColor;
        }
        if (i == 0) {
          _g.beginPath();
          _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
          _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
          _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
          _g.beginPath();
          _g.moveTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.lineTo(((this.particles[i + 1].position.x + p1.x) * 0.5) * retina, ((this.particles[i + 1].position.y + p1.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        } else if (i == this.particleCount - 2) {
          _g.beginPath();
          _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
          _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
          _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
          _g.beginPath();
          _g.moveTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.lineTo(((this.particles[i].position.x + p0.x) * 0.5) * retina, ((this.particles[i].position.y + p0.y) * 0.5) * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        } else {
          _g.beginPath();
          _g.moveTo(this.particles[i].position.x * retina, this.particles[i].position.y * retina);
          _g.lineTo(this.particles[i + 1].position.x * retina, this.particles[i + 1].position.y * retina);
          _g.lineTo(p1.x * retina, p1.y * retina);
          _g.lineTo(p0.x * retina, p0.y * retina);
          _g.closePath();
          _g.stroke();
          _g.fill();
        }
      }
    }
    this.Side = function(x1, y1, x2, y2, x3, y3) {
      return ((x1 - x2) * (y3 - y2) - (y1 - y2) * (x3 - x2));
    }
  }
  ConfettiRibbon.bounds = new Vector2(0, 0);
  confetti = {};
  confetti.Context = function(id) {
    var i = 0;
    var canvas = document.getElementById(id);
    var canvasParent = canvas.parentNode;
    var canvasWidth = canvasParent.offsetWidth;
    var canvasHeight = canvasParent.offsetHeight;
    canvas.width = canvasWidth * retina;
    canvas.height = canvasHeight * retina;
    var context = canvas.getContext('2d');
    var interval = null;
    var confettiRibbons = new Array();
    ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
    for (i = 0; i < confettiRibbonCount; i++) {
      confettiRibbons[i] = new ConfettiRibbon(random() * canvasWidth, -random() * canvasHeight * 2, ribbonPaperCount, ribbonPaperDist, ribbonPaperThick, 45, 1, 0.05);
    }
    var confettiPapers = new Array();
    ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
    for (i = 0; i < confettiPaperCount; i++) {
      confettiPapers[i] = new ConfettiPaper(random() * canvasWidth, random() * canvasHeight);
    }
    this.resize = function() {
      canvasWidth = canvasParent.offsetWidth;
      canvasHeight = canvasParent.offsetHeight;
      canvas.width = canvasWidth * retina;
      canvas.height = canvasHeight * retina;
      ConfettiPaper.bounds = new Vector2(canvasWidth, canvasHeight);
      ConfettiRibbon.bounds = new Vector2(canvasWidth, canvasHeight);
    }
    this.start = function() {
      this.stop()
      var context = this;
      this.update();
    }
    this.stop = function() {
      cAF(this.interval);
    }
    this.update = function() {
      var i = 0;
      context.clearRect(0, 0, canvas.width, canvas.height);
      for (i = 0; i < confettiPaperCount; i++) {
        confettiPapers[i].Update(duration);
        confettiPapers[i].Draw(context);
      }
      for (i = 0; i < confettiRibbonCount; i++) {
        confettiRibbons[i].Update(duration);
        confettiRibbons[i].Draw(context);
      }
      this.interval = rAF(function() {
        confetti.update();
      });
    }
  }
  var confetti = new confetti.Context('confetti');
  confetti.start();
  window.addEventListener('resize', function(event){
    confetti.resize();
  });
});
