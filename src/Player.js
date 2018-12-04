class Player {

    constructor(scene) {
        
        this.scene = scene;
        
        this.speed = 100;

        this.gravity = -12;
        
        /**
         * Used to store the travelled distance and calculate where to generate more level tiles
         * and to give points to the player
         * The travelledDistance will reset each 100 "meters". When travelledDistance is equal to 70
         * the Level will generate more tiles
         */
        this.travelledDistance = 0;
        this.totalTravelledDistance = 0;
        
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

        this.mesh.position.y = 0.25;

        let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
        playerMaterial.alpha = 0.5;

        this.mesh.material = playerMaterial;

        this.mesh.setEllipsoidPerBoundingBox();

        GAME.drawEllipsoid(this.mesh);

    }

    move() {

        let elapsedTime = (GAME.engine.getDeltaTime() / 1000);

        this.mesh.moveWithCollisions(new BABYLON.Vector3(
            0, 
            //this.gravity / 100, 
            0,
            this.speed * elapsedTime
        ));
        
        this.calculateTravelledDistance(elapsedTime);

        if(GAME.keys.up && this.mesh.position.y < 4) {
            this.mesh.position.y += (this.speed) * elapsedTime;
        }

        if(GAME.keys.left) {
            this.mesh.position.x -= (this.speed / 3) * elapsedTime;
        }

        if(GAME.keys.right) {
            this.mesh.position.x += (this.speed / 3) * elapsedTime;
        }
        
        if(GAME.keys.down) {
            this.mesh.scaling.y = 0.5;
            this.mesh.setEllipsoidPerBoundingBox();
            this.speed = 20;
        } else {
            this.speed = 15;
            this.mesh.setEllipsoidPerBoundingBox();
            this.mesh.scaling.y = 1;
        }

    }

    getMesh() {
        return this.mesh;
    }

    calculateTravelledDistance(elapsedTime) {
        if(this.travelledDistance >= 100) {
            this.travelledDistance = 0;
        }

        this.travelledDistance += this.speed * elapsedTime;
        this.totalTravelledDistance += this.speed * elapsedTime;
    }

    getTravelledDistance() {
        return this.travelledDistance;
    }

}