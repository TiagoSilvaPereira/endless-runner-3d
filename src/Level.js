class Level {

    constructor() {
        
        /**
         * We can use this object to store materials that can be reused along the game
         */
        this.materials = {};

        this.scene = null;

    }

    start() {
        this.createScene();
    }

    createScene() {
        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);

        this.buildScene();

        // If has the beforeRender method
        if(this.beforeRender) {
            this.scene.registerBeforeRender(
                this.beforeRender.bind(this)
            );
        }

        return this.scene;
    }

    exit() {
        this.scene.dispose();
    }

    /**
     * Adds a collider to the level scene. It will fire the options.onCollide callback
     * when the collider intersects options.collisionMesh. It can be used to fire actions when
     * player enters an area for example.
     * @param {*} name 
     * @param {*} options 
     */
    addCollider(name, options) {
        
        let collider = BABYLON.MeshBuilder.CreateBox(name, {
            width: options.width, 
            height: options.height, 
            depth: options.depth
        }, this.scene);

        // Add a tag to identify the object as collider and to simplify group operations (like dispose)
        BABYLON.Tags.AddTagsTo(collider, 'collider boxCollider');

        collider.position.x = options.x || 0;
        collider.position.y = options.y || 0;
        collider.position.z = options.z || 0;

        collider.isVisible = (options.visible) ? options.visible : false;

        if(collider.isVisible) {
            let colliderMaterial = new BABYLON.StandardMaterial(name + 'Material');
            colliderMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);
            colliderMaterial.alpha = 0.5;

            collider.material = colliderMaterial;
        }

        options.timeToDispose = (options.timeToDispose) ? options.timeToDispose : 0;

        collider.actionManager = new BABYLON.ActionManager(this.scene);
        collider.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: options.collisionMesh
                },
                () => { 

                    // Runs onCollide callback if exists
                    if(options.onCollide) {
                        options.onCollide();
                    }
                    
                    // If true, will dispose the collider after timeToDispose
                    if(options.disposeAfterCollision) {
                        setTimeout(() => {
                            collider.dispose();
                        }, options.timeToDispose);
                    }
                }
            )
        );

        return collider;

    }

    disposeColliders() {
        let colliders = this.scene.getMeshesByTags('collider');

        for(var index = 0; index < colliders.length; index++) {
            colliders[index].dispose();
        }
    }

    addMaterial(material) {
        this.materials[material.name] = material;
    }

    getMaterial(materialName) {
        return this.materials[materialName];
    }

    removeMaterial(materialName) {
        let material = null;
        if(material = this.materials[materialName]) {
            material.dispose();
            delete this.materials[materialName];
        }
    }

}