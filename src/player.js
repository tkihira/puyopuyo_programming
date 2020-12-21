class Player {
    // static centerPuyo;
    // static movablePuyo;
    // static puyoStatus;
    // static centerPuyoElement;
    // static movablePuyoElement;

    // static groundFrame;

    static initialize () {
    }

    static createNewPuyo () {
        // ぷよぷよが置けるかどうか、1番上の段の左から3つ目を確認する
        if(Stage.board[0][2]) {
            // 空白でない場合は新しいぷよを置けない
            return false;
        }
        // 新しいぷよの色を決める
        const puyoColors = Math.max(1, Math.min(5, Config.puyoColors));
        this.centerPuyo = Math.floor(Math.random() * puyoColors) + 1;
        this.movablePuyo = Math.floor(Math.random() * puyoColors) + 1;
        // 新しいぷよ画像を作成する
        this.centerPuyoElement = PuyoImage.getPuyo(this.centerPuyo);
        this.movablePuyoElement = PuyoImage.getPuyo(this.movablePuyo);
        Stage.stageElement.appendChild(this.centerPuyoElement);
        Stage.stageElement.appendChild(this.movablePuyoElement);
        // ぷよの初期配置を定める
        this.puyoStatus = {
            x: 2, // 中心ぷよの位置: 左から2列目
            y: -1, // 画面上部ギリギリから出てくる
            left: 2 * Config.puyoImgWidth,
            top: -1 * Config.puyoImgHeight,
            dx: 0, // 動くぷよの相対位置: 動くぷよは上方向にある
            dy: -1, 
            rotation: 90 // 動くぷよの角度は90度（上向き）
        };
        // 接地時間はゼロ
        this.groundFrame = 0;
        // ぷよを描画
        this.setPuyoPosition();
        return true;
    }

    static setPuyoPosition () {
        this.centerPuyoElement.style.left = this.puyoStatus.left + 'px';
        this.centerPuyoElement.style.top = this.puyoStatus.top + 'px';
        const x = this.puyoStatus.left + Math.cos(this.puyoStatus.rotation * Math.PI / 180) * Config.puyoImgWidth;
        const y = this.puyoStatus.top - Math.sin(this.puyoStatus.rotation * Math.PI / 180) * Config.puyoImgHeight;
        this.movablePuyoElement.style.left = x + 'px';
        this.movablePuyoElement.style.top = y + 'px';
    }

    static falling (isDownPressed) {
        // 現状の場所の下にブロックがあるかどうか確認する
        let isBlocked = false;
        let x = this.puyoStatus.x;
        let y = this.puyoStatus.y;
        let dx = this.puyoStatus.dx;
        let dy = this.puyoStatus.dy;
        if(y + 1 >= Config.stageRows || Stage.board[y + 1][x] || (y + dy + 1 >= 0 && (y + dy + 1 >= Config.stageRows || Stage.board[y + dy + 1][x + dx]))) {
            isBlocked = true;
        }
        if(!isBlocked) {
            // 下にブロックがないなら自由落下してよい。プレイヤー操作中の自由落下処理をする
            this.puyoStatus.top += Config.playerFallingSpeed;
            if(isDownPressed) {
                // 下キーが押されているならもっと加速する
                this.puyoStatus.top += Config.playerDownSpeed;
            }
            if(Math.floor(this.puyoStatus.top / Config.puyoImgHeight) != y) {
                // ブロックの境を超えたので、再チェックする
                // 下キーが押されていたら、得点を加算する
                if(isDownPressed) {
                    Score.addScore(1);
                }
                y += 1;
                this.puyoStatus.y = y;
                if(y + 1 >= Config.stageRows || Stage.board[y + 1][x] || (y + dy + 1 >= 0 && (y + dy + 1 >= Config.stageRows || Stage.board[y + dy + 1][x + dx]))) {
                    isBlocked = true;
                }
                if(!isBlocked) {
                    // 境を超えたが特に問題はなかった。次回も自由落下を続ける
                    this.groundFrame = 0;
                    return;
                } else {
                    // 境を超えたらブロックにぶつかった。位置を調節して、接地を開始する
                    this.puyoStatus.top = y * Config.puyoImgHeight;
                    this.groundFrame = 1;
                    return;
                }
            } else {
                // 自由落下で特に問題がなかった。次回も自由落下を続ける
                this.groundFrame = 0;
                return;
            }
        }
        if(this.groundFrame == 0) {
            // 初接地である。接地を開始する
            this.groundFrame = 1;
            return;
        } else {
            this.groundFrame++;
            if(this.groundFrame > Config.playerGroundFrame) {
                return true;
            }
        }

    }
    static playing(frame) {
        // まず自由落下を確認する
        // 下キーが押されていた場合、それ込みで自由落下させる
        if(this.falling(false)) {
            // 落下が終わっていたら、ぷよを固定する
            this.setPuyoPosition();
            return 'fix';
        }
        this.setPuyoPosition();
        return 'playing';
    }

    static fix() {
        // 現在のぷよをステージ上に配置する
        const x = this.puyoStatus.x;
        const y = this.puyoStatus.y;
        const dx = this.puyoStatus.dx;
        const dy = this.puyoStatus.dy;
        if(y >= 0) {
            // 画面外のぷよは消してしまう
            Stage.setPuyo(x, y, this.centerPuyo);
            Stage.puyoCount++;
        }
        if(y + dy >= 0) {
            // 画面外のぷよは消してしまう
            Stage.setPuyo(x + dx, y + dy, this.movablePuyo);
            Stage.puyoCount++;
        }
        // 操作用に作成したぷよ画像を消す
        Stage.stageElement.removeChild(this.centerPuyoElement);
        Stage.stageElement.removeChild(this.movablePuyoElement);
        this.centerPuyoElement = null;
        this.movablePuyoElement = null;
    }
}