import { Resource } from "../core/resource";
import { Stage } from "../core/stage";
import { Texture } from "../core/Texture";
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

Resource.add(new Texture("day", require("../assets/bg_day.png")))
  .add(new Texture("night", require("../assets/bg_night.png")))
  .add(new Texture("land", require("../assets/land.png")))
  .add(new Texture("bird0", require("../assets/bird0_0.png")))
  .add(new Texture("bird1", require("../assets/bird0_1.png")))
  .add(new Texture("bird2", require("../assets/bird0_2.png")));

stage.switchScene("loading");
