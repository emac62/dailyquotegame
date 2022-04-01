import { QUOTES } from "./quotes.js";
import { authors } from "./authors.js";

// localStorage.clear()

let currentGuess = [];
let spaces = [];
let nextLetter = 0;
var finishedGames = JSON.parse(localStorage.getItem("finishedGames"))
if (finishedGames === null) finishedGames = []
var averageLetters = JSON.parse(localStorage.getItem("averageLetters"))
if (averageLetters === null) averageLetters = []
let currentQuote = finishedGames.length ? finishedGames.length : 0
console.log("currentQuote: " + currentQuote)
var currentQuoteComplete = false
let rightGuessString = QUOTES[currentQuote]
let currentAuthor = authors[currentQuote]
console.log(rightGuessString)
let phrase = Array.from(rightGuessString)
let phraseToCompare = phrase
let isSolving = false
let numberOfRows = 2
let lengthOfRows = []
let rowArray = []



const offsetFromDate = new Date(2022, 2, 29)
const msOffset = Date.now() - offsetFromDate
const dayOffset = msOffset / 1000 / 60 / 60 / 24
// const targetWord = targetWords[Math.floor(dayOffset)] targetWords is the word array

// var currentQuote = Math.floor(dayOffset)
var gamesWon = 0
if (localStorage.getItem("gamesWon") === null) {
  localStorage.setItem("gamesWon", 0)
}
gamesWon = parseInt(localStorage.getItem("gamesWon"))
var gamesLost = 0
if (localStorage.getItem("gamesLost") === null) {
  localStorage.setItem("gamesLost", 0)
}
gamesLost = parseInt(localStorage.getItem("gamesLost"))

var avLettersSum = 0
var avLetterLength = 0
var letterAverage = 0

function getAverageLetterInt() {
  let averageLettersInt = []
  var letters = localStorage.getItem("averageLetters")
  if (letters != null) {
    letters = JSON.parse(letters)
    for (var i = 0; i < letters.length; i++) {
      averageLettersInt.push(letters[i])
    }
    averageLettersInt.forEach(number => {
      avLettersSum = avLettersSum + number
    });
    avLetterLength = averageLettersInt.length
    letterAverage = avLettersSum / avLetterLength
    console.log("avLetterSum: " + avLettersSum)
    localStorage.setItem("averageLetters", JSON.stringify(averageLettersInt))
  }

}

function getRowLength() {
  for (var i = 0; i < phrase.length; i++) {
    if (phrase[i] === " ") {
      spaces.push(i)
    }
  }
  const closestIndex = (num, spaces) => {
    if (phrase.length < 16) {
    }
    let curr = spaces[0], diff = Math.abs(num - curr);
    let index = 0;
    for (let i = 0; i < spaces.length; i++) {
      let newdiff = Math.abs(num - spaces[i]);
      if (newdiff < diff) {
        diff = newdiff;
        curr = spaces[i];
        index = i;
      };
    };
    return index;
  };

  lengthOfRows.push(spaces[closestIndex(8, spaces)])
  let firstRow = lengthOfRows[0]
  rowArray.push(firstRow)

  lengthOfRows.push(spaces[closestIndex(16, spaces)])
  let secondRow = lengthOfRows[1] - lengthOfRows[0]
  if (secondRow != 0) {
    rowArray.push(secondRow)
  }
  lengthOfRows.push(spaces[closestIndex(24, spaces)])
  if (lengthOfRows[2] != lengthOfRows[1]) {
    let thirdRow = lengthOfRows[2] - lengthOfRows[1]
    rowArray.push(thirdRow)
  }
  lengthOfRows.push(spaces[closestIndex(32, spaces)])
  if (lengthOfRows[3] != lengthOfRows[2]) {
    let fourthRow = lengthOfRows[3] - lengthOfRows[2]
    rowArray.push(fourthRow)
  }
  lengthOfRows.push(spaces[closestIndex(40, spaces)])
  if (lengthOfRows[4] != lengthOfRows[3]) {
    let fifthRow = lengthOfRows[4] - lengthOfRows[3]
    rowArray.push(fifthRow)
  }
  lengthOfRows.push(spaces[closestIndex(48, spaces)])
  if (lengthOfRows[5] != lengthOfRows[4]) {
    let fifthRow = lengthOfRows[5] - lengthOfRows[4]
    rowArray.push(fifthRow)
  }
  lengthOfRows.push(spaces[closestIndex(56, spaces)])
  if (lengthOfRows[6] != lengthOfRows[5]) {
    let sixthRow = lengthOfRows[6] - lengthOfRows[5]
    rowArray.push(sixthRow)
  }
  lengthOfRows.push(spaces[closestIndex(64, spaces)])
  if (lengthOfRows[7] != lengthOfRows[6]) {
    let seventhRow = lengthOfRows[7] - lengthOfRows[6]
    rowArray.push(seventhRow)
  }

  let sum = rowArray.reduce((a, b) => a + b, 0);
  let lastRow = phrase.length - sum
  rowArray.push(lastRow)

  numberOfRows = rowArray.length
}

