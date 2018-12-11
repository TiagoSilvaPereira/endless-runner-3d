class Coin {

    constructor(name, level, tile) {

        this.name = '';
        this.level = level;
        this.tile = tile;

        this.positionX = 0;

    }

    setPositionX(positionX) {
        this.positionX = positionX;
    }

    create() {
        
        let coinMaterial = new BABYLON.StandardMaterial('coinMaterial');
        coinMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);
        coinMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.4, 0);

        let coin = BABYLON.MeshBuilder.CreateBox(
            this.name,
            {width: 0.1, height: 0.1, depth: 0.1}, 
            this.level.scene
        );

        BABYLON.Tags.AddTagsTo(coin, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);
        
        coin.material = coinMaterial.clone();
        
        coin.position.x = this.positionX;
        coin.position.z = (tile.position.z - (this.tileDepth / 2)) + (coinsNumber * 2);
        coin.position.y = 0.3;

        coin = this.addCollisions(coin);

        return coin;
    }

    addCollisions(coin) {

        let playerMesh = this.level.player.getMesh();
        coin.actionManager = new BABYLON.ActionManager(this.level.scene);

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

                    this.level.scene.actionManager.registerAction(interpolateCoinAltitudeAction);
                    interpolateCoinAltitudeAction.execute();

                    this.level.player.keepCoin() 
                }
            )
        );

        return coin;
    }

}