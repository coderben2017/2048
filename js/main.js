/**
 * author: Ben
 * update date: 2017/03/23
 * update content: some language norm for JS
 */

function Game2048(container) {
    this._container = container;
    this._tiles = new Array(16);
}

Game2048.prototype = {
    setTileVal : function(tile, val) {
        tile.className = "tile tile" + val;
        tile.setAttribute("val", val);
        tile.innerHTML = val > 0 ? val : "";
    },

    createTile : function(val) {
        var tile = document.createElement("div");
        this.setTileVal(tile, val);
        return tile;
    },

    randomTile : function() {
        var zeroTiles = [];
        for(var i = 0; i < this._tiles.length; ++i){
            if(this._tiles[i].getAttribute("val") == 0){
                zeroTiles.push(this._tiles[i]);
            }
        }
        var xTile = zeroTiles[ Math.floor(Math.random() * zeroTiles.length) ];
        console.log( xTile );
        this.setTileVal(xTile, Math.random() < 0.8 ? 2 : 4);
    },

    init : function() {
        for(var i = 0; i < this._tiles.length; ++i){
            var tile = this.createTile(0);
            this._container.appendChild(tile);
            this._tiles[i] = tile;
        }
        this.randomTile();
        this.randomTile();
    },

   getMaxScore : function() {
        var maxScore = 0;
        for(var i = 0; i < this._tiles.length; ++i){
            var curVal = Number(this._tiles[i].getAttribute("val"));
            if(curVal > maxScore){
                maxScore = curVal;
            }
        }
        return maxScore;
    },

    merge : function(passiveTile, activeTile) {
        var pasVal = passiveTile.getAttribute("val");
        var actVal = activeTile.getAttribute("val");
        if(actVal > 0){
            if(pasVal == 0){
                this.setTileVal(passiveTile, actVal);
                this.setTileVal(activeTile, 0);
            }else if(pasVal == actVal){
                this.setTileVal(passiveTile, 2*actVal);
                this.setTileVal(activeTile, 0);
            }
        }
    },

    move : function(direction) {
        var i, j;
        switch(direction){
            case 37://left
                for(i = 1; i < this._tiles.length; ++i){
                    j = i;
                    while(j % 4 != 0){
                        this.merge(this._tiles[j-1], this._tiles[j]);
                        --j;
                    }
                }
                break;
            case 38://up
                for(i = 4; i < this._tiles.length; ++i){
                    j = i;
                    while(j >= 4){
                        this.merge(this._tiles[j-4], this._tiles[j]);
                        j -= 4;
                    }
                }
                break;
            case 39://right
                for(i = 14; i >= 0; --i){
                    j = i;
                    while(j % 4 != 3){
                        this.merge(this._tiles[j+1], this._tiles[j]);
                        ++j;
                    }
                }
                break;
            case 40://down
                for(i = 11; i >= 0; --i ){
                    j = i;
                    while(j <= 11){
                        this.merge(this._tiles[j+4], this._tiles[j]);
                        j += 4;
                    }
                }
                break;
        }
        this.randomTile();
    },

    victory : function() {
        return this.getMaxScore() >= 2048;
    },

    equal : function(tile1, tile2) {
        return tile1.getAttribute("val") == tile2.getAttribute("val");
    },

    over : function() {
        for(var i = 0; i < this._tiles.length; ++i){
            if(this._tiles[i].getAttribute("val") == 0){
                return false;
            }
            if(i % 4 != 0 && this.equal(this._tiles[i-1], this._tiles[i])){
                return false;
            }
            if(i <= 11 && this.equal(this._tiles[i+4], this._tiles[i])){
                return false;
            }
        }
        return true;
    },

    clean : function() {
        for(var i = 0; i < this._tiles.length; ++i){
            this._container.removeChild(this._tiles[i]);
        }
        this._tiles = new Array(16);
    }
};


var startBtn, game;

window.onload = function() {
    var container = document.getElementById("div2048");
    startBtn = document.getElementById("start");
    startBtn.onclick = function () {
        this.style.display = "none";
        game = new Game2048(container);
        game.init();
    };
};

window.onkeydown = function (e) {
    var keyNum;
    if(window.event){//for IE
        keyNum = e.keyCode;
    }else if(e.which){//for others
        keyNum = e.which;
    }
    if([37,38,39,40].indexOf(keyNum) > -1){
        var score = document.getElementById('score');
        if(game.victory()){
            game.clean();
            startBtn.innerHTML = "Congratulations! Click To Replay ~";
            startBtn.style.display = "block";
            score.innerHTML = "0";
        }else if(game.over()){
            game.clean();
            startBtn.innerHTML = "Game Over...Click To Replay !";
            startBtn.style.display = "block";
            score.innerHTML = "0";
        }else{
            game.move(keyNum);
            score.innerHTML = game.getMaxScore();
        }
    }
};