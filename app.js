window.GAME = null;

var app = {

    init() {
        GAME = new Game();
        GAME.start();
    }

}

window.addEventListener('load', () => {
    app.init();
});