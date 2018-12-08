class Level {

    start() {
        this.createScene();
    }

    exit() {
        this.scene.dispose();
    }

    /**
     * Adds a collisor to the level scene. It will fire the options.onCollide callback
     * when the collider intersects options.collisionMesh. It can be used to fire actions when
     * player enters an area for example.
     * @param {*} name 
     * @param {*} options 
     */
    addCollisor(name, options) {
        
        let collisor = BABYLON.MeshBuilder.CreateBox(name, {
            width: options.width, 
            height: options.height, 
            depth: options.depth
        }, this.scene);

        collisor.position.x = options.x || 0;
        collisor.position.y = options.y || 0;
        collisor.position.z = options.z || 0;

        collisor.isVisible = (options.visible) ? options.visible : true;

        if(collisor.isVisible) {
            let collisorMaterial = new BABYLON.StandardMaterial(name + 'Material');
            collisorMaterial.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0);
            collisorMaterial.alpha = 0.5;

            collisor.material = collisorMaterial;
        }

        collisor.actionManager = new BABYLON.ActionManager(this.scene);
        collisor.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter: options.collisionMesh
                },
                () => { 
                    if(options.onCollide) {
                        options.onCollide();
                    }
                }
            )
        );

        return collisor;

    }

    beforeRender() {
        // Runs on scene loop   
    }

}