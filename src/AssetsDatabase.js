class AssetsDatabase {
    
    constructor(scene) {

        this.scene = scene;

        this.meshes = [];
        this.sounds = [];

        this.manager = new BABYLON.AssetsManager(this.scene);

    }

    addMesh() {

    }

    addSound(name, file, options) {
        let fileTask = this.manager.addBinaryFileTask(name + '__Task', file);
        
        this.sounds[name] = {};

        fileTask.onSuccess = function (task) {
            this.sounds[name] = new BABYLON.Sound("Violons18", task.data, scene, soundReady, { loop: true });
        }
    }

    addMusic() {
        
    }

    getMesh(name) {
        return this.meshes[name];     
    }

    getSound(name) {
        return this.sounds[name];
    }

}