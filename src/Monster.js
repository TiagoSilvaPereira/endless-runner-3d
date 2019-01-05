class Monster {

    constructor(level) {

        /**
         * Who to chase
         */
        this.level = level;
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

        this.mesh = BABYLON.MeshBuilder.CreateSphere("monsterSphere", {diameter: 0.25, segments: 2}, this.scene);
        this.mesh.position.x = 0;
        this.mesh.position.y = 0.2;
        this.mesh.position.z = this.player.mesh.position.z - this.distanceBeetweenPlayer;

        this.monsterMaterial = new BABYLON.StandardMaterial('monsterMaterial', this.scene);
        this.monsterMaterial.diffuseColor = new BABYLON.Color3(0.47, 0.55, 0.64);
        this.monsterMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        this.mesh.material = this.monsterMaterial;

        this.approachSound = new BABYLON.Sound('approachSound', '/assets/sounds/monster.wav', this.scene, null);
        this.attackSound = new BABYLON.Sound('attackSound', '/assets/sounds/monster_attack.mp3', this.scene);

    }

    approachToPlayer() {
        this.statuses.CLOSE_TO_PLAYER = true;
        this.currentPlayerTravelledDistance = this.player.totalTravelledDistance;

        this.level.interpolate(this, 'distanceBeetweenPlayer', 0.9, 500);

        this.approachSound.play();
    }

    moveAwayFromPlayer() {
        this.statuses.CLOSE_TO_PLAYER = false;
        this.level.interpolate(this, 'distanceBeetweenPlayer', 1.5, 1500);
    }

    attackPlayer() {
        this.attackSound.play();
        this.level.interpolate(this, 'distanceBeetweenPlayer', 0.1, 300);
        
        setTimeout(() => this.player.die(), 300);
    }

    move() {
        let animationRatio = this.scene.getAnimationRatio();

        this.mesh.position.x = this.player.mesh.position.x;

        // Adding some altitude variation on monster altitude using Math.sin
        this.mesh.position.y = (Math.sin(this.mesh.position.z) / 100) + 0.2 + (this.player.mesh.position.y - this.player.defaultAltitude);

        this.mesh.position.z = this.player.mesh.position.z - this.distanceBeetweenPlayer;

        // If is chasing the player from more than 100 'meters', move away
        if((this.player.totalTravelledDistance - this.currentPlayerTravelledDistance) > 100 && this.statuses.CLOSE_TO_PLAYER) {
            this.moveAwayFromPlayer();
        }
    }

    isCloseToPlayer() {
        return this.statuses.CLOSE_TO_PLAYER;
    }

}