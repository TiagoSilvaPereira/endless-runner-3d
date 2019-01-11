window.GAME = null;

var app = {

    init() {
        GAME = new Game(window.initialGameOptions);
        GAME.start();
    }

}

window.addEventListener('load', () => {
    app.init();
});