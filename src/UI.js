class UI {

    constructor(uiName) {
        this.controls = [];

        this.menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(uiName);
    }

    addButton(name, text, options = {}) {
        let button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
        
        button.width = options.width || 0.2;
        button.height = options.height || '40px';
        button.color = options.color || 'white';
        button.background = options.background || 'green';

        if(options.onclick) {
            button.onPointerUpObservable.add(options.onclick);
        }

        this.menuTexture.addControl(button);
        this.controls.push(button);

        return button;
    }

    show() {
        this.controls.forEach(control => control.isVisible = true);
    }

    hide() {
        this.controls.forEach(control => control.isVisible = false);
    }

}