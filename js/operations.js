window.onload = emptyTablesGenerator
let N = 3
const width = 320 // 455 350
const height = 260
const board = document.getElementById("board")
let COMPLEXITY_TYPE = "MEDIUM_LEVEL"
let Magic_square_obj
let initial_square
let emptyCellCounter = 0
let VALUES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]

function emptyTablesGenerator(width, height) {
	N = 3

	if (board.children.length !== 0)
		board.removeChild(board.children[0])

	Magic_square_obj = new Magic(Number(N))
	initial_square = Magic_square_obj.square

	const game_table = document.createElement("table")
	game_table.setAttribute("cellspacing", "0")
	board.appendChild(game_table)

	for (let i = 0; i < initial_square.length; i++) {
		const tr = document.createElement("tr")
		game_table.appendChild(tr)
		for (let j = 0; j < initial_square[i].length; j++) {
			const td = document.createElement("td")
			td.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
			tr.appendChild(td)
			td.appendChild(emptySellGenerator())
		}
	}
}

function random(min, max) {
	return Math.floor(Math.random() * (max - min) + min)
}

async function generate() {
	function pokeHoles(square, holes, N) {
		let pokedHoles = []
		let count = 0;
		let proposedBoard;
		while (pokedHoles.length < holes) {
			const val = Math.floor(Math.random() * N * N) // Value between 0-N^2
			const randomRowIndex = Math.floor(val / N) // Integer 0-N for row index
			const randomColIndex = val % N
			if (!square[randomRowIndex]) {
					continue // guard against cloning error
			}
			if (square[randomRowIndex][randomColIndex] === 0) {
					continue // If cell already empty, restart loop
			}

			pokedHoles.push({  // Store the current value at the coordinates
					rowIndex: randomRowIndex,
					colIndex: randomColIndex,
					val: square[randomRowIndex][randomColIndex]
			})
			square[randomRowIndex][randomColIndex] = 0 // "poke a hole" in the board at the coords
			proposedBoard = square.map(row => row.slice()) // Clone this changed board
			count++;
		}
		return proposedBoard;
	}

	function isOneComplexityRadioButtonsSelected() {
		let flag = false
		for (const x of labelsComplexityRadioButtons) {
			if(x.children[0].checked === true)
					flag = true
		}
		return flag
	}

	if (board.children.length !== 0)
		board.removeChild(board.children[0])

	if(!isOneComplexityRadioButtonsSelected())
		labelsComplexityRadioButtons[1].children[0].checked = true

	Magic_square_obj = new Magic(Number(N))
	initial_square = Magic_square_obj.square

	//let min
	//let max
	switch (COMPLEXITY_TYPE) {
		case "EASY_LEVEL": {
			//min = 3
			//max = 3
			var holesAmount = 3
			break
		}
		case "MEDIUM_LEVEL": {
			//min = 5
			//max = 5
			var holesAmount = 5
			break
		}
		case "HARD_LEVEL": {
			//min = 7
			//max = 7
			var holesAmount = 7
			break
		}
		default: throw new Error("unknown complexity level")
	}

	//const holesAmount = random(min, max + 1)
	pokeHoles(initial_square, holesAmount, Number(N))

	const table = document.createElement("table")
	table.setAttribute("cellspacing", "0")
	table.setAttribute("id", "game-board")
	board.appendChild(table)

	for (let i = 0; i < initial_square.length; i++) {
		const tr = document.createElement("tr")
		table.appendChild(tr)

		for (let j = 0; j < initial_square[i].length; j++) {
			const td = document.createElement("td")
			td.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
			tr.appendChild(td)
			
			if (initial_square[i][j] !== 0) {
					td.style.background = "#ECECEC"
					const divStringWrapper = document.createElement("div")
					divStringWrapper.setAttribute("class", "content-wrapper")
					divStringWrapper.setAttribute("id", `game-board-base-element${i + j}`)
					divStringWrapper.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px; background: #ECECEC;`)
					divStringWrapper.setAttribute("draggable", "false")
					divStringWrapper.style.fontSize = `${200 / Number(N)}px`
					divStringWrapper.innerHTML = VALUES[initial_square[i][j] - 1]
					td.appendChild(divStringWrapper)
			} else td.appendChild(emptySellGeneratorWhithInput())
		}
	}


	if (document.getElementById("check").getAttribute("onclick") === null)
		restoreCheckButton()
}

