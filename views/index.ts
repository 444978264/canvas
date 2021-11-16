import { assets } from "../assets";
import { Base } from "../lib/base";
import { Resource } from "../lib/resource";
import { Stage } from "../lib/stage";
import { home } from "./home";
import { loading } from "./loading.scene";

document.documentElement.style.backgroundColor = "#000";
document.body.style.margin = "0";

const instance = (document.getElementById("canvas") as HTMLCanvasElement)!;
const width = 288,
  height = 512;

instance.width = width;
instance.height = height;
instance.style.backgroundColor = "#fff";
Base.canvas = instance;
Base.resource = new Resource(assets);
const game = new Stage(instance);
game.setLoading(loading);
game.register(home);
