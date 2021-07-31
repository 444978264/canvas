const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d")!;
//设置画布的宽高
canvas.width = 400;
canvas.height = 200;
//绘制的对象获取

//设置线的颜色为渐变色
const gradient = context.createLinearGradient(
  0,
  0,
  canvas.width,
  canvas.height
);
gradient.addColorStop(0, "rgb(100,200,155)");
gradient.addColorStop(0.8, "rgb(200,120,155)");
gradient.addColorStop(1.0, "rgb(00,120,105)");
context.strokeStyle = gradient;

//绘制X轴开始
context.beginPath();
context.moveTo(0, 0);
context.lineTo(canvas.width, 0);
context.closePath();
//画不是闭合区域 fill是闭合区域
context.stroke();

//绘制Y轴
context.beginPath();
context.moveTo(0, 0);
context.lineTo(0, canvas.height);
context.closePath();
//画不是闭合区域 fill是闭合区域
context.stroke();

context.beginPath();
//绘制在圆心绘制圆圈
context.arc(0, 0, 50, 0, Math.PI * 2, true);
context.closePath();
//画不是闭合区域 fill是闭合区域
context.fillStyle = gradient;
context.fill();
