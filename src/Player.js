class Player {

    constructor(scene) {
        
        this.scene = scene;

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

        //this.mesh.position.z += this.meshSpeed * elapsedTime;
        this.mesh.moveWithCollisions(new BABYLON.Vector3(0, -0.09, this.meshSpeed * elapsedTime));

        if(GAME.keys.up && this.mesh.position.y < 4) {
            this.mesh.position.y += (this.meshSpeed) * elapsedTime;
        }

        if(GAME.keys.left) {
            this.mesh.position.x -= (this.meshSpeed / 3) * elapsedTime;
        }

        if(GAME.keys.right) {
            this.mesh.position.x += (this.meshSpeed / 3) * elapsedTime;
        }
        
        if(GAME.keys.down) {
            this.mesh.scaling.y = 0.5;
            this.meshSpeed = 20;
            //this.mesh.position.y = 0.125;
        } else {
            this.meshSpeed = 15;
            this.mesh.scaling.y = 1;
            //this.mesh.position.y = 0.25;
        }
    }

    getMesh() {
        return this.mesh;
    }

}