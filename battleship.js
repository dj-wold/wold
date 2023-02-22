const view = {
	displayMessage: (msg) => {
		let messageArea = document.getElementById('messageArea');
		messageArea.innerHTML = msg;
	},

	displayHit: (location) => {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'hit');
	},

	displayMiss: (location) => {
		let cell = document.getElementById(location);
		cell.setAttribute('class', 'miss');
	}
} 

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{locations: ['', '', ''], hits: ['', '', '']},
            {locations: ['', '', ''], hits: ['', '', '']}, 
            {locations: ['', '', ''], hits: ['', '', '']}],

        fire: function(guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i]
            let index = ship.locations.indexOf(guess)
            
            if (index >= 0) {
                ship.hits[index] = 'hit'
                view.displayHit(guess)
                view.displayMessage('HIT!')
                
                if (this.isSunk(ship)){
                    view.displayMessage('You sank my battelship!')
                    this.shipsSunk++
                    }
                    return true
                }
            }
            view.displayMiss(guess)
            view.displayMessage('You missed')
            return false
        },
        
        isSunk: (ship) => {
            for (let i = 0; i < this.shipLength; i++) {
                if (ship.hits[i] !=='hit') {
                    return false
                }
            }
            return true
        },

        generateShipLocations: function() {
            let locations;
            for (let i = 0; i < this.numShips; i++) {
                do {
                    locations = this.generateShip()
                } while (this.collision(locations))
                this.ships[i].locations = locations
            }
            console.log("Ships array: ")
            console.log(this.ships)
        },
    
        generateShip: function() {
            let direction = Math.floor(Math.random() * 2)
            let row, col;
    
            if (direction === 1) { 
                row = Math.floor(Math.random() * this.boardSize)
                col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
            } else { 
                row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1))
                col = Math.floor(Math.random() * this.boardSize);
            }

            let newShipLocations = []
            for (let i = 0; i < this.shipLength; i++) {
                if (direction === 1) {
                    newShipLocations.push(row + "" + (col + i))
                } else {
                    newShipLocations.push((row + i) + "" + col)
                }
            }
            return newShipLocations
        },
    
        collision: function(locations) {
            for (let i = 0; i < this.numShips; i++) {
                let ship = this.ships[i];
                for (let j = 0; j < locations.length; j++) {
                    if (ship.locations.indexOf(locations[j]) >= 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }      

parseGuess = (guess) => {
    let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    
    if (guess === null || guess.length !== 2) {
        alert('Oops, please enter a letter and a number on the board')
    } else {
        firstChar = guess.charAt(0)
        let row = alphabet.indexOf(firstChar)
        let column = guess.charAt(1)

        if (isNaN(row) || isNaN(column)) {
            alert('Oops, thet isn`t on the board')
        }else if (row < 0 || row >= model.boardSize || 
            column < 0 || column >= model.boardSize) {
                alert('Oops, that`s off the board!')
            } else {
                return row + column
            }
    }
    return null
}

const controller = {
    guesses: 0,

    processGuess: function(guess) {
        let location = parseGuess(guess)

        if (location) {
            this.guesses++
            let hit = model.fire(location)
            if ( hit && model.shipsSunk === model.numShips) {
                view.displayMessage ('You sank all batlleships, in ' + this.guesses + ' guesses')
            }
        }
    }
}

function init() {
    let fireButton = document.getElementById('fireButton')
    fireButton.onclick = handleFireButton
    let guessInput = document.getElementById('guessInput')
    guessInput.onkeydown = handleKeyPress

    model.generateShipLocations()
}

function handleKeyPress(e) {
    let fireButton = document.getElementById('fireButton')
    if (e.keyCode === 13) {
    fireButton.click()
    return false
    }
}
function handleFireButton() {
    let guessInput = document.getElementById('guessInput')
    let guess = guessInput.value
    controller.processGuess(guess)

    guessInput.value = ''
} 

window.onload = init
