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

    let marios: ƒ.Node = branch.getChildrenByName("SpriteAnim")[0];

    console.log(marios);


     ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    console.log("upadate")
    marioMoves.getComponent(ƒ.ComponentTransform).mtxLocal.translateX(1);
  }
}