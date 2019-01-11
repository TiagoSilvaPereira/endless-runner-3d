export default class TilesGenerator {

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.monster = level.monster;

        /**
         * Default tiles properties
         */
        this.tileDepth = 10;
        this.maxTilesAtTime = 20;
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
        this.generatedTilesBlocksNumber = 0;

        this.createCommonMaterials();

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

        this.level.addMaterial(coinMaterial);
        this.level.addMaterial(tileMaterialLight);
        this.level.addMaterial(tileMaterialDark);
        this.level.addMaterial(hazardMaterial);

    }

    generate() {
        
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
                
                this.level.addCollider('deleteOldTilesCollider', colliderOptions);

            }

            // If is the tenth tile (10), we'll add a collider to generate more tile when collides with it
            if(currentTilesNumber == 10) {
                
                // Copy default options
                let colliderOptions = Object.assign({}, collidersDefaultOptions);
                colliderOptions.onCollide = () => {
                    this.generate();
                }

                this.level.addCollider('generateMoreTilesCollider', colliderOptions);
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

        tile.material = ((this.generatedTilesNumber % 2) == 0) ? this.level.getMaterial('tileMaterialLight') : this.level.getMaterial('tileMaterialDark');


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
            
            coin.material = this.level.getMaterial('coinMaterial');
            
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
                this.level.interpolate(coin.position, 'y', 10, 500);
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
        obstacle.material = this.level.getMaterial('hazardMaterial');

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
    disposeAll() {
        let tilesBlocks = this.scene.getMeshesByTags('tilesBlock');

        for(var index = 0; index < tilesBlocks.length; index++) {
            tilesBlocks[index].dispose();
        }
    }

    reset() {
        this.disposeAll();
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
    }

}