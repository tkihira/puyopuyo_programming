class Stage {
    // static stageElement;
    // static board;
    // static puyoCount;

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
}
