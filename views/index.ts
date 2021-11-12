import { Resource } from "../core/resource";
import { Stage } from "../core/stage";
import { home } from "./home.scene";

document.documentElement.style.backgroundColor = "#000";
const instance = (document.getElementById("canvas") as HTMLCanvasElement)!;
const context = instance.getContext("2d")!;

const width = 288,
  height = 512;

instance.width = width;
instance.height = height;

context.fillStyle = "#fff";
context.fillRect(0, 0, width, height);
const stage = new Stage(instance);
stage.register(home);
Resource.add("day", require("../assets/bg_day.png"))
  .add("night", require("../assets/bg_night.png"))
  .add("land", require("../assets/land.png"))
  .add("bird0", require("../assets/bird0_0.png"))
  .add("bird1", require("../assets/bird0_1.png"))
  .add("bird2", require("../assets/bird0_2.png"))
  .ready(function () {
    stage.switchScene("home");
  });
