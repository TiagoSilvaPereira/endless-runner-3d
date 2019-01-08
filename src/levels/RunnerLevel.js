class RunnerLevel extends Level {

    setProperties() {

        this.player = null;
        this.monster = null;

        // Tiles generation control properties
        this.tileDepth = 10;
        this.maxTilesAtTime = 20;
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
        this.generatedTilesBlocksNumber = 0;

        // Menu
        this.menu = null;
        this.pointsTextControl = null;
        this.currentRecordTextControl = null;
        this.hasMadeRecordTextControl = null;
        
    }

    buildScene() {
        
        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');

        this.createCommonMaterials();

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

        this.generateGroundTiles();

    }

    createCommonMaterials() {
        
        let coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
        coinMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.coinColor);
        coinMaterial.emissiveColor = new BABYLON.Color3.FromHexString(GAME.options.coinColor);

        let tileMaterialLight = new BABYLON.StandardMaterial("tileMaterialLight", this.scene);
        tileMaterialLight.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.tileLightColor);
        
        let tileMaterialDark = new BABYLON.StandardMaterial("tileMaterialDark", this.scene);
        tileMaterialDark.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.tileDarkColor);

        let hazardMaterial = new BABYLON.StandardMaterial("hazardMaterial", this.scene);
        hazardMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.hazardColor);
        hazardMaterial.alpha = 0.6;
        
        // Freeze materials to improve performance (this material will not be modified)
        coinMaterial.freeze();
        tileMaterialLight.freeze();
        tileMaterialDark.freeze();
        hazardMaterial.freeze();

        this.addMaterial(coinMaterial);
        this.addMaterial(tileMaterialLight);
        this.addMaterial(tileMaterialDark);
        this.addMaterial(hazardMaterial);
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
        this.player = new Player(this.scene);
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
                visible: false,
                disposeAfterCollision: true,
                collisionMesh: this.player.getMesh(),
                positionZ: ((this.generatedTilesNumber - 1) * this.tileDepth),
            };

            // If is the first tile at time (skips first generation because it is not necessary), 
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
                    this.generateGroundTiles();
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
            'GROUND_WITH_TOTAL_OBSTACLE',
            'HOLE', // If the tile is HOLE, we'll don't generate anything
            'NORMAL_GROUND',
            'NORMAL_GROUND',
            'GROUND_WITH_TOTAL_OBSTACLE',
            'NORMAL_GROUND',
            'GROUND_WITH_HIGH_OBSTACLE',
            'HOLE',
            'SMALL_GROUND',
        ],

        tyleType = 'NORMAL_GROUND';

        // If the player is starting to play (first 200 'meters'), creates normal ground tiles,
        // else, choose a tyle type randomly
        if(this.generatedTilesNumber > 20) {
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
            this.createTileWithObstacleTile();
        }

        if(tyleType == 'GROUND_WITH_HIGH_OBSTACLE') {
            this.createTileWithHighObstacleTile();
        }
    }

    createTile(options) {

        options = options ? options : { width: GAME.options.level.tileWidth, height: 1, depth: this.tileDepth };

        let tile = BABYLON.MeshBuilder.CreateBox("groundTile" + this.generatedTilesNumber, options, this.scene);
        BABYLON.Tags.AddTagsTo(tile, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
        
        tile.receiveShadows = true;
            
        tile.position.z = ((this.generatedTilesNumber - 1) * this.tileDepth);
        tile.position.y = -0.5;

        tile.checkCollisions = true;

        tile.material = ((this.generatedTilesNumber % 2) == 0) ? this.getMaterial('tileMaterialLight') : this.getMaterial('tileMaterialDark');


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
                positionX = -0.3333; // Positining on the left
            }
            
            if(randomPositionChooser >= 66) {
                positionX = 0.3333; // Positioning on the right
            }
        }

        for(var coinsNumber = 0; coinsNumber < 5; coinsNumber++) {

            let coin = BABYLON.MeshBuilder.CreateBox("coin" + coinsNumber + this.generatedTilesNumber, {width: 0.1, height: 0.1, depth: 0.1}, this.scene);
            BABYLON.Tags.AddTagsTo(coin, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
            
            coin.material = this.getMaterial('coinMaterial');
            
            coin.position.x = positionX;
            coin.position.z = (tile.position.z - (this.tileDepth / 2)) + (coinsNumber * 2);
            coin.position.y = 0.3;

            /**
             * If the player collides with the Coin, we'll keep the coin and then interpolate
             * the coin altitude to up
             */
            let playerMesh = this.player.getMesh();
            coin.executeOnIntersection(playerMesh, () => {
                this.player.keepCoin();
                this.interpolate(coin.position, 'y', 10, 500);
            }, true);

        }
    }

    createNormalGroundTile() {
        let tile = this.createTile();
        
        // 60% chances to generate coins on the tile
        if(Math.floor((Math.random() * 100)) > 40) {
            this.createCoins(tile, true);
        }
    }

    createSmallGroundTile() {
        let tile = this.createTile({ width: GAME.options.level.smallTileWidth, height: 1, depth: this.tileDepth});
        
        // Choose the side to place the ground
        let randomSideChooser = Math.floor((Math.random() * 100) + 1);

        tile.position.x = (randomSideChooser <= 50) ? -0.3333 : 0.3333;
        tile.position.y = -0.5;

        // Small tiles always have coins
        this.createCoins(tile);
    }

    createTileWithObstacleTile() {

        let tile = this.createTile();
        let obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {width: GAME.options.level.hazardWidth, height: 0.05, depth: 8.25}, this.scene);
        BABYLON.Tags.AddTagsTo(obstacle, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
        
        obstacle.position.z = tile.position.z;
        obstacle.position.y = 0.0025;
        obstacle.material = this.getMaterial('hazardMaterial');

        // Player dies when intersects this obstacle
        let playerMesh = this.player.getMesh();
        obstacle.executeOnIntersection(playerMesh, () => {
            
            this.player.damage();
                    
            if(this.monster.isCloseToPlayer()) {
                this.monster.attackPlayer();
            } else {
                this.monster.approachToPlayer();
            }

        }, true);

    }

    createTileWithHighObstacleTile(tileNumber) {

        let tile = this.createTile(tileNumber);
        let obstacle = BABYLON.MeshBuilder.CreateBox("obstacleTile" + this.generatedTilesNumber, {width: 2, height: 2, depth: 0.25}, this.scene);
        BABYLON.Tags.AddTagsTo(obstacle, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
        
        obstacle.position.z = tile.position.z;
        obstacle.position.y = 1.5;

        // Tiles with high obstacle always have coins
        this.createCoins(tile, true);

        // Player dies when intersects this obstacle
        let playerMesh = this.player.getMesh();
        obstacle.executeOnIntersection(playerMesh, () => this.player.die(), true);

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
        this.disposeColliders();
        this.disposeAllTiles();

        this.player.reset();
        this.monster.approachToPlayer();

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