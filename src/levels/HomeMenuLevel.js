class HomeMenuLevel extends Level {

    constructor() {
        super();
    }

    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        var menu = new UI('homeMenuUI');
        
        menu.addButton('playButton', 'Play Game', {
            'onclick': () => GAME.goToLevel('RunnerLevel')
        });

    }

}