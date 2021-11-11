import { Resource } from "./base/resource";

document.documentElement.style.backgroundColor = "#000";
const instance = (document.getElementById("canvas") as HTMLCanvasElement)!;
const context = instance.getContext("2d")!;

const width = 288,
  height = 512;

instance.width = width;
instance.height = height;

context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);

Resource.add("day", require("./assets/bg_day.png"))
  .add("night", require("./assets/bg_night.png"))
  .add("land", require("./assets/land.png"))
  .add("bird0", require("./assets/bird0_0.png"))
  .add("bird1", require("./assets/bird0_1.png"))
  .add("bird2", require("./assets/bird0_2.png"))
  .ready(function () {
    context.drawImage(Resource.get("day")!, 0, 0);
    const land = Resource.get("land")!;
    context.drawImage(Resource.get("land")!, 0, height - land.height);
    console.log(Resource.count(), "count");
  });

class Shape {
  x: number = 0;
  y: number = 0;
}
