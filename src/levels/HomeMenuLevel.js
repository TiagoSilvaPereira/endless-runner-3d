class HomeMenuLevel extends Level {

    constructor() {
        
        super();

        this.scene = null;

    }

    createScene() {

        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        var menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("homeMenuUI");

        var playButton = BABYLON.GUI.Button.CreateSimpleButton("playButton", "Play Game");
        playButton.width = 0.2;
        playButton.height = "40px";
        playButton.color = "white";
        playButton.background = "green";

        playButton.onPointerUpObservable.add(function() {
            GAME.goToLevel('RunnerLevel');
        });

        menuTexture.addControl(playButton);
        
        this.scene.registerBeforeRender(
            this.beforeRender.bind(this)
        );

        return this.scene;

    }

}