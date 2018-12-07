class Game {

    constructor() {

        /**
         * Keyboard pressed keys
         */
        this.keys = {};

        /**
         * Is game paused?
         */
        this.paused = false;

        /**
         * Starts the BABYLON engine on the Canvas element
         */
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true);

        this.currentLevel = null;
        this.currentLevelName = 'HomeMenuLevel';

        this.levels = {
            'HomeMenuLevel': new HomeMenuLevel(),
            'RunnerLevel': new RunnerLevel()
        };

    }

    start() {
        this.listenKeys();
        this.startLevel();
        this.render();
    }

    pause() {
        this.paused = true;
        //this.engine.stopRenderLoop();
    }

    isPaused() {
        return this.paused;
    }

    resume() {
        this.paused = false;
        //this.renderLoop();
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

    goToLevel(levelName) {

        if(!this.levels[levelName]) {
            console.error('A level with name ' + levelName + ' does not exists');
            return;
        }

        if(this.currentLevel) {
            this.currentLevel.exit();
        }

        this.currentLevelName = levelName;
        this.startLevel();
    }

    startLevel() {

        this.currentLevel = this.levels[this.currentLevelName];
        this.currentLevel.start();

    }

    render() {

        this.renderLoop();

        window.addEventListener("resize", () => { 
            this.engine.resize();
        });

    }

    renderLoop() {
        this.engine.runRenderLoop(() => {
            this.currentLevel.scene.render();
        });
    }

    drawEllipsoid(mesh) {
        mesh.computeWorldMatrix(true);
        var ellipsoidMat = mesh.getScene().getMaterialByName("__ellipsoidMat__");
        if (! ellipsoidMat) { 
            ellipsoidMat = new BABYLON.StandardMaterial("__ellipsoidMat__", mesh.getScene());
            ellipsoidMat.wireframe = true;
            ellipsoidMat.emissiveColor = BABYLON.Color3.Green();
            ellipsoidMat.specularColor = BABYLON.Color3.Black();
        }
        var ellipsoid = BABYLON.Mesh.CreateSphere("__ellipsoid__", 9, 1, mesh.getScene());
        ellipsoid.scaling = mesh.ellipsoid.clone();
        ellipsoid.scaling.y *= 2;
        ellipsoid.scaling.x *= 2;
        ellipsoid.scaling.z *= 2;
        ellipsoid.material = ellipsoidMat;
        ellipsoid.parent = mesh;
        ellipsoid.computeWorldMatrix(true);
    }

}