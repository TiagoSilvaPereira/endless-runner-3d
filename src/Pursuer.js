class Pursuer {

    constructor(level) {

        /**
         * Who to chase
         */
        this.player = level.player;
        this.currentPlayerTravelledDistance = 0;
        this.distanceBeetweenPlayer = 0.9;

        this.statuses = {
            'CLOSE_TO_PLAYER': true
        };

        /**
         * SOUNDS
         */
        this.approachSound = null;
        this.attackSound = null;

        /**
         * The scene
         */
        this.scene = level.scene;

        this.mesh = BABYLON.MeshBuilder.CreateSphere("pursuerSphere", {diameter: 0.25, segments: 2}, this.scene);
        this.mesh.position.x = 0;
        this.mesh.position.y = 0.2;
        this.mesh.position.z = this.player.mesh.position.z - this.distanceBeetweenPlayer;

        this.pursuerMaterial = new BABYLON.StandardMaterial('pursuerMaterial', this.scene);
        this.pursuerMaterial.diffuseColor = new BABYLON.Color3(0.47, 0.55, 0.64);
        this.pursuerMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.mesh.material = this.pursuerMaterial;

        this.approachSound = new BABYLON.Sound('approachSound', '/assets/sounds/monster.wav', this.scene, null);
        this.attackSound = new BABYLON.Sound('attackSound', '/assets/sounds/monster_attack.mp3', this.scene);

    }

    approachToPlayer() {
        this.statuses.CLOSE_TO_PLAYER = true;
        this.currentPlayerTravelledDistance = this.player.totalTravelledDistance;

        let interpolateDistanceAction = new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.NothingTrigger,
            this,
            'distanceBeetweenPlayer',
            0.9,
            500
        );

        this.scene.actionManager.registerAction(interpolateDistanceAction);
        interpolateDistanceAction.execute();

        this.approachSound.play();
    }

    moveAwayFromPlayer() {

        this.statuses.CLOSE_TO_PLAYER = false;

        let interpolateDistanceAction = new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.NothingTrigger,
            this,
            'distanceBeetweenPlayer',
            1.5,
            1500
        );

        this.scene.actionManager.registerAction(interpolateDistanceAction);
        interpolateDistanceAction.execute();

    }

    attackPlayer() {
        this.attackSound.play();

        let interpolateDistanceAction = new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.NothingTrigger,
            this,
            'distanceBeetweenPlayer',
            0.1,
            300
        );

        this.scene.actionManager.registerAction(interpolateDistanceAction);
        interpolateDistanceAction.execute();
        
        setTimeout(() => {
            this.player.die();
        }, 300);
    }

    move() {
        let animationRatio = this.scene.getAnimationRatio();

        this.mesh.position.x = this.player.mesh.position.x;
        this.mesh.position.y = (Math.sin(this.mesh.position.z) / 100) + 0.2 + (this.player.mesh.position.y - this.player.defaultAltitude);
        this.mesh.position.z = this.player.mesh.position.z - this.distanceBeetweenPlayer;

        if((this.player.totalTravelledDistance - this.currentPlayerTravelledDistance) > 100 && this.statuses.CLOSE_TO_PLAYER) {
            this.moveAwayFromPlayer();
        }
    }

    isCloseToPlayer() {
        return this.statuses.CLOSE_TO_PLAYER;
    }

}