class Pursuer {

    constructor(level) {

        /**
         * Who to chase
         */
        this.chased = level.player;
        console.log(this.chased)

        /**
         * The scene
         */
        this.scene = level.scene;

        this.mesh = BABYLON.MeshBuilder.CreateSphere("pursuerSphere", {diameter: 0.4, segments: 2}, this.scene);
        this.mesh.position.x = 0;
        this.mesh.position.y = 0.2;
        this.mesh.position.z = this.chased.mesh.position.z - 1;

    }

    show() {
        this.mesh.isVisible = true;
    }

    hide() {
        this.mesh.isVisible = false;
    }

    move() {
        let animationRatio = this.scene.getAnimationRatio();

        this.mesh.position.x = this.chased.mesh.position.x;
        this.mesh.position.z = this.chased.mesh.position.z - 1;
        
        this.mesh.rotation.x += 0.1 * animationRatio;
    }

}