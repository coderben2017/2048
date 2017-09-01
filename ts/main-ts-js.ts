/**
 * author: Ben
 * e-mail: coderben2016@126.com
 * date: 2017/09/01
 * todo: Restructure 2048 using TypeScript and ES6
 */

class Game2048{
	private _container: any;
	private _tiles: any[];

	constructor(container: any){
		this._container = container;
		this._tiles = new Array(16);
	}

	private setTileVal(tile: any, val : number){// 函数参数写全强类型声明
		tile.className = `tile tile${val}`;
		tile.setAttribute("val", val);
		tile.innerHTML = val > 0 ? val : "";
	}

	private createTile(val: number){
		let tile = document.createElement("div");// any类型变量省略强类型声明
		this.setTileVal(tile, val);
		return tile;
	}

	private randomTile(){// void类型返回值省略返回值类型声明
		let zeroTiles = [];
		for(let i = 0; i < this._tiles.length; ++i){
			if(Number(this._tiles[i].getAttribute("val")) === 0){
				zeroTiles.push(this._tiles[i]);
			}
		}
		let tile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
		let val: number = Math.random() < 0.8 ? 2 : 4;
		this.setTileVal(tile, val);
	}

	private init(){
		for(let i = 0; i < this._tiles.length; ++i){
			let tile = this.createTile(0);
			this._container.appendChild(tile);
			this._tiles[i] = tile;
		}
		this.randomTile();
		this.randomTile();
	}

	private getScore(): number{// 强类型定义
		let maxScore: number = 0;
		for(let i = 0; i < this._tiles.length; ++i){
			let curVal: number = Number(this._tiles[i].getAttribute("val"));// 类型断言
			if(curVal > maxScore){
				maxScore = curVal;
			}
		}
		return maxScore;
	}

	private merge(passiveTile: any, activeTile: any){
		let pasVal: number = Number(passiveTile.getAttribute("val"));
		let actVal: number = Number(activeTile.getAttribute("val"));
		if(actVal > 0){
			if(pasVal === 0){
				this.setTileVal(passiveTile, actVal);
				this.setTileVal(activeTile, 0);
			}else if(pasVal === actVal){
				this.setTileVal(passiveTile, actVal * 2);
				this.setTileVal(activeTile, 0);
			}
		}
	}

	private move(dirction: number){
		switch (dirction) {
			case 37:// left
				for(let i = 1; i < this._tiles.length; ++i){
					let j = i;
					while(j % 4 !== 0){
						this.merge(this._tiles[j-1], this._tiles[j]);
						--j;
					}
				}	
				break;
			case 38:// up
				for(let i = 4; i < this._tiles.length; ++i){
					let j = i;
					while(j >= 4){
						this.merge(this._tiles[j-4], this._tiles[j]);
						j -= 4;
					}
				}
				break;
			case 39:// right
				for(let i = this._tiles.length-1; i >= 0; --i){
					let j = i;
					while(j % 4 !== 3){
						this.merge(this._tiles[j+1], this._tiles[j]);
						++j;
					}
				}
				break;
			case 40:// down
				for(let i = 11; i >= 0; --i){
					let j = i;
					while(j <= 11){
						this.merge(this._tiles[j+4], this._tiles[j]);
						j += 4;
					}
				}
				break;
			default:
				// code...
				break;
		}
		this.randomTile();
	}

	private victory(): boolean{
		return this.getScore() >= 2048;
	}

	private equal(tile1: any, tile2: any): boolean{
		return tile1.getAttribute("val") === tile2.getAttribute("val");
	}

	private over(): boolean{
		for(let i = 0; i < this._tiles.length; ++i){
			if(Number(this._tiles[i].getAttribute("val")) === 0){
				return false;
			}
			if(i % 4 > 0 && this.equal(this._tiles[i], this._tiles[i-1])){
				return false;
			}
			if(i <= 11 && this.equal(this._tiles[i], this._tiles[i+4])){
				return false;
			}
		}
		return true;
	}

	private clean(){
		for(let i = 0; i < this._tiles.length; ++i){
			this._container.removeChild(this._tiles[i]);
		}
		this._tiles = new Array(16);
	}
}

let startBtn: any;
let game: any;
let startStatus: boolean = false;

window.onload = () => {
	let container: any = document.querySelector("#div2048");
	startBtn = document.querySelector("#start");
	startBtn.onclick = () => {
		startBtn.style.display = "none";
		game = new Game2048(container);
		game.init();
		startStatus = true;
	}
}

window.onkeydown = (event) => {
	if(!startStatus){
		alert("Please click the Game Panel to start !");
		return;
	}

	let keyNum: number;
	if(window.event){// for IE
		keyNum = event.keyCode;
	}else if(event.which){// for other
		keyNum = event.which;
	}
	if([37,38,39,40].indexOf(keyNum) > -1){
		let scoreBox: any = document.querySelector("#score");
		if(game.victory()){
			game.clean();
			startBtn.innerHTML = "Congratulations! Click To Replay ~";
			startBtn.style.display = "block";
			scoreBox.innerHTML = "0";
			startStatus = false;
		}else if(game.over()){
			game.clean();
			startBtn.innerHTML = "Game Over...Click To Replay !";
			startBtn.style.display = "block";
			scoreBox.innerHTML = "0";
			startStatus = false;
		}else{
			game.move(keyNum);
			scoreBox.innerHTML = game.getScore();
		}
	}
}