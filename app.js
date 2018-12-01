var app = {

    init() {
        this.game = new Game();
        this.game.start();
    }

}

window.addEventListener('load', () => {
    app.init();
})