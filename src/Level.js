class Level {

    start() {
        this.createScene();
    }

    exit() {
        this.scene.dispose();
    }

    beforeRender() {
        // Runs on scene loop   
    }

}