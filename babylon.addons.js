/**
 * Method to set an ellipsoid (for collision) based on boundingbox size
 */ 
BABYLON.Mesh.prototype.setEllipsoidPerBoundingBox = function(scene) {
    var bi = this.getBoundingInfo();
    var bb = bi.boundingBox;
    this.ellipsoid = bb.maximumWorld.subtract(bb.minimumWorld).scale(0.5);
}

/**
 * Method to execute some code when a mesh intersects another mesh
 */ 
BABYLON.Mesh.prototype.executeOnIntersection = function(intersectionMesh, callbackToExecute, autoCreateManager = false) {
    
    if(!this.actionManager && autoCreateManager) {
        this.actionManager = new BABYLON.ActionManager(
            this.getScene()
        );
    }
    
    this.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(
            {
                trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger,
                parameter: intersectionMesh
            },
            callbackToExecute
        )
    );
}