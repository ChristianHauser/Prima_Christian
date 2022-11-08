namespace Script {
  import ƒ = FudgeCore;
  
  import ƒAid = FudgeAid;
  ƒ.Debug.info("Main Program Template running!");
  let sos: number = 0;
  let viewport: ƒ.Viewport;
  let animJump: ƒAid.SpriteSheetAnimation;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    hndLoad(_event);
  }

  let walkAnimation: ƒAid.SpriteSheetAnimation;

  function initializeAnimations(coat: ƒ.CoatTextured) {
    walkAnimation = new ƒAid.SpriteSheetAnimation("Walk", coat);
    walkAnimation.generateByGrid(ƒ.Rectangle.GET(3, 5, 110, 170), 5, 400, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(140));
    animJump = new ƒAid.SpriteSheetAnimation("Jump", coat);
    animJump.generateByGrid(ƒ.Rectangle.GET(3, 200, 110, 170), 5, 400, ƒ.ORIGIN2D.BOTTOMCENTER, ƒ.Vector2.X(140));
    console.log("LAUFEN");
  }

  let avatar: ƒAid.NodeSprite;
  async function hndLoad(_event: Event): Promise<void> {
    let imgSpriteSheet: ƒ.TextureImage = new ƒ.TextureImage();
    await imgSpriteSheet.load("./Images/MarioSprite.png");
    let coat: ƒ.CoatTextured = new ƒ.CoatTextured(undefined, imgSpriteSheet);

    initializeAnimations(coat);

    avatar = new ƒAid.NodeSprite("Sprite");
    avatar.addComponent(new ƒ.ComponentTransform(new ƒ.Matrix4x4()));
    avatar.setAnimation(walkAnimation);
    avatar.setFrameDirection(1);
    avatar.framerate = 20;

    avatar.mtxLocal.translateY(0);
    avatar.mtxLocal.translateX(-1);
    avatar.mtxLocal.translateZ(1.001);

    let branch: ƒ.Node = viewport.getBranch();
    let mario: ƒ.Node = branch.getChildrenByName("Mario2")[0];
    mario.addChild(avatar);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 30);
  }

  const xSpeedDefault: number = .9;
  const xSpeedSprint: number = 2;
  const jumpForce: number = 0.05;
  let ySpeed: number = 0;
  let gravity: number = 0.1;

  let leftDirection: boolean = false;
  

  function update(_event: Event): void {
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    ySpeed -= gravity * deltaTime;
    avatar.mtxLocal.translateY(ySpeed);

    let pos: ƒ.Vector3 = avatar.mtxLocal.translation;
    if (pos.y + ySpeed > 0)
      avatar.mtxLocal.translateY(ySpeed);
    else {
      ySpeed = 0;
      pos.y = 0;
      avatar.mtxLocal.translation = pos;
    }

    let speed: number = xSpeedDefault;
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
      
    } else if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D, ƒ.KEYBOARD_CODE.ARROW_RIGHT])) {
      avatar.mtxLocal.translateX(moveDistance);
      leftDirection = false;
      
    } else {
      avatar.setAnimation(walkAnimation);
      avatar.showFrame(0);
    }

    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])&& ySpeed === 0) {
      console.log("SPRINGEN");
      avatar.mtxLocal.translation = new ƒ.Vector3(pos.x, 0, 1);
      ySpeed = jumpForce;
    }

    if (ySpeed > 0) {
      avatar.setAnimation(animJump);
      avatar.showFrame(0);
    } else if (ySpeed < 0) {
      avatar.setAnimation(animJump);
      avatar.showFrame(1);
    }

    // Rotate based on direction
    avatar.mtxLocal.rotation = ƒ.Vector3.Y(leftDirection ? 180 : 0);

    viewport.draw();
    //ƒ.AudioManager.default.update();
  }

  
}