import k from "../kaplayCtx";

export function makeMotobug(pos) {
    //creates game obj
  return k.add([
    k.sprite("motobug", { anim: "run" }),
    k.area({ shape: new k.Rect(k.vec2(-5, 0), 32, 32) }),
    k.scale(4),
    k.anchor("center"),
    k.pos(pos),
    k.offscreen(),//we need to destroy enimes when they leav screen
    "enemy",
  ]);
}