function emptySellGenerator() {
	const div = document.createElement("div")
	//div.setAttribute("class", "empty-cell")
	div.setAttribute("id", `empty-cell-${emptyCellCounter++}`)
	div.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
	div.setAttribute("ondrop", "drop(event)")
	div.setAttribute("ondragover", "allowDrop(event)")
	return div
}

function emptySellGeneratorWhithInput() {
	const div = document.createElement("div")
	//div.setAttribute("class", "empty-cell")
	div.setAttribute("id", `empty-cell-${emptyCellCounter++}`)
	div.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
	const input = document.createElement("input")
	input.classList.add("magic-number-input")
	input.setAttribute("name", "empty")
	input.setAttribute("id", `empty-${emptyCellCounter++}`)
	input.setAttribute("inputmode", "numeric")
	input.setAttribute("min", "1")
	input.setAttribute("max", "9")
	input.setAttribute("style", `width: ${width / Number(N)}px; height: ${height / Number(N)}px;`)
	input.style.fontSize = `${200 / Number(N)}px`
	div.appendChild(input)
	return div
}


function restoreCheckButton() {
	const checkButton = document.getElementById("check")
	checkButton.classList.add("cta-primary")
	checkButton.classList.remove("wrong")
	checkButton.classList.remove("correct")
	checkButton.setAttribute("onclick", "check()")
	checkButton.innerHTML = "Перевірити"
}

