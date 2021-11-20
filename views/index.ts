import { assets } from "../assets";
import { BaseElement } from "../lib/element";
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
BaseElement.canvas = instance;
BaseElement.resource = new Resource(assets);
const game = new Stage(instance);
game.setLoading(loading);
game.register(home);
