class Magic {
	constructor(size = 3) {
		this.size = size;
		 //numbers to fill (Ex. if matrix 3x3 contain num from 1 to 3)
		this.mst = [...Array(this.size * this.size)].map((v, i) => i + 1);
		 // square is array which contains zeros
		this.square = Array(this.size).fill(0).map(() => Array(this.size).fill(0));
		this.create()
	}

	create() {
		let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		 // Заполняем магический квадрат
		this.square[0][0] = numbers[1];
		this.square[0][1] = numbers[8]; // 2 9 4
		this.square[0][2] = numbers[3]; // 7 5 3
		this.square[1][0] = numbers[6]; // 6 1 8
		this.square[1][1] = numbers[4];
		this.square[1][2] = numbers[2];
		this.square[2][0] = numbers[5];
		this.square[2][1] = numbers[0];
		this.square[2][2] = numbers[7];

		 // Выполняем случайное вращение
		let rotations = Math.floor(Math.random() * 4); // Случайное количество вращений (0-3)
		
		for (let i = 0; i < rotations; i++) {
			this.rotateCenter();
			this.rotateDiagonal();
		}
	}
	rotateCenter() {
		const moves = Math.floor(Math.random() * 4) * 2; // Random even number of moves (0, 2, 4, 6)

		for (let i = 0; i < moves; i += 1) {
			  // Shift elements in a circular motion clockwise
			const temp = this.square[0][2];
			this.square[0][2] = this.square[0][1];
			this.square[0][1] = this.square[0][0];
			this.square[0][0] = this.square[1][0];
			this.square[1][0] = this.square[2][0];
			this.square[2][0] = this.square[2][1];
			this.square[2][1] = this.square[2][2];
			this.square[2][2] = this.square[1][2];
			this.square[1][2] = temp;
		}
	}
	rotateDiagonal() {
		 // Выбираем случайную диагональ для вращения
		let diagonal = Math.random() < 0.5 ? "main" : "secondary";

		if (diagonal === "main") {
			 // Поворот вокруг главной диагонали
			let temp = this.square[0][2];
			this.square[0][2] = this.square[2][0]; // 4=6
			this.square[2][0] = temp;

			temp = this.square[0][1];
			this.square[0][1] = this.square[1][0]; // 7=9
			this.square[1][0] = temp;

			temp = this.square[2][1];
			this.square[2][1] = this.square[1][2]; // 3=1
			this.square[1][2] = temp;
		} else {
			 // Поворот вокруг побочной диагонали
			let temp = this.square[0][0];
			this.square[0][0] = this.square[2][2];// 8=2
			this.square[2][2] = temp;

			temp = this.square[0][1];
			this.square[0][1] = this.square[1][2];//3 = 9
			this.square[1][2] = temp;

			temp = this.square[2][1];
			this.square[2][1] = this.square[1][0];//1 = 7
			this.square[1][0] = temp;
		}
	}
}