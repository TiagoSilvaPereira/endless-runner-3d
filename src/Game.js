class Game {

    constructor() {

        /**
         * Keyboard pressed keys
         */
        this.keys = {};

        /**
         * Game states
         */
        this.states = [
            'LOADING',
            'PLAYING',
            'PAUSED'
        ];

        /**
         * Starts the BABYLON engine on the Canvas element
         */
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);

        this.currentLevel = null;
        this.currentLevelNumber = 1;
        
        this.levels = [
            new Level(this)
        ];

    }

    start() {
        this.listenKeys();
        this.startLevel();
        this.render();
    }

    listenKeys() {
        
        document.addEventListener('keydown', keyDown.bind(this));
        document.addEventListener('keyup', keyUp.bind(this));
    
        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;

        function keyDown(e) {
            if (e.keyCode == 87) {//Arrow Up
                this.keys.up = 1;
                
            }else if (e.keyCode == 83) {//Arrow Down
                this.keys.down = 1;
                
            } else if (e.keyCode == 65) {//Arrow Left
                this.keys.left = 1;
                
            } else if (e.keyCode == 68) {//Arrow Right
                this.keys.right = 1;
            }
        }

        function keyUp(e) {
            if (e.keyCode == 87) {//Arrow Up
                this.keys.up = 0;
            }else if (e.keyCode == 83) {//Arrow Down
                this.keys.down = 0;
                
            } else if (e.keyCode == 65) {//Arrow Left
                this.keys.left = 0;
                
            } else if (e.keyCode == 68) {//Arrow Right
                this.keys.right = 0;
            }
        }
    }

    startLevel() {

        this.currentLevel = this.levels[this.currentLevelNumber - 1];
        this.currentLevel.start();

    }

    render() {

        this.engine.runRenderLoop(() => { 
            this.currentLevel.scene.render();
        });

        window.addEventListener("resize", () => { 
            this.engine.resize();
        });

    }

}