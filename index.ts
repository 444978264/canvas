document.documentElement.style.backgroundColor = "#000";
const canvas = (document.getElementById("canvas") as HTMLCanvasElement)!;

canvas.addEventListener("click", function (e) {
  const box = this.getBoundingClientRect();
  const x = (e.clientX - box.left) / (box.width / canvas.width);
  const y = (e.clientY - box.top) / (box.height / canvas.height);
  center[0] = x;
  center[1] = y;
});

canvas.style.width = "200px";
canvas.style.height = "200px";
canvas.style.backgroundColor = "#fff";
canvas.style.margin = "20px";
//设置画布的宽高
canvas.width = 400;
canvas.height = 400;
//绘制的对象获取
const ctx = canvas.getContext("2d")!;

const spacing = 40;
const radius = canvas.width / 2 - spacing;
const center = [canvas.width / 2, canvas.height / 2];
const fontSize = 18;

function drawCircle() {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.stroke();
}

const tickSize = 10;

function drawTick() {
  ctx.beginPath();
  for (let i = 1; i <= 60; i++) {
    const angle = ((Math.PI * 2) / 60) * i;
    let X = Math.sin(angle) * radius;
    let x = Math.sin(angle) * tickSize;
    let Y = Math.cos(angle) * radius;
    let y = Math.cos(angle) * tickSize;
    ctx.moveTo(X, Y);
    ctx.lineTo(X - x, Y - y);
  }
  ctx.stroke();
}

function drawCenter() {
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawNumber() {
  const labels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const len = labels.length;
  const inner = radius - tickSize;
  ctx.save();
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  for (let i = 0; i < len; i++) {
    const text = labels[i];
    const angle = (Math.PI / 6) * (i - 2);
    let x = Math.cos(angle) * inner;
    let y = Math.sin(angle) * inner;
    ctx.fillText(text.toString(), x * 0.9, y * 0.9);
  }
  ctx.restore();
}

function drawPoint(value: number, type: "h" | "m" | "s") {
  ctx.beginPath();
  let angle = 0,
    x = 0,
    y = 0;
  ctx.save();
  ctx.moveTo(0, 0);
  switch (type) {
    case "h":
      angle = (Math.PI * 2 * (value - 3)) / 12;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      ctx.lineWidth = 4;
      ctx.lineTo(x * 0.4, y * 0.4);
      break;
    default:
      angle = (Math.PI * 2 * (value - 15)) / 60;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      const width = type === "m" ? 3 : 2;
      const scale = type === "m" ? 0.5 : 0.7;
      ctx.lineWidth = width;
      ctx.lineTo(x * scale, y * scale);
      break;
      break;
  }
  ctx.stroke();
  ctx.restore();
}

function render() {
  ctx.clearRect(0, 0, 400, 400);
  ctx.save();
  ctx.translate(center[0], center[1]);
  ctx.font = `${fontSize}px Arial`;
  ctx.strokeStyle = "red";
  ctx.fillStyle = "red";
  const now = new Date();
  const hour = now.getHours();
  const min = now.getMinutes();
  const second = now.getSeconds();
  drawCenter();
  drawCircle();
  drawTick();
  drawNumber();
  drawPoint(hour, "h");
  drawPoint(min, "m");
  drawPoint(second, "s");
  ctx.restore();
}

render();
setInterval(render, 1000);
