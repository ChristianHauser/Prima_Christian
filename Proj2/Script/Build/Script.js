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
    let marioMoves;
    let walkSpeed = 1;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        hndLoad(_event);
        /* ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    
        console.log(viewport);
    
        let branch: ƒ.Node = viewport.getBranch();
        console.log(branch);
        
    
        marioMoves = branch.getChildrenByName("MarioPos")[0];
        
        console.log(marioMoves);
        ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a */
    }
    let walkAnimation;
    function initializeAnimations(coat) {
        walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
        walkAnimation.generateByGrid(ƒ.Rectangle.GET(3, 5, 160, 170), 10, 400, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
    }
    let player;
    async function hndLoad(_event) {
        let imgSpriteSheet = new ƒ.TextureImage();
        await imgSpriteSheet.load("./Images/MarioSprite.png");
        let coat = new ƒ.CoatTextured(undefined, imgSpriteSheet);
        initializeAnimations(coat);
        player = new ƒAid.NodeSprite("Sprite");
        player.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
        player.setAnimation(walkAnimation);
        player.setFrameDirection(1);
        player.framerate = 20;
        player.mtxLocal.translateY(-.4);
        player.mtxLocal.translateX(-1);
        player.mtxLocal.translateZ(1.001);
        let branch = viewport.getBranch();
        let mario = branch.getChildrenByName("Mario2")[0];
        mario.addChild(player);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        const amount = walkSpeed * ƒ.Loop.timeFrameGame / 1000;
        ƒ.AudioManager.default.update();
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A, ƒ.KEYBOARD_CODE.ARROW_LEFT])) {
            player.mtxLocal.translateX(-amount);
        }
        else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
            player.mtxLocal.translateX(amount);
        }
        viewport.draw();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map