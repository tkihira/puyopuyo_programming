class Stage {
    // static stageElement;
    // static board;
    // static puyoCount;
    // static fallingPuyoList = [];

    static initialize() {
        // HTML からステージの元となる要素を取得し、大きさを設定する
        const stageElement = document.getElementById("stage");
        stageElement.style.width = Config.puyoImgWidth * Config.stageCols + 'px';
        stageElement.style.height = Config.puyoImgHeight * Config.stageRows + 'px';
        stageElement.style.backgroundColor = Config.stageBackgroundColor;
        this.stageElement = stageElement;
        
        // メモリを準備する
        this.board = [
            [0, 1, 2, 3, 4, 5],
            [1, 2, 3, 4, 5, 0],
            [2, 3, 4, 5, 0, 1],
            [0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 2, 0],
            [0, 4, 5, 5, 2, 0],
            [0, 4, 5, 5, 2, 0],
            [0, 4, 3, 3, 3, 0],
            [0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 2, 2],
            [0, 0, 3, 3, 0, 0],
            [4, 4, 0, 0, 5, 5],
        ];
        let puyoCount = 0;
        for(let y = 0; y < Config.stageRows; y++) {
            const line = this.board[y] || (this.board[y] = []);
            for(let x = 0; x < Config.stageCols; x++) {
                const puyo = line[x];
                if(puyo >= 1 && puyo <= 5) {
                    // line[x] = {puyo: puyo, element: this.setPuyo(x, y, puyo)};
                    this.setPuyo(x, y, puyo);
                    puyoCount++;
                } else {
                    line[x] = null;
                }
            }
        }
        this.puyoCount = puyoCount;
    }

    // 画面とメモリ両方に puyo をセットする
    static setPuyo(x, y, puyo) {
        // 画像を作成し配置する
        const puyoImage = PuyoImage.getPuyo(puyo);
        puyoImage.style.left = x * Config.puyoImgWidth + "px";
        puyoImage.style.top = y * Config.puyoImgHeight + "px";
        this.stageElement.appendChild(puyoImage);
        // メモリにセットする
        this.board[y][x] = {
            puyo: puyo,
            element: puyoImage
        }
    }

    // 自由落下をチェックする
    static checkFall() {
        this.fallingPuyoList.length = 0;
        let isFalling = false;
        // 下の行から上の行を見ていく
        for(let y = Config.stageRows - 2; y >= 0; y--) { 
            const line = this.board[y];
            for(let x = 0; x < line.length; x++) {
                if(!this.board[y][x]) {
                    // このマスにぷよがなければ次
                    continue;
                }
                if(!this.board[y + 1][x]) {
                    // このぷよは落ちるので、取り除く
                    let cell = this.board[y][x];
                    this.board[y][x] = null;
                    let dst = y;
                    while(dst + 1 < Config.stageRows && this.board[dst + 1][x] == null) {
                        dst++;
                    }
                    // 最終目的地に置く
                    this.board[dst][x] = cell;
                    // 落ちるリストに入れる
                    this.fallingPuyoList.push({
                        element: cell.element,
                        position: y * Config.puyoImgHeight,
                        destination: dst * Config.puyoImgHeight,
                        falling: true
                    });
                    // 落ちるものがあったことを記録しておく
                    isFalling = true;
                }
            }
        }
        return isFalling;
    }
    // 自由落下させる
    static fall() {
        let isFalling = false;
        for(const fallingPuyo of this.fallingPuyoList) {
            if(!fallingPuyo.falling) {
                // すでに自由落下が終わっている
                continue;
            }
            let position = fallingPuyo.position;
            position += Config.freeFallingSpeed;
            if(position >= fallingPuyo.destination) {
                // 自由落下終了
                position = fallingPuyo.destination;
                fallingPuyo.falling = false;
            } else {
                // まだ落下しているぷよがあることを記録する
                isFalling = true;
            }
            // 新しい位置を保存する
            fallingPuyo.position = position;
            // ぷよを動かす
            fallingPuyo.element.style.top = position + 'px';
        }
        return isFalling;
    }

}
Stage.fallingPuyoList = [];
