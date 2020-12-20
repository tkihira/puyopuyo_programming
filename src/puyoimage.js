class PuyoImage {

    // static puyoImages;

    static initialize() {
        this.puyoImages = [];
        for(let i = 0; i < 5; i++) {
            const image = document.getElementById(`puyo_${i + 1}`);
            image.removeAttribute('id');
            image.width = Config.puyoImgWidth;
            image.height = Config.puyoImgHeight;
            image.style.position = 'absolute';
            this.puyoImages[i] = image;
        }
    }

    static getPuyo(index) {
        const image = this.puyoImages[index - 1].cloneNode(true);
        return image;
    }
}