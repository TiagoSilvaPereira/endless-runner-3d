import UI from '../../base/UI';
import Player from '../Player';
import Monster from '../Monster';
import Level from '../../base/Level';
import TilesGenerator from './generators/TilesGenerator';

export default class RunnerLevel extends Level {

    setProperties() {

        this.player = null;
        this.monster = null;

        // Used for ground tiles generation
        this.tiles = null;

        // Menu
        this.menu = null;
        this.pointsTextControl = null;
        this.currentRecordTextControl = null;
        this.hasMadeRecordTextControl = null;
        
    }

    setupAssets() {

        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
        this.assets.addSound('playerDieSound', '/assets/sounds/game-die.mp3', { volume: 0.4 });
        this.assets.addSound('gotCoinSound', '/assets/sounds/coin-c-09.wav');
        this.assets.addSound('damageSound', '/assets/sounds/damage.wav');
        this.assets.addSound('approachSound', '/assets/sounds/monster.wav');
        this.assets.addSound('attackSound', '/assets/sounds/monster_attack.mp3');
        
    }

    buildScene() {
        
        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        this.createMenus();

        // Sets the active camera
        var camera = this.createArcCamera();
        this.scene.activeCamera = camera;

        // Uncomment it to allow free camera rotation
        //camera.attachControl(GAME.canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 100, -100), this.scene);
        light1.intensity = 0.9;
        light2.intensity = 0.2;

        this.createPlayer();
        this.createMonster();

        this.tiles = new TilesGenerator(this);
        this.tiles.generate();

        this.scene.debugLayer.hide();
        this.scene.debugLayer.show({popup: true});

    }

    createMenus() {
        this.menu = new UI('runnerMenuUI');
        
        this.pointsTextControl = this.menu.addText('Points: 0', {
            'top': '-150px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '40px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.currentRecordTextControl = this.menu.addText('Current Record: 0', {
            'top': '-100px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.hasMadeRecordTextControl = this.menu.addText('You got a new Points Record!', {
            'top': '-60px',
            'color': GAME.options.recordTextColor,
            'fontSize': '20px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.menu.addButton('replayButton', 'Replay Game', {
            'onclick': () => this.replay() 
        });

        this.menu.addButton('backButton', 'Return to Home', {
            'top': '70px',
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });

        this.menu.hide();

        this.createTutorialText();

    }

    createTutorialText() {
        let text = GAME.isMobile() ? 'Swipe the screen to control de cube' : 'Use Arrow Keys or WASD to control the cube';

        // Small tutorial text
        let tutorialText = this.menu.addText(text, {
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        setTimeout(() => {
            this.menu.remove(tutorialText);
        }, 5000);
    }

    createArcCamera() {
        let camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
    
        camera.ctype = 1;
        camera.setPosition(new BABYLON.Vector3(0, 1, -3));
        camera.radius = 2;

        return camera;
    }

    createPlayer() {
        // Creates the player and sets it as camera target
        this.player = new Player(this);
        this.scene.activeCamera.lockedTarget = this.player.getMesh();

        var playerLight = new BABYLON.DirectionalLight("playerLight", new BABYLON.Vector3(1,-2, 1), this.scene);
        playerLight.intensity = 0.3;
        playerLight.parent = this.player.mesh;

        this.scene.shadowGenerator = new BABYLON.ShadowGenerator(32, playerLight);
        this.scene.shadowGenerator.useBlurExponentialShadowMap = true;

        this.scene.shadowGenerator.getShadowMap().renderList.push(this.player.mesh);

        // Actions when player dies
        this.player.onDie = () => {
            GAME.pause();
            this.player.calculatePoints();
            this.showMenu();
        }
    }

    showMenu() {
        this.pointsTextControl.text = 'Points: ' + this.player.getPoints();
        this.currentRecordTextControl.text = 'Current Record: ' + this.player.getLastRecord();
        this.menu.show();

        if(this.player.hasMadePointsRecord()) {
            this.hasMadeRecordTextControl.isVisible = true;
        } else {
            this.hasMadeRecordTextControl.isVisible = false;
        }
    }

    createMonster() {
        this.monster = new Monster(this);
        // Add monster shadow
        this.scene.shadowGenerator.getShadowMap().renderList.push(this.monster.mesh);
    }

    beforeRender() {
        if(!GAME.isPaused()) {
            this.player.move();
            this.monster.move();
        }
    }

    replay() {
        
        /**
         * Wee need to dispose the current colliders and tiles on scene to prevent trash objects
         */
        this.tiles.reset();
        this.disposeColliders();
        

        this.player.reset();
        this.monster.approachToPlayer();

        this.tiles.generate();
        
        this.menu.hide();
        GAME.resume();

    }
    
}