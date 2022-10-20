namespace Script {
  import ƒ = FudgeCore;
  
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let marioMoves: ƒ.Node;
  let walkSpeed: number = 1;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

    console.log(viewport);

    let branch: ƒ.Node = viewport.getBranch();
    console.log(branch);
    

    marioMoves = branch.getChildrenByName("MarioPos")[0];
    
    console.log(marioMoves);
    ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_RIGHT])){
      marioMoves.mtxLocal.translateX(walkSpeed * ƒ.Loop.timeFrameGame/1000);
    }
    
    if(ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.ARROW_LEFT])){
      marioMoves.mtxLocal.rotateZ(180);
      marioMoves.mtxLocal.translateY(-0.01);
    }
    
  }
}