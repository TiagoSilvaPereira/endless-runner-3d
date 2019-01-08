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

        fileTask.onSuccess = (task) => {
            this.sounds[name] = new BABYLON.Sound(name, task.data, this.scene, null, options);
        }

        return this.sounds[name];
    }

    /**
     * Adds a music (sound with some predefined parametes that can be overwriten)
     * By default, musics are automatically played in loop
     * @param {*} name 
     * @param {*} file 
     * @param {*} options 
     */
    addMusic(name, file, options = {}) {

        options.loop = (typeof options.loop !== 'undefined') ? options.loop : true;
        options.volume = (typeof options.volume !== 'undefined') ? options.volume : 0.5;
        options.autoplay = (typeof options.autoplay !== 'undefined') ? options.autoplay : true;

        return this.addSound(name, file, options);

    }

    getMesh(name) {
        return this.meshes[name];     
    }

    getSound(name) {
        return this.sounds[name];
    }

    load() {
        this.manager.load();
    }

}