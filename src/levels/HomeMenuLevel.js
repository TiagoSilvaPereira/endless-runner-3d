class HomeMenuLevel extends Level {

    constructor() {
        
        super();

        this.scene = null;

    }

    createScene() {

        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        var menu = new UI('homeMenuUI');
        
        menu.addButton('playButton', 'Play Game', {
            'onclick': () => GAME.goToLevel('RunnerLevel')
        });
        
        this.scene.registerBeforeRender(
            this.beforeRender.bind(this)
        );

        return this.scene;

    }

}