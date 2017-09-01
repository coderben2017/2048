/**
 * author: Ben
 * e-mail: coderben2016@126.com
 * date: 2017/09/01
 * docs: Compiled from ../ts/main-ts-js.ts
 * todo: Restructure 2048 using TypeScript and ES6
 */
var Game2048 = (function () {
    function Game2048(container) {
        this._container = container;
        this._tiles = new Array(16);
    }
    Game2048.prototype.setTileVal = function (tile, val) {
        tile.className = "tile tile" + val;
        tile.setAttribute("val", val);
        tile.innerHTML = val > 0 ? val : "";
    };
    Game2048.prototype.createTile = function (val) {
        var tile = document.createElement("div"); // any类型变量省略强类型声明
        this.setTileVal(tile, val);
        return tile;
    };
    Game2048.prototype.randomTile = function () {
        var zeroTiles = [];
        for (var i = 0; i < this._tiles.length; ++i) {
            if (Number(this._tiles[i].getAttribute("val")) === 0) {
                zeroTiles.push(this._tiles[i]);
            }
        }
        var tile = zeroTiles[Math.floor(Math.random() * zeroTiles.length)];
        var val = Math.random() < 0.8 ? 2 : 4;
        this.setTileVal(tile, val);
    };
    Game2048.prototype.init = function () {
        for (var i = 0; i < this._tiles.length; ++i) {
            var tile = this.createTile(0);
            this._container.appendChild(tile);
            this._tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    };
    Game2048.prototype.getScore = function () {
        var maxScore = 0;
        for (var i = 0; i < this._tiles.length; ++i) {
            var curVal = Number(this._tiles[i].getAttribute("val")); // 类型断言
            if (curVal > maxScore) {
                maxScore = curVal;
            }
        }
        return maxScore;
    };
    Game2048.prototype.merge = function (passiveTile, activeTile) {
        var pasVal = Number(passiveTile.getAttribute("val"));
        var actVal = Number(activeTile.getAttribute("val"));
        if (actVal > 0) {
            if (pasVal === 0) {
                this.setTileVal(passiveTile, actVal);
                this.setTileVal(activeTile, 0);
            }
            else if (pasVal === actVal) {
                this.setTileVal(passiveTile, actVal * 2);
                this.setTileVal(activeTile, 0);
            }
        }
    };
    Game2048.prototype.move = function (dirction) {
        switch (dirction) {
            case 37:// left
                for (var i = 1; i < this._tiles.length; ++i) {
                    var j = i;
                    while (j % 4 !== 0) {
                        this.merge(this._tiles[j - 1], this._tiles[j]);
                        --j;
                    }
                }
                break;
            case 38:// up
                for (var i = 4; i < this._tiles.length; ++i) {
                    var j = i;
                    while (j >= 4) {
                        this.merge(this._tiles[j - 4], this._tiles[j]);
                        j -= 4;
                    }
                }
                break;
            case 39:// right
                for (var i = this._tiles.length - 1; i >= 0; --i) {
                    var j = i;
                    while (j % 4 !== 3) {
                        this.merge(this._tiles[j + 1], this._tiles[j]);
                        ++j;
                    }
                }
                break;
            case 40:// down
                for (var i = 11; i >= 0; --i) {
                    var j = i;
                    while (j <= 11) {
                        this.merge(this._tiles[j + 4], this._tiles[j]);
                        j += 4;
                    }
                }
                break;
            default:
                // code...
                break;
        }
        this.randomTile();
    };
    Game2048.prototype.victory = function () {
        return this.getScore() >= 2048;
    };
    Game2048.prototype.equal = function (tile1, tile2) {
        return tile1.getAttribute("val") === tile2.getAttribute("val");
    };
    Game2048.prototype.over = function () {
        for (var i = 0; i < this._tiles.length; ++i) {
            if (Number(this._tiles[i].getAttribute("val")) === 0) {
                return false;
            }
            if (i % 4 > 0 && this.equal(this._tiles[i], this._tiles[i - 1])) {
                return false;
            }
            if (i <= 11 && this.equal(this._tiles[i], this._tiles[i + 4])) {
                return false;
            }
        }
        return true;
    };
    Game2048.prototype.clean = function () {
        for (var i = 0; i < this._tiles.length; ++i) {
            this._container.removeChild(this._tiles[i]);
        }
        this._tiles = new Array(16);
    };
    return Game2048;
}());
var startBtn;
var game;
var startStatus = false;
window.onload = function () {
    var container = document.querySelector("#div2048");
    startBtn = document.querySelector("#start");
    startBtn.onclick = function () {
        startBtn.style.display = "none";
        game = new Game2048(container);
        game.init();
        startStatus = true;
    };
};
window.onkeydown = function (event) {
    if (!startStatus) {
        alert("Please click the Game Panel to start !");
        return;
    }
    var keyNum;
    if (window.event) {
        keyNum = event.keyCode;
    }
    else if (event.which) {
        keyNum = event.which;
    }
    if ([37, 38, 39, 40].indexOf(keyNum) > -1) {
        var scoreBox = document.querySelector("#score");
        if (game.victory()) {
            game.clean();
            startBtn.innerHTML = "Congratulations! Click To Replay ~";
            startBtn.style.display = "block";
            scoreBox.innerHTML = "0";
            startStatus = false;
        }
        else if (game.over()) {
            game.clean();
            startBtn.innerHTML = "Game Over...Click To Replay !";
            startBtn.style.display = "block";
            scoreBox.innerHTML = "0";
            startStatus = false;
        }
        else {
            game.move(keyNum);
            scoreBox.innerHTML = game.getScore();
        }
    }
};
