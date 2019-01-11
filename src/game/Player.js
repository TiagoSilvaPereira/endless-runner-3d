import UI from '../base/UI';

export default class Player {

    constructor(level) {
        
        this.level = level;
        this.scene = level.scene;

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

        this.defaultSpeed = GAME.options.player.defaultSpeed;
        this.speed = this.defaultSpeed;

        this.gravity = GAME.options.player.gravity;
        
        /**
         * Stores the player last altitude to check if the player is falling down
         */
        this.jumpForce = GAME.options.player.jumpForce;
        this.jumpMaxAltitude = GAME.options.player.jumpMaxAltitude;
        
        // Stores the last player altitude from every frame
        this.defaultAltitude = 0.25;
        this.lastAltitude = this.defaultAltitude;
        
        this.coins = 0;
        this.points = 0;
        this.pointsRecord = false;

        // How many times the user was damaged at time
        this.damages = 0;

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
        
        this.dieSound = this.level.assets.getSound('playerDieSound');
        this.gotCoinSound = this.level.assets.getSound('gotCoinSound');
        this.damageSound = this.level.assets.getSound('damageSound');

        this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
            width: 0.3333333, 
            height: 0.5, 
            depth: 0.3333333
        }, this.scene);

        this.mesh.position.y = this.defaultAltitude;

        let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.playerColor);

        this.mesh.material = playerMaterial;

        // Adds the collision ellipsoid fitting it on the Player "Box" mesh
        this.mesh.setEllipsoidPerBoundingBox();

        this.setupAnimations();
        this.createHUD();

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

    getMesh() {
        return this.mesh;
    }

    damage() {

        this.damages++;
        
        this.damageSound.play();
        this.blink();
        this.speed = this.defaultSpeed / 2;
        
        this.statuses.SLOW = true;

        setTimeout(() => {
            this.statuses.SLOW = false;
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
            this.statuses.FALLING_DOWN = true;
        } else {
            this.statuses.FALLING_DOWN = false;
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
            this.statuses.JUMPING = true;
        }

        /**
         * If the player reaches the jump max altitude, then we change JUMPING status to false
         * and "hack" the lastAltitude adding more 100 units (it is necessary because the method checkPlayerAltitude will
         * detect FALLING_DOWN only on the next animation frame if we dont make it, 
         * and it will crash the method checkPlayerDragging, immediataly setting the player position 
         * to the initial position. Then we addd a big number to lastAltitude to prevent it)
         */
        if(this.mesh.position.y >= this.jumpMaxAltitude && this.statuses.JUMPING) {
            this.lastAltitude = this.lastAltitude + 100; // Hacking lastAltitude (explained above)
            this.statuses.FALLING_DOWN = true;
            this.statuses.JUMPING = false;
        }
    }

    checkPlayerDragging() {

        if(GAME.keys.down) {
            
            if(!this.statuses.DRAGGING) {
                this.statuses.DRAGGING = true;
                this.speed = this.defaultSpeed * 1.5;

                // Smoothly interpolate the Player height to a half and then, readjust
                // the collision ellipsoid
                this.level.interpolate(this.mesh.scaling, 'y', 0.5, 100, () => {
                    // Manually reseting the collision ellipsoid height (mesh height/4)
                    this.mesh.ellipsoid.y = 0.125;
                });

                setTimeout(() => {
                    this.statuses.DRAGGING = false;

                    // Manually reseting the collision ellipsoid height (future mesh height/4)
                    // We need to make it before interpolation to avoid collision problems during 
                    // the interpolation proccess
                    this.mesh.ellipsoid.y = 0.25;

                    // Return the player to the normal height
                    this.level.interpolate(this.mesh.scaling, 'y', 1, 100);
                }, 700);
            }
            
        } else {

            if(!this.statuses.DRAGGING) {
                if(!this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
                    this.mesh.position.y = this.defaultAltitude;
                }
                
                if(!this.statuses.SLOW) {
                    this.speed = this.defaultSpeed;
                }
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
        
        this.statuses.DEAD = false;
        this.statuses.JUMPING = false;
        this.statuses.FALLING_DOWN = false;
        this.statuses.DRAGGING = false;
        
        this.coins = 0;
        this.damages = 0;
        this.mesh.position.x = 0;
        this.mesh.position.y = this.defaultAltitude;
        this.mesh.position.z = 0;
        this.travelledDistance = 0;
        this.totalTravelledDistance = 0;
        
    }

    die() {

        if(this.godMode) return;

        this.statuses.DEAD = true;
        this.dieSound.play();

        if(this.onDie) {
            this.onDie();
        }

    }

    getPoints() {
        return this.points;
    }

    calculatePoints() {
        this.points = 0;

        this.points += (this.coins * 10);
        this.points += this.totalTravelledDistance;
        this.points -= (this.damages * 5);

        this.points = (this.points > 0) ? this.points.toFixed(0) : 0;

        this.checkAndSaveRecord(this.points);

        return this.points;
    }

    checkAndSaveRecord(points) {
        let lastRecord = 0;

        this.pointsRecord = false;

        if(window.localStorage['last_record']) {
            lastRecord = parseInt(window.localStorage['last_record'], 10);
        }

        if(lastRecord < points) {
            this.pointsRecord =  true;
            window.localStorage['last_record'] = points;
        }
    }

    hasMadePointsRecord() {
        return this.pointsRecord;
    }

    getLastRecord() {
        return window.localStorage['last_record'] || 0;
    }


}