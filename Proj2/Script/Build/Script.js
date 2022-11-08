"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        ƒ.Debug.log(this.message, this.node);
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    var ƒAid = FudgeAid;
    ƒ.Debug.info("Main Program Template running!");
    let viewport;
    let animJump;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        hndLoad(_event);
    }
    let walkAnimation;
    function initializeAnimations(coat) {
        walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        walkAnimation.generateByGrid(ƒ.Rectangle.GET(3, 5, 110, 170), 5, 400, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(140));
        animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
        animJump.generateByGrid(ƒ.Rectangle.GET(3, 200, 110, 170), 5, 400, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(140));
        console.log("LAUFEN");
    }
    let avatar;
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/MarioSprite.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        initializeAnimations(coat);
        avatar = new ƒAid.NodeSprite("Sprite");
        avatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        avatar.setAnimation(walkAnimation);
        avatar.setFrameDirection(1);
        avatar.framerate = 20;
        avatar.mtxLocal.translateY(0);
        avatar.mtxLocal.translateX(-1);
        avatar.mtxLocal.translateZ(1.001);
        let branch = viewport.getBranch();
        let mario = branch.getChildrenByName("Mario2")[0];
        mario.addChild(avatar);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    const xSpeedDefault = .9;
    const xSpeedSprint = 2;
    const jumpForce = 0.05;
    let ySpeed = 0;
    let gravity = 0.1;
    let leftDirection = false;
    function update(_event) {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        ySpeed -= gravity * deltaTime;
        avatar.mtxLocal.translateY(ySpeed);
        let pos = avatar.mtxLocal.translation;
        if (pos.y + ySpeed > 0)
            avatar.mtxLocal.translateY(ySpeed);
        else {
            ySpeed = 0;
            pos.y = 0;
            avatar.mtxLocal.translation = pos;
        }
        let speed = xSpeedDefault;
        if (leftDirection)
            speed = -xSpeedDefault;
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SHIFT_LEFT, ƒ.KEYBOARD_CODE.SHIFT_RIGHT])) {
            speed = xSpeedSprint;
            if (leftDirection)
                speed = -xSpeedSprint;
        }
        // Calculate (walk) speed
        const moveDistance = speed * ƒ.Loop.timeFrameGame / 1000;
        // Check for key presses
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            avatar.mtxLocal.translateX(-moveDistance);
            leftDirection = true;
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            avatar.mtxLocal.translateX(moveDistance);
            leftDirection = false;
        }
        else {
            avatar.setAnimation(walkAnimation);
            avatar.showFrame(0);
        }
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE]) && ySpeed === 0) {
            console.log("SPRINGEN");
            avatar.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 1);
            ySpeed = jumpForce;
        }
        if (ySpeed > 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(0);
        }
        else if (ySpeed < 0) {
            avatar.setAnimation(animJump);
            avatar.showFrame(1);
        }
        // Rotate based on direction
        avatar.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);
        viewport.draw();
        //ƒ.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map