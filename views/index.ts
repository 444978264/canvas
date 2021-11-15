import { assets } from "../assets";
import { Stage } from "../lib/stage";
import { home } from "./home.scene";
import { loading } from "./loading.scene";

document.documentElement.style.backgroundColor = "#000";
document.body.style.margin = "0";

const instance = (document.getElementById("canvas") as HTMLCanvasElement)!;
const width = 288,
  height = 512;

instance.width = width;
instance.height = height;
instance.style.backgroundColor = "#fff";

const game = new Stage(instance, assets);
game.setLoading(loading);
game.register(home);
