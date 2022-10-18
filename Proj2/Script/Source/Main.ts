namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  let marioMoves: ƒ.Node;
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
    marioMoves.mtxLocal.translateX(0.01);
  }
}