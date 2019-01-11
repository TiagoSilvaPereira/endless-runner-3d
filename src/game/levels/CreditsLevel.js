class CreditsLevel extends Level {

    buildScene() {

        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), this.scene);

        // Make this scene transparent to see the background
        this.scene.clearColor = new BABYLON.Color4(0,0,0,0);
 
        this.makeUI();

    }

    makeUI() {
        var ui = new UI('creditsUI');
        
        ui.addText('Design and Code:\n Tiago Silva Pereira Rodrigues', {
            'top': '10px',
            'fontSize': '20px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
        });

        ui.addText('Music:\n Sound Image', {
            'top': '80px',
            'fontSize': '20px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
        });

        ui.addText('Sounds:\n Sound Image', {
            'top': '150px',
            'fontSize': '20px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_TOP
        });

        ui.addButton('backButton', 'Return to Home', {
            'top': '220px',
            'background': GAME.options.backgroundColor,
            'color': 'white',
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });
    }

}