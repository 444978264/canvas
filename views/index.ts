import { Resource } from "../core/resource";
import { Stage } from "../core/stage";
import { home } from "./home.scene";
import { loading } from "./loading.scene";

document.documentElement.style.backgroundColor = "#000";

const instance = (document.getElementById("canvas") as HTMLCanvasElement)!;
const width = 288,
  height = 512;

instance.width = width;
instance.height = height;
instance.style.backgroundColor = "#fff";

const stage = new Stage(instance);
stage.register(loading);
stage.register(home);

Resource.add("day", require("../assets/bg_day.png"))
  .add("night", require("../assets/bg_night.png"))
  .add("land", require("../assets/land.png"))
  .add("bird0", require("../assets/bird0_0.png"))
  .add("bird1", require("../assets/bird0_1.png"))
  .add("bird2", require("../assets/bird0_2.png"));

stage.switchScene("loading");
