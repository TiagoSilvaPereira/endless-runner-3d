class Pursuer {

    constructor(level) {

        /**
         * Who to chase
         */
        this.chased = level.player;
        this.currentChasedTravelledDistance = 0;
        this.distanceBeetweenChased = 0.9;

        this.statuses = {
            'CLOSE_TO_CHASED': true
        };

        /**
         * The scene
         */
        this.scene = level.scene;

        this.mesh = BABYLON.MeshBuilder.CreateSphere("pursuerSphere", {diameter: 0.25, segments: 2}, this.scene);
        this.mesh.position.x = 0;
        this.mesh.position.y = 0.125;
        this.mesh.position.z = this.chased.mesh.position.z - this.distanceBeetweenChased;

    }

    approachToChased() {
        this.statuses.CLOSE_TO_CHASED = true;

        this.distanceBeetweenChased = 0.9;
        this.currentChasedTravelledDistance = this.chased.totalTravelledDistance;
    }

    moveAwayFromChased() {

        this.statuses.CLOSE_TO_CHASED = false;

        let interpolateDistanceAction = new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.NothingTrigger,
            this,
            'distanceBeetweenChased',
            1.5,
            1500
        );

        this.scene.actionManager.registerAction(interpolateDistanceAction);
        interpolateDistanceAction.execute();

    }

    attackChased() {

    }

    move() {
        let animationRatio = this.scene.getAnimationRatio();

        this.mesh.position.x = this.chased.mesh.position.x;
        this.mesh.position.z = this.chased.mesh.position.z - this.distanceBeetweenChased;

        this.mesh.rotation.x += 0.1 * animationRatio;

        if((this.chased.totalTravelledDistance - this.currentChasedTravelledDistance) > 50 && this.statuses.CLOSE_TO_CHASED) {
            this.moveAwayFromChased();
        }
    }

}