function initBoard() {
  getRowLength()
  // getNumberOfRows()
  let board = document.getElementById("game-board");

  for (var i = 0; i < numberOfRows; i++) {
    let row = document.createElement("div")
    row.className = "letter-row"

    for (var j = 0; j < rowArray[i]; j++) {
      let box = document.createElement("div")
      box.className = "letter-box"

      row.appendChild(box)
    }
    board.appendChild(row)
  }
  let boxes = document.getElementsByClassName("letter-box")
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].id = i
  }
}
initBoard()

let blockQuote = document.getElementById('blockquote')
blockQuote.innerHTML = rightGuessString.toUpperCase() + "."
let quoteAuthor = document.getElementById('author')
quoteAuthor.textContent = "- " + currentAuthor

var buttons = document.querySelectorAll(".keyboard-button").length;

for (var i = 0; i < buttons; i++) {
  let btn = document.querySelectorAll(".keyboard-button")[i]
  btn.addEventListener("click", function () {
    let pressedKey = btn.textContent
    if (pressedKey === "space") {
      pressedKey = "_";
    }
    if (pressedKey == "Del" && nextLetter !== 0) {
      deleteLetter(pressedKey)
    }
    if (pressedKey == "Enter") {
      pressEnter()
    }
    if (pressedKey == "Guess the Quote") {
      guessThePhrase()
    }
    if (pressedKey == "Solve") {
      checkSaying()
    }

    let found = pressedKey.match(/[a-z, _, ', .]/gi)
    if (!found || found.length > 1) {
      return
    } else if (isSolving === true) {

      enterGuessLetters(pressedKey)

    } else {
      btn.style.backgroundColor = "#75ADAF"

      insertLetter(pressedKey)
    }
  });
}

function insertLetter(pressedKey) {
  if (nextLetter === 10) {

    return
  }
  pressedKey = pressedKey.toLowerCase()

  if (pressedKey === "_") {
    pressedKey = " "
  }
  currentGuess.push(pressedKey)
  console.log("currentGuess: " + currentGuess)
  nextLetter += 1
}

function deleteLetter() {
  if (isSolving === false) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
      if (elem.textContent === currentGuess[currentGuess.length - 1]) {
        elem.style.backgroundColor = "#F5F4F4"
        currentGuess.pop()
        nextLetter -= 1
      }
    }
  } else {
    let boxId = guessBoxesUsed[guessBoxesUsed.length - 1]
    let box = document.getElementById(boxId)
    guessBoxes.unshift(boxId)
    guessBoxesUsed.pop(boxId)
    box.textContent = ""

  }
}

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '1.5s');

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true });
  });

function pressEnter() {
  let letters = document.getElementsByClassName('letter-box')
  let rightSaying = Array.from(rightGuessString)

  for (var i = 0; i < rightSaying.length; i++) {
    let box = letters[i]
    let letter = currentGuess[nextLetter - 1]
    let letterPosition = rightSaying.indexOf(letter)
    if (rightSaying[i] === " " && letter === " ") {
      animateCSS(box, 'flipInX')
      box.style.border = "none"
      box.classList.add("space-box")
      shadeKeyBoard("space", "#739976")
    }
    if (letterPosition === -1) {
      shadeKeyBoard(letter, "#182835")
    } else if (rightSaying[i] === letter && letter != " ") {
      animateCSS(box, 'flipInX')
      box.textContent = letter
      box.style.border = "none"
      box.style.backgroundColor = "#739976"
      box.style.color = "#F5F4F4"
      shadeKeyBoard(currentGuess[nextLetter - 1], '#739976')
    }
  }
  updateCount()
  checkSaying()
  if (nextLetter === 10 && phrase.length > 0) {
    toastPopup("You've run out of guesses. Try to solve the quote")
    guessThePhrase()
  }

}
function revealAnswer() {
  let boxes = document.getElementsByClassName("letter-box")
  for (var i = 0; i < phrase.length; i++) {
    boxes[i].textContent = phrase[i]
    animateCSS(boxes[i], 'bounce')
    boxes[i].style.border = "none"
    boxes[i].style.backgroundColor = "#739976"
    boxes[i].style.color = "white"
  }
}

function updateCount() {
  document.getElementById('guessCount').innerHTML = currentGuess.length
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      elem.style.backgroundColor = color
      break
    }
  }
}

function removeItem(array, item) {
  return array.filter((i) => i !== item);
}

function toastPopup(toastMessage) {
  let notice = document.getElementById("toast")
  notice.className = "show"
  notice.innerHTML = toastMessage
  setTimeout(function () { notice.className = notice.className.replace("show", ""); }, 3000)
}

