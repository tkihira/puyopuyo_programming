// 起動されたときに呼ばれる関数を登録する
window.addEventListener("load", () => {
    // まずステージを整える
    initialize();

    // ゲームを開始する
    loop();
});

let mode; // ゲームの現在の状況
let frame; // ゲームの現在フレーム（1/60秒ごとに1追加される）
let combinationCount = 0; // 何連鎖かどうか

function initialize() {
    // 画像を準備する
    PuyoImage.initialize();
    // ステージを準備する
    Stage.initialize();
    // シーンを初期状態にセットする
    mode = 'start';
    // フレームを初期化する
    frame = 0;
}

function loop() {
    switch(mode) {
        case 'start':
            // 最初は、もしかしたら空中にあるかもしれないぷよを自由落下させるところからスタート
            mode = 'checkFall';
            break;
        case 'checkFall':
            // 落ちるかどうか判定する
            if(Stage.checkFall()) {
                mode = 'fall'
            } else {
                // 落ちないならば、ぷよを消せるかどうか判定する
                mode = 'checkErase';
            }
            break;
        case 'fall':
            if(!Stage.fall()) {
                // すべて落ちきったら、ぷよを消せるかどうか判定する
                mode = 'checkErase';
            }
            break;
            case 'checkErase':
                // 消せるかどうか判定する
                const eraseInfo = Stage.checkErase(frame);
                if(eraseInfo) {
                    mode = 'erasing';
                    combinationCount++;
                    Stage.hideZenkeshi();
                } else {
                    if(Stage.puyoCount === 0 && combinationCount > 0) {
                        // 全消しの処理をする
                        Stage.showZenkeshi();
                    }
                    combinationCount = 0;
                    mode = ''
                }
                break;
            case 'erasing':
                if(!Stage.erasing(frame)) {
                    // 消し終わったら、再度落ちるかどうか判定する
                    mode = 'checkFall';
                }
                break;
        }
    frame++;
    requestAnimationFrame(loop); // 1/60秒後にもう一度呼び出す
}
