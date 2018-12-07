class RunnerLevel extends Level {

    constructor() {
        
        super();

        this.scene = null;
        this.player = null;

        this.tileDepth = 10;
        this.holeDepth = 10;
        this.canGenerateMoreTiles = false;
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;

    }

    createScene() {

        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        this.createMenu();

        var camera = this.createArcCamera();

        // This attaches the camera to the canvas
        this.scene.activeCamera = camera;
        camera.attachControl(GAME.canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), this.scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 1, -1), this.scene);

        this.createPlayer();
        this.generateGroundTiles();


        this.scene.registerBeforeRender(
            this.beforeRender.bind(this)
        );

        return this.scene;

    }

    createMenu() {
        this.menu = new UI('runnerMenuUI');
        
        /*this.menu.addButton('returnButton', 'Return to Game', {
            'onclick': () => {}
        });*/

        this.menu.addButton('replayButton', 'Replay Game', {
            'onclick': () => this.replay() 
        });

        this.menu.hide();
    }

    createArcCamera() {
        let camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, 0, BABYLON.Vector3.Zero(), this.scene);
    
        camera.ctype = 1;
        camera.setPosition(new BABYLON.Vector3(0, 1, -2));
        camera.radius = 2;

        return camera;
    }

    createPlayer() {
        // Creates the player and set it as camera target
        this.player = new Player();
        this.scene.activeCamera.target = this.player.getMesh();
        this.scene.activeCamera.lockedTarget = this.player.getMesh();

        this.player.onDie = () => {
            GAME.pause();
            this.menu.show();
        }
    }

    generateGroundTiles() {

        // We'll use this array to determine the type of ground to create
        let tileTypes = [
            'NORMAL_GROUND',
            'SMALL_GROUND',
            'HOLE',
            'GROUND_WITH_TOTAL_OBSTACLE',
            'GROUND_WITH_HIGH_OBSTACLE'
        ];
        
        // Let's generate the next 10 ground tiles (or holes :D) - 100 "meters" or tiles
        for(var generatedTilesNumber = 0; generatedTilesNumber < 10; generatedTilesNumber++) {
            
            let tyleType = 'NORMAL_GROUND';
            this.generatedTilesNumber++;

            // If the player is starting to play (first 50 'meters'), creates normal ground tiles
            if(this.generatedTilesNumber > 5) {
                // Choose a tyle type randomly
                let randomTileTypeNumber = Math.floor((Math.random() * tileTypes.length));
                tyleType = tileTypes[randomTileTypeNumber];
            }

            // Prevents generating multiple holes or tiles with obstacles in sequence
            if((this.lastTileType != 'NORMAL_GROUND') && (tyleType != 'NORMAL_GROUND')) {
                tyleType = 'NORMAL_GROUND';
            }

            this.lastTileType = tyleType;

            if(tyleType == 'NORMAL_GROUND') {
                this.createNormalGroundTile();
            }

            if(tyleType == 'SMALL_GROUND') {
                this.createSmallGroundTile();
            }

            if(tyleType == 'HOLE') {
                this.createHoleTile();
            }

            if(tyleType == 'GROUND_WITH_TOTAL_OBSTACLE') {
                this.generateGroundTilesWithObstacleTile();
            }

            if(tyleType == 'GROUND_WITH_HIGH_OBSTACLE') {
                this.generateGroundTilesWithHighObstacleTile();
            }

        }

    }

    createTile(options) {

        options = options ? options : { width: 1, height: 1, depth: this.tileDepth };

        let tile = BABYLON.MeshBuilder.CreateBox("groundTile" + this.generatedTilesNumber, options, this.scene);

        let tileMaterial = new BABYLON.StandardMaterial("tileMaterial", this.scene);
            
        tile.position.z = ((this.generatedTilesNumber - 1) * this.tileDepth);
        tile.position.y = -0.5;

        tileMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        tile.material = tileMaterial;

        tile.checkCollisions = true;

        // Intercaling the ground color
        if((this.generatedTilesNumber % 2) == 0) {
            tile.material.diffuseColor = new BABYLON.Color3(0.8, 0.3, 0.3);
        }

        // Freeze material to improve performance (this material will not be modified)
        tileMaterial.freeze();

        // Freeze transformations in this tile to improve performance
        //tile.freezeWorldMatrix();

        return tile;

    }

    createNormalGroundTile() {
        this.createTile();
    }

    createSmallGroundTile() {
        let tile = this.createTile({ width: 0.3333, height: 1, depth: this.tileDepth});
        
        // Choose the side to place the ground
        let randomSideChooser = Math.floor((Math.random() * 100) + 1);

        tile.position.x = (randomSideChooser <= 50) ? -0.3333 : 0.3333;
        tile.position.y = -0.5;
    }

    createHoleTile(tileNumber) {
    }

    generateGroundTilesWithObstacleTile() {

        let tile = this.createTile();
        let obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {width: 1, height: 0.25, depth: 0.25}, this.scene);

        obstacle.position.z = tile.position.z;
        obstacle.position.y = 0.125;

    }

    generateGroundTilesWithHighObstacleTile(tileNumber) {

        let tile = this.createTile(tileNumber);
        let obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {width: 2, height: 2, depth: 0.25}, this.scene);

        obstacle.position.z = tile.position.z;
        obstacle.position.y = 1.5;

        // Player dies when intersects this obstacle
        let playerMesh = this.player.getMesh();
        obstacle.actionManager = new BABYLON.ActionManager(this.scene);
        obstacle.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: playerMesh
                },
                () => { this.player.die() }
            )
        );

    }

    beforeRender() {
        if(!GAME.isPaused()) {

            this.player.move();
    
            // If player travelled distance was reseted (is lower than 70),
            // then I can dispose old tiles and allow to generate more ground tiles
            if(this.player.getTravelledDistance() < 10 && !this.canGenerateMoreTiles) {
                this.disposeOldTiles();
                this.canGenerateMoreTiles = true;
            }
    
            // If player has travelled more 70 "meters", needs to generate more ground tiles,
            // and block more tiles generation until that the distance was reseted
            if(this.player.getTravelledDistance() >= 70 && this.canGenerateMoreTiles) {
                this.generateGroundTiles();
                this.canGenerateMoreTiles = false;
            }

        }

    }

    replay() {
        
        this.disposeAllTiles();
        this.player.reset();

        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
        this.generateGroundTiles();
        
        this.menu.hide();
        GAME.resume();

    }

    /**
     * Disposes old tiles and obstacles (last 10 unused tiles and their obstacles)
     */
    disposeOldTiles() {
        let fromTile = this.generatedTilesNumber - 20,
            toTile = this.generatedTilesNumber - 10;

        this.disposeTiles(fromTile, toTile);
    }

    /**
     * Disposes all level tiles to restart the level
     */
    disposeAllTiles() {
        this.disposeTiles(0, this.generatedTilesNumber);
    }

    /**
     * Disposes the level tiles using the specified identifiers
     * @param {*} fromTile 
     * @param {*} toTile 
     */
    disposeTiles(fromTile, toTile) {
        let meshToDispose = null;
        
        for(; fromTile < toTile; fromTile++) {
            let tileName = 'groundTile' + fromTile,
                obstacleName = 'obstacleTile' + fromTile;
            
            if(meshToDispose = this.scene.getMeshByName(tileName)) {
                meshToDispose.dispose();
            }

            if(meshToDispose = this.scene.getMeshByName(obstacleName)) {
                meshToDispose.dispose();
            }
        }
    }
    
}