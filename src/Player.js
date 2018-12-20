class Player {

    constructor(scene) {
        
        this.scene = scene;

        this.statuses = {
            'RUNNING': true,
            'JUMPING': false,
            'DRAGGING': false,
            'FALLING_DOWN' : false,
            'SLOW' : false,
            'DEAD': false
        };

        /**
         * HUD Controls
         */
        this.coinsTextControl = null;
        this.metersTextControl = null;

        /**
         * SOUNDS
         */
        this.dieSound = null;
        this.jumpSound = null;
        this.damageSound = null;
        this.gotCoinSound = null;

        /**
         * Set it to true to make the player indestructible for tests
         */
        this.godMode = false;

        this.defaultSpeed = 15;
        this.speed = this.defaultSpeed;

        this.gravity = -9;
        
        /**
         * Stores the player last altitude to check if the player is falling down
         */
        this.jumpForce = 50;
        this.jumpMaxAltitude = 4.7;
        
        // Stores the last player altitude from every frame
        this.defaultAltitude = 0.25;
        this.lastAltitude = this.defaultAltitude;
        
        this.coins = 0;

        this.onDie = null;

        /**
         * Used to store the travelled distance and calculate where to generate more level tiles
         * and to give points to the player
         * The travelledDistance will reset each 100 "meters". When travelledDistance is equal to 70
         * the Level will generate more tiles
         */
        this.travelledDistance = 0;
        this.totalTravelledDistance = 0;

        this.setupPlayer();

    }

    setupPlayer() {
        
        this.dieSound = new BABYLON.Sound('playerDieSound', '/assets/sounds/game-die.mp3', this.scene, null, {volume: 0.4});
        this.gotCoinSound = new BABYLON.Sound('gotCoinSound', '/assets/sounds/coin-c-09.wav', this.scene);
        this.damageSound = new BABYLON.Sound('damageSound', '/assets/sounds/damage.wav', this.scene);


        /**
         * Method to set an ellipsoid (for collision) based on boundingbox size 
         */ 
        BABYLON.Mesh.prototype.setEllipsoidPerBoundingBox = function(scene) {
            var bi = this.getBoundingInfo();
            var bb = bi.boundingBox;
            this.ellipsoid = bb.maximumWorld.subtract(bb.minimumWorld).scale(0.5);
        }

        this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
            width: 0.3333333, 
            height: 0.5, 
            depth: 0.3333333
        }, this.scene);

        this.mesh.position.y = this.defaultAltitude;

        let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3(0.71, 0.08, 0.25);

        this.mesh.material = playerMaterial;

        this.mesh.setEllipsoidPerBoundingBox();

        this.setupAnimations();
        this.createHUD();

        //GAME.drawEllipsoid(this.mesh);

    }

    setupAnimations() {
        let blinkAnimation = new BABYLON.Animation("blinkAnimation", "material.alpha", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = []; 

        //At the animation key 0, the value of alpha is "1"
        keys.push({ frame: 0, value: 1 });

        //At the animation key 15, the value of alpha is "0.2"
        keys.push({ frame: 15, value: 0.2 });

        //At the animation key 30, the value of alpha is "1"
        keys.push({ frame: 30, value: 1 });

        blinkAnimation.setKeys(keys);

        this.mesh.animations = [];
        this.mesh.animations.push(blinkAnimation);
    }

    createHUD() {
        this.hud = new UI('playerHudUI');
        
        this.metersTextControl = this.hud.addText('Meters: 0', {
            'top': '10px',
            'left': '10px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });

        this.coinsTextControl = this.hud.addText('Coins: 0', {
            'top': '10px',
            'left': '-10px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
    }

    setStatus(status, value = true) {
        this.statuses[status] = value;
    }

    getMesh() {
        return this.mesh;
    }

    damage() {
        this.damageSound.play();
        this.blink();
        this.speed = this.defaultSpeed / 2.5;
        
        this.setStatus('SLOW', true);

        setTimeout(() => {
            this.setStatus('SLOW', false);
            this.speed = this.defaultSpeed;
        }, 1500);

    }

    blink() {
        let blinkAnimation = this.scene.beginAnimation(this.mesh, 0, 30, true);

        setTimeout(() => {
            blinkAnimation.pause();
            this.mesh.material.alpha = 1;
        }, 1500);
    }

    move() {

        if(this.statuses.DEAD) return;

        let animationRatio = (this.scene.getAnimationRatio() / 50),
            gravity = (this.godMode) ? 0 : (this.gravity  * animationRatio),
            jump = (this.statuses.JUMPING && !this.statuses.FALLING_DOWN) ? this.jumpForce  * animationRatio : 0,
            runSpeed = this.speed * animationRatio;

        // If is jumping, multiply the speed by 1.5
        runSpeed *= (this.statuses.JUMPING) ? 1.5 : 1;
        
        this.mesh.moveWithCollisions(new BABYLON.Vector3(
            0, 
            gravity + jump, 
            runSpeed
        ));
        
        this.checkPlayerLateralMovement(animationRatio);
        this.calculateTravelledDistance(animationRatio);
        
        this.checkPlayerJump();
        this.checkPlayerAltitude();
        this.checkPlayerDragging();
        

        if(this.mesh.position.y <= -2 && !this.statuses.DEAD) {
            this.setStatus('DEAD', true);
            this.die();
        }

    }

    calculateTravelledDistance(animationRatio) {
        if(this.travelledDistance >= 100) {
            this.travelledDistance = 0;
        }

        this.travelledDistance += this.speed * animationRatio;
        this.totalTravelledDistance += this.speed * animationRatio;

        this.metersTextControl.text = 'Meters: ' + Math.floor(this.totalTravelledDistance);
    }

    checkPlayerAltitude() {
        if(this.mesh.position.y < this.lastAltitude) {
            this.setStatus('FALLING_DOWN', true);
        } else {
            this.setStatus('FALLING_DOWN', false);
        }

        this.lastAltitude = this.mesh.position.y;
    }

    checkPlayerLateralMovement(animationRatio) {
        if(GAME.keys.left && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
            this.mesh.position.x -= (this.speed / 5) * animationRatio;
        }

        if(GAME.keys.right && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
            this.mesh.position.x += (this.speed / 5) * animationRatio;
        }
    }

    checkPlayerJump() {
        if(GAME.keys.up && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
            this.setStatus('JUMPING', true);
        }

        /**
         * If the player reaches the jump max altitude, then we change JUMPING status to false
         * and "hack" the lastAltitude adding more 1 unit (it is necessary because the method checkPlayerAltitude will
         * detect FALLING_DOWN only on the next animation frame if we dont make it, 
         * and it will crash the method checkPlayerDragging, immediataly setting the player position 
         * to the initial position)
         */
        if(this.mesh.position.y >= this.jumpMaxAltitude && this.statuses.JUMPING) {
            this.lastAltitude = this.lastAltitude + 1; // Hacking lastAltitude (explained above)
            this.setStatus('JUMPING', false);
        }
    }

    checkPlayerDragging() {
        if(GAME.keys.down) {
            
            this.setStatus('DRAGGING', true);
            this.mesh.scaling.y = 0.5;
            this.mesh.setEllipsoidPerBoundingBox();
            this.speed = this.defaultSpeed * 1.5;
            
        } else {
            
            if(!this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
                this.mesh.position.y = this.defaultAltitude;
            }

            this.setStatus('DRAGGING', false);
            this.mesh.scaling.y = 1;
            this.mesh.setEllipsoidPerBoundingBox();
            
            if(!this.statuses.SLOW) {
                this.speed = this.defaultSpeed;
            }
            
        }
        
    }

    getTravelledDistance() {
        return this.travelledDistance;
    }

    keepCoin() {
        this.coins++;
        this.coinsTextControl.text = 'Coins: ' + this.coins;
        this.gotCoinSound.play();
    }

    reset() {
        
        this.setStatus('DEAD', false);
        this.setStatus('JUMPING', false);
        this.setStatus('FALLING_DOWN', false);
        this.setStatus('DRAGGING', false);
        
        this.mesh.position.x = 0;
        this.mesh.position.y = this.defaultAltitude;
        this.mesh.position.z = 0;
        this.travelledDistance = 0;
        this.totalTravelledDistance = 0;
        
    }

    die() {
        
        this.dieSound.play();

        if(this.onDie && !this.godMode) {
            this.onDie();
        }
    }

}