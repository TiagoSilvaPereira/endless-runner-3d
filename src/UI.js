class UI {

    constructor(uiName) {
        this.controls = [];

        this.menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(uiName);
    }

    addButton(name, text, options = {}) {
        let button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
        
        button.width = options.width || 0.5;
        button.height = options.height || '60px';
        button.color = options.color || 'black';
        button.background = options.background || 'white';
        button.left = options.left || '0px';
        button.top = options.top || '0px';
        button.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        if(options.onclick) {
            button.onPointerUpObservable.add(options.onclick);
        }

        this.menuTexture.addControl(button);
        this.controls.push(button);

        return button;
    }

    addText(text, options = {}) {
        let textControl = new BABYLON.GUI.TextBlock();
        textControl.text = text;
        textControl.color = options.color || 'white';
        textControl.fontSize = options.fontSize || 28;
        textControl.outlineWidth = options.outlineWidth || 2;
        textControl.outlineColor = options.outlineColor || "black";
        textControl.lineSpacing = options.lineSpacing || '5px';
        textControl.left = options.left || '0px';
        textControl.top = options.top || '0px';
        textControl.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textControl.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textControl.textWrapping = options.wrapping || true;
        
        this.menuTexture.addControl(textControl);
        this.controls.push(textControl);

        return textControl;
    }

    show() {
        this.controls.forEach(control => control.isVisible = true);
    }

    hide() {
        this.controls.forEach(control => control.isVisible = false);
    }

}