function checkSaying() {
  if (isSolving === true) {
    const boxes = document.getElementsByClassName("letter-box")
    let compareBoxes = []
    let text = ""
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].hasChildNodes()) {
        text = " "
      } else {
        text = boxes[i].textContent
      }

      compareBoxes.push(text)
    }
    console.log("Phrase: " + phrase)
    console.log("CompBx: " + compareBoxes)
    var isSame = (phrase.length == compareBoxes.length) && phrase.every(function (element, index) {
      return element === compareBoxes[index];
    });
    if (isSame == false) {
      toastPopup("Sorry, that is not correct.")
      setTimeout(revealAnswer, 4000)
      finishedGames.push(currentQuote)
      localStorage.setItem("finishedGames", JSON.stringify(finishedGames))
      averageLetters.push(currentGuess.length)
      localStorage.setItem("averageLetters", JSON.stringify(averageLetters))
      gamesLost += 1
      localStorage.setItem("gamesLost", gamesLost)
      getStats()
      setTimeout(function () { $('#endOfGameModal').modal('show') }, 4000)

    } else {
      for (var i = 0; i < boxes.length; i++) {
        animateCSS(boxes[i], 'flipInX')
        boxes[i].style.border = "none"
        boxes[i].style.backgroundColor = "#739976"
        boxes[i].style.color = "white"
      }
      // toastr.success("Correct")
      toastPopup("Correct!")
      setTimeout(revealAnswer, 3000)
      finishedGames.push(currentQuote)
      localStorage.setItem("finishedGames", JSON.stringify(finishedGames))
      averageLetters.push(currentGuess.length)
      localStorage.setItem("averageLetters", JSON.stringify(averageLetters))
      gamesWon += 1
      localStorage.setItem("gamesWon", gamesWon)
      getStats()
      setTimeout(function () { $('#endOfGameModal').modal('show') }, 4000)
      nextLetter = 10
    }

  } else {
    phraseToCompare = removeItem(phraseToCompare, currentGuess[nextLetter - 1])
    if (phraseToCompare.length === 0) {
      toastPopup("Correct!")
      gamesWon += 1
      localStorage.setItem("gamesWon", gamesWon)
      console.log("gameswon: " + gamesWon)
      setTimeout(revealAnswer, 4000)
      finishedGames.push(currentQuote)
      localStorage.setItem("finishedGames", JSON.stringify(finishedGames))
      averageLetters.push(currentGuess.length)
      localStorage.setItem("averageLetters", JSON.stringify(averageLetters))
      getStats()
      setTimeout(function () { $('#endOfGameModal').modal('show') }, 4000)
      nextLetter = 10
    }
  }
}

let guessBoxesUsed = []
let guessBoxes = []


function guessThePhrase() {
  console.log("Guess pressed")
  isSolving = true

  const boxes = document.getElementsByClassName("letter-box")
  for (var i = 0; i < boxes.length; i++) {
    let box = boxes[i]

    if (!box.hasChildNodes() && !box.classList.contains("space-box")) {
      box.style.backgroundColor = "#75ADAF"
      guessBoxes.push(box.id)
    }
  }
}

function enterGuessLetters(pressedKey) {
  if (guessBoxes.length > 0) {
    let guess = document.getElementById(guessBoxes[0])
    guess.textContent = pressedKey
    guessBoxesUsed.push(guessBoxes[0])
    guessBoxes.shift()
  }
  document.getElementById("solveBtn").textContent = "Solve"
}

//Stats

function getStats() {
  var gamesPlayed = gamesLost + gamesWon

  let wonStats = document.getElementsByClassName("won")
  for (var i = 0; i < wonStats.length; i++) {
    wonStats[i].textContent = gamesWon.toString()
    console.log("wonStats: " + gamesWon)
  }
  let gamesPlayedStats = document.getElementsByClassName("played")
  for (var i = 0; i < gamesPlayedStats.length; i++) {
    gamesPlayedStats[i].textContent = gamesPlayed.toString()
  }
  var winPercentage = (gamesWon / gamesPlayed * 100).toFixed(1)
  let winPerStats = document.getElementsByClassName("winPercentage")
  for (var i = 0; i < winPerStats.length; i++) {
    winPerStats[i].textContent = winPercentage ? winPercentage.toString() : "0"
  }

  let avLettersStats = document.getElementsByClassName("averageLetters")
  getAverageLetterInt()

  if (avLetterLength != 0) {
    for (var i = 0; i < avLettersStats.length; i++) {

      avLettersStats[i].textContent = letterAverage.toFixed(1)
    }
  } else {
    for (var i = 0; i < avLettersStats.length; i++) {
      avLettersStats[i].textContent = "TBD"
    }
  }

}
getStats()