function check() {
	const game_board = document.getElementById("game-board")

	if (game_board === null)
		return;

	function isUniqueInLine(arrayTd, td, index) {
		//console.log(arrayTd)
		let temp
		for (let i = 0; i < arrayTd.length; i++) {
			if (i === index) continue
			if (arrayTd[i].children[0].id.includes("game-board-base-element")){
				temp = parseInt(arrayTd[i].innerText)
			}
			else temp = arrayTd[i].firstChild.firstChild.value
			if (temp === td.firstChild.firstChild.value) return false
			//console.log(temp)
			//console.log(td.firstChild.firstChild.value)
		}
		return true
	}

	function isUniqueInRow(arrayTr, tr, tdIndex) {
		let tdOne
		for (let i = 0; i < arrayTr.length; i++) {
			if (arrayTr[i] === tr) continue
			if (arrayTr[i].children[tdIndex].children[0].id.includes("game-board-base-element")){
				tdOne = arrayTr[i].children[tdIndex].innerText
			}
			else tdOne = arrayTr[i].children[tdIndex].firstChild.firstChild.value
			//const tdOne = arrayTr[i].children[tdIndex].firstChild.firstChild.value
			const tdTwo = tr.children[tdIndex].firstChild.firstChild.value

			if (tdOne === tdTwo) return false
			//console.log(tdOne)
			//console.log(tdTwo)
			
		}
		return true
	}

	function checkSumInLine(arrayTd) {
		const targetSum = 15; // Целевая сумма для строк, столбцов и диагоналей
		var lineSum = 0;
		let temp
		for (let i = 0; i < 3; i++) {
			if (arrayTd[i].children[0].id.includes("game-board-base-element")){
				temp = parseInt(arrayTd[i].innerText)
			}
			else temp = parseInt(arrayTd[i].firstChild.firstChild.value)
			lineSum += temp;
		}
		if (lineSum !== targetSum) {
			return false;
		}
		return true
		

	}

	function checkSumInRow(arrayTr, tdIndex) {
		const targetSum = 15; // Целевая сумма для строк, столбцов и диагоналей
		let rowSum = 0;
		let temp
		for (let i = 0; i < arrayTr.length; i++) {
			if (arrayTr[i].children[tdIndex].children[0].id.includes("game-board-base-element")){
				temp = parseInt(arrayTr[i].children[tdIndex].innerText)
			}
			else temp = parseInt(arrayTr[i].children[tdIndex].firstChild.firstChild.value)
			rowSum += temp;
		}

		if (rowSum !== targetSum) {
			return false;
		}
		return true
	}

	function checkMainDiagonalSum(arrayTr, trIndex, tdIndex) {
		const targetSum = 15
		let mainDiagonalSum = 0;
		let temp
		if(trIndex === tdIndex){
			for (let i = 0; i < arrayTr.length; i++) {
				if (arrayTr[i].children[i].children[0].id.includes("game-board-base-element")){
					temp = parseInt(arrayTr[i].children[i].innerText)
				}
				else temp = parseInt(arrayTr[i].children[i].firstChild.firstChild.value)
				mainDiagonalSum += temp;

			}
			if (mainDiagonalSum !== targetSum) {
				return false;
			}
			else return true
		}
		else return true
	}

	function checkSecondaryDiagonalSum(arrayTr, trIndex, tdIndex) {
		const targetSum = 15
		let secondaryDiagonalSum = 0;
		let temp
		if(tdIndex === 3 - trIndex - 1){
			for (let i = 0; i < arrayTr.length; i++) {
				if (arrayTr[i].children[3 - i - 1].children[0].id.includes("game-board-base-element")){
					temp = parseInt(arrayTr[i].children[3 - i - 1].innerText)
				}
				else temp = parseInt(arrayTr[i].children[3 - i - 1].firstChild.firstChild.value)
				secondaryDiagonalSum += temp;
				console.log(temp)
				console.log(secondaryDiagonalSum)
			}
			if (secondaryDiagonalSum !== targetSum) {
				return false;
			}
			else return true
		}
		else return true
	}

	function isGameBoardFilled(game_board) {
		const arrayTr = game_board.children
		for (let i = 0; i < arrayTr.length; i++) {
			const arrayTd = arrayTr[i].children
			for (let j = 0; j < arrayTd.length; j++) {
					
					if (!(arrayTd[j].children[0].id.includes("game-board-base-element"))&&(arrayTd[j].children[0].children[0].value === undefined))
						return false;
			}
		}
		return true
	}

	const checkButton = document.getElementById("check")

	if (!isGameBoardFilled(game_board)) {
		checkButton.removeAttribute("onclick")
		checkButton.innerHTML = "Заповни усі клітинки"
		return;
	}

	let flag = true
	const arrayTr = game_board.children
	for (let i = 0; i < arrayTr.length; i++) {

		const arrayTd = arrayTr[i].children

		for (let j = 0; j < arrayTd.length; j++) {
			if (arrayTd[j].children[0].id.includes("game-board-base-element"))
					continue
			//const divImageWrapper = arrayTd[j].children[0]
			const inputElement = arrayTd[j].children[0].getElementsByTagName("input")[0];
			const value = parseInt(inputElement.value);
			if (isUniqueInLine(arrayTd, arrayTd[j], j)
					&& isUniqueInRow(arrayTr, arrayTr[i], j)
					&& checkSumInLine(arrayTd)
					&& checkSumInRow(arrayTr, j)
					&& checkMainDiagonalSum(arrayTr, i, j)
					&& checkSecondaryDiagonalSum(arrayTr, i, j)) {
					inputElement.style.background = "#A3D76E";
					arrayTd[j].style.background = "#A3D76E";
			} else {
					arrayTd[j].style.background = "#CD001C";
					inputElement.style.background = "#CD001C";
					checkButton.classList.add("wrong");
					checkButton.classList.remove("cta-primary");
					checkButton.removeAttribute("onclick");
					checkButton.innerHTML = "Неправильно";
					flag = false;
					
			}
		}
	}
	if (flag) {
		checkButton.classList.add("correct")
		checkButton.classList.remove("cta-primary")
		checkButton.removeAttribute("onclick")
	   checkButton.innerHTML = "Правильно"
}
}

function retry() {
	const game_board = document.getElementById("game-board")

	if (game_board === null)
		 return;

	Array.from(game_board.children).map(tr => Array.from(tr.children).map(td => {
		 const divImageWrapper = td.children[0]
		 if (!divImageWrapper.id.includes("game-board-base-element")) {
			  td.replaceChild(emptySellGeneratorWhithInput(), divImageWrapper)
			  td.style.background = "white"
		 }
	}))

	if (document.getElementById("check").getAttribute("onclick") === null)
		 restoreCheckButton()
}