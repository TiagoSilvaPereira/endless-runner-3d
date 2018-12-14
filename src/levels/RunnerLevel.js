class RunnerLevel extends Level {

    constructor() {
        
        super();

        this.scene = null;
        this.player = null;
        this.pursuer = null;

        this.gotCoinSound = null;
        this.playerDieSound = null;

        // Tiles generation control properties
        this.tileDepth = 10;
        this.holeDepth = 10;
        this.maxTilesAtTime = 20;
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
        this.generatedTilesBlocksNumber = 0;

    }

    createScene() {

        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);
        this.scene.gravity = new BABYLON.Vector3(0, -9.81, 0);

        var music = new BABYLON.Sound('music', '/assets/musics/Guitar-Mayhem.mp3', this.scene, null, { loop: true, autoplay: true, volume: 0.7 });
        this.gotCoinSound = new BABYLON.Sound('gotCoinSound', '/assets/sounds/coin-c-09.wav', this.scene);
        this.playerDieSound = new BABYLON.Sound('playerDieSound', '/assets/sounds/game-die.mp3', this.scene, null, {volume: 0.4});

        // Adding an action manager to this scene
        this.scene.actionManager = new BABYLON.ActionManager(this.scene);

        this.createCommonMaterials();

        this.createMenu();

        var camera = this.createArcCamera();

        // This attaches the camera to the canvas
        this.scene.activeCamera = camera;
        camera.attachControl(GAME.canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 100, -100), this.scene);
        light2.intensity = 0.4;

        var skyboxMaterial = new BABYLON.SkyMaterial("skyMaterial", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.inclination = -0.3;
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, this.scene);
        skybox.material = skyboxMaterial;
        skybox.infiniteDistance = true;

        this.createPlayer();
        this.createPursuer();

        this.generateGroundTiles();


        this.scene.registerBeforeRender(
            this.beforeRender.bind(this)
        );

        return this.scene;

    }

    createCommonMaterials() {
        let coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
        coinMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);
        coinMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0);

        let tileMaterialWhite = new BABYLON.StandardMaterial("tileMaterialWhite", this.scene);
        tileMaterialWhite.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        
        let tileMaterialRed = new BABYLON.StandardMaterial("tileMaterialRed", this.scene);
        tileMaterialRed.diffuseColor = new BABYLON.Color3(0.8, 0.3, 0.3);
        
        // Freeze materials to improve performance (this material will not be modified)
        coinMaterial.freeze();
        tileMaterialWhite.freeze();
        tileMaterialRed.freeze();

        this.addMaterial(coinMaterial);
        this.addMaterial(tileMaterialWhite);
        this.addMaterial(tileMaterialRed);
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
        this.player = new Player(this.scene);
        this.scene.activeCamera.target = this.player.getMesh();
        this.scene.activeCamera.lockedTarget = this.player.getMesh();

        // Actions when player dies
        this.player.onDie = () => {
            this.playerDieSound.play();
            GAME.pause();
            this.menu.show();
        }
    }

    createPursuer() {
        this.pursuer = new Pursuer(this);
    }

    generateGroundTiles() {
        
        // Increases the number of generated tile blocks (to add tags on objects and easily dispose them)
        this.generatedTilesBlocksNumber += 1;
        
        // Let's generate the next 20 ground tiles (or holes :D) - 200 "meters" of tiles
        for(var currentTilesNumber = 1; currentTilesNumber <= this.maxTilesAtTime; currentTilesNumber++) {
            
            // Increment the global level number of generated tiles
            this.generatedTilesNumber += 1;

            // Colliders default options (the colliders will be used to throw actions actions like: dispose old tiles, 
            // generate more tiles, etc)
            // Set visible to true to see the colliders on the scene
            let collidersDefaultOptions = {
                width: 100, 
                height: 100, 
                depth: 1,
                x:0, 
                y: 0, 
                z: ((this.generatedTilesNumber - 1) * this.tileDepth),
                collisionMesh: this.player.getMesh(),
                visible: false,
                disposeAfterCollision: true
            };

            // If is the first tile at time (skips first generation because is not necessary), 
            // adds a collider (this collider will be used to delete the old tiles)
            // whenever the player intersects it.
            if(currentTilesNumber == 1 && this.generatedTilesNumber != 1) {
            
                // Copy default options
                let colliderOptions = Object.assign({}, collidersDefaultOptions);
                colliderOptions.onCollide = () => {
                    this.disposeOldTiles();
                }
                
                this.addCollider('deleteOldTilesCollider', colliderOptions);

            }

            // If is the tenth tile (10), we'll add a collider to generate more tile when collides with it
            if(currentTilesNumber == 10) {
                
                // Copy default options
                let colliderOptions = Object.assign({}, collidersDefaultOptions);
                colliderOptions.onCollide = () => {
                    this.generateGroundTiles()
                }

                this.addCollider('generateMoreTilesCollider', colliderOptions);
            }

            this.createTiles();

        }

    }

    createTiles() {

        /**
         * We'll use this array to determine the type of ground to create. We are 
         * repeating the NORMAL_GROUND type to decrease the chances of generating
         * obstacles and holes. It is an easy way to control the chances to add obstacles
         * and holes
         */
        let tileTypes = [
            'NORMAL_GROUND',
            'SMALL_GROUND',
            'NORMAL_GROUND',
            'NORMAL_GROUND',
            'HOLE', // If the tile is HOLE, we'll don't generate anything
            'NORMAL_GROUND',
            'NORMAL_GROUND',
            'GROUND_WITH_TOTAL_OBSTACLE',
            'NORMAL_GROUND',
            'GROUND_WITH_HIGH_OBSTACLE'
        ], 
        tyleType = 'NORMAL_GROUND';

        // If the player is starting to play (first 200 'meters'), creates normal ground tiles
        if(this.generatedTilesNumber > 20) {
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

        if(tyleType == 'GROUND_WITH_TOTAL_OBSTACLE') {
            this.generateGroundTilesWithObstacleTile();
        }

        if(tyleType == 'GROUND_WITH_HIGH_OBSTACLE') {
            this.generateGroundTilesWithHighObstacleTile();
        }
    }

    createTile(options) {

        options = options ? options : { width: 1, height: 1, depth: this.tileDepth };

        let tile = BABYLON.MeshBuilder.CreateBox("groundTile" + this.generatedTilesNumber, options, this.scene);
        BABYLON.Tags.AddTagsTo(tile, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
            
        tile.position.z = ((this.generatedTilesNumber - 1) * this.tileDepth);
        tile.position.y = -0.5;

        tile.checkCollisions = true;

        tile.material = ((this.generatedTilesNumber % 2) == 0) ? this.getMaterial('tileMaterialWhite') : this.getMaterial('tileMaterialRed');

        return tile;

    }

    /**
     * Create coins for an specific tile 
     * @param {*} tile 
     */
    createCoins(tile, randomPosition = false) {

        let positionX = tile.position.x;
        
        if(randomPosition) {
            let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number

            if(randomPositionChooser <= 33) {
                positionX = -0.3333;
            }
            
            if(randomPositionChooser >= 66) {
                positionX = 0.3333;
            }
        }

        for(var coinsNumber = 0; coinsNumber < 5; coinsNumber++) {

            let coin = BABYLON.MeshBuilder.CreateBox("coin" + coinsNumber + this.generatedTilesNumber, {width: 0.1, height: 0.1, depth: 0.1}, this.scene);
            BABYLON.Tags.AddTagsTo(coin, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
            
            coin.material = this.getMaterial('coinMaterial');
            
            coin.position.x = positionX;
            coin.position.z = (tile.position.z - (this.tileDepth / 2)) + (coinsNumber * 2);
            coin.position.y = 0.3;

            let playerMesh = this.player.getMesh();
            coin.actionManager = new BABYLON.ActionManager(this.scene);
            
            /**
             * If the player collides with the Coin, we'll keep the coin and then interpolate
             * the coin altitude to up
             */
            coin.actionManager.registerAction(
                new BABYLON.ExecuteCodeAction(
                    {
                        trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                        parameter: playerMesh
                    },
                    () => { 

                        let interpolateCoinAltitudeAction = new BABYLON.InterpolateValueAction(
                            BABYLON.ActionManager.NothingTrigger,
                            coin.position,
                            'y',
                            10,
                            500 // 500 ms
                        );

                        this.scene.actionManager.registerAction(interpolateCoinAltitudeAction);
                        interpolateCoinAltitudeAction.execute();

                        this.player.keepCoin();
                        this.gotCoinSound.play();
                    }
                )
            );

        }
    }

    createNormalGroundTile() {
        let tile = this.createTile();
        
        // 40% chances to generate coins on the tile
        if(Math.floor((Math.random() * 100)) > 60) {
            this.createCoins(tile, true);
        }
    }

    createSmallGroundTile() {
        let tile = this.createTile({ width: 0.3333, height: 1, depth: this.tileDepth});
        
        // Choose the side to place the ground
        let randomSideChooser = Math.floor((Math.random() * 100) + 1);

        tile.position.x = (randomSideChooser <= 50) ? -0.3333 : 0.3333;
        tile.position.y = -0.5;

        // Small tiles always have coins
        this.createCoins(tile);
    }

    generateGroundTilesWithObstacleTile() {

        let tile = this.createTile();
        let obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {width: 1, height: 0.25, depth: 0.25}, this.scene);
        BABYLON.Tags.AddTagsTo(obstacle, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
        
        obstacle.position.z = tile.position.z;
        obstacle.position.y = 0.125;

        // Player dies when intersects this obstacle
        let playerMesh = this.player.getMesh();
        obstacle.actionManager = new BABYLON.ActionManager(this.scene);
        obstacle.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: playerMesh
                },
                () => { this.pursuer.approachToChased() }
            )
        );

    }

    generateGroundTilesWithHighObstacleTile(tileNumber) {

        let tile = this.createTile(tileNumber);
        let obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {width: 2, height: 2, depth: 0.25}, this.scene);
        BABYLON.Tags.AddTagsTo(obstacle, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
        
        obstacle.position.z = tile.position.z;
        obstacle.position.y = 1.5;

        // Tiles with high obstacle always have coins
        this.createCoins(tile, true);

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
            this.pursuer.move();
        }
    }

    replay() {
        
        /**
         * Wee need to dispose the current colliders and tiles on scene to prevent trash objects
         */
        this.disposeColliders();
        this.disposeAllTiles();

        this.player.reset();
        this.pursuer.approachToChased();

        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
        this.generateGroundTiles();
        
        this.menu.hide();
        GAME.resume();

    }

    /**
     * Disposes old tiles and obstacles (last 20 unused tiles and their obstacles)
     */
    disposeOldTiles() {
        let lastTilesBlock = this.generatedTilesBlocksNumber - 1,
            tilesBlocks = this.scene.getMeshesByTags('tilesBlock' + lastTilesBlock);

        for(var index = 0; index < tilesBlocks.length; index++) {
            tilesBlocks[index].dispose();
        }
    }

    /**
     * Disposes all level tiles to restart the level
     */
    disposeAllTiles() {
        let tilesBlocks = this.scene.getMeshesByTags('tilesBlock');

        for(var index = 0; index < tilesBlocks.length; index++) {
            tilesBlocks[index].dispose();
        }
    }
    
}