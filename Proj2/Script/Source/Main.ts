namespace Script {
  import ƒ = FudgeCore;
  
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let marioMoves: ƒ.Node;
  let walkSpeed: number = 1;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
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

  let walkAnimation: ƒAid.SpriteSheetAnimation;

  function initializeAnimations(coat: ƒ.CoatTextured) {
    walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    walkAnimation.generateByGrid(ƒ.Rectangle.GET(3, 5, 160, 170), 10, 400, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(16));
  }

  let player: ƒAid.NodeSprite;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/MarioSprite.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    initializeAnimations(coat);

    player = new ƒAid.NodeSprite("Sprite");
    player.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    player.setAnimation(walkAnimation);
    player.setFrameDirection(1);
    player.framerate = 20;

    player.mtxLocal.translateY(-.4);
    player.mtxLocal.translateX(-1);
    player.mtxLocal.translateZ(1.001);

    let branch: ƒ.Node = viewport.getBranch();
    let mario: ƒ.Node = branch.getChildrenByName("Mario2")[0];
    mario.addChild(player);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
  }

  function update(_event: Event): void {
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

  
}