import renderObject from "./objects/renderObject";

export class Scene {
  objects: renderObject[];

  constructor() {
    this.objects = [];
  }

  add(obj: renderObject) {
    this.objects.push(obj);
  }

  update() {
    //TODO: Update scene
  }
}
