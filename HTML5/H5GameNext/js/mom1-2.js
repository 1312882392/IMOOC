var momObj = function() {
  this.x
  this.y
  this.angle
  this.bigEye = new Image()
  this.bigBody = new Image()
  this.bigTail = new Image()
}
momObj.prototype.init = function() {
  // this.x = 400
  this.x = canWidth * 0.5
  // this.y = 300
  this.y = canHeight * 0.5
  // 大鱼初始角度为0
  this.angle = 0
  this.bigEye.src = './img/bigEye0.png'
  this.bigBody.src = './img/bigSwim0.png'
  this.bigTail.src = './img/bigTail0.png'
}
momObj.prototype.draw = function() {
  // 让大鱼的位置跟随鼠标位置，该lerpDistance方法内部执行逻辑是:
  // (this.x - mx)*0.98 + mx
  this.x = lerpDistance(mx, this.x, 0.98)
  this.y = lerpDistance(my, this.y, 0.98)
  // 实现大鱼头部转弯
  var deltaY = my - this.y
  var deltaX = mx - this.x
  // atan2()方法可返回数字的反正切值,返回的值表示坐标（x，y）与 X轴之间的角度的弧度。
  var beta = Math.atan2(deltaY, deltaX) + Math.PI
  // lerpAngle方法内部实现:
  /*function lerpAngle(a, b, t) {
    var d = b - a;
    if(d > Math.PI) d = d - 2 * Math.PI;
    if(d < -Math.PI) d = d + 2 * Math.PI;
    return a + d * t;
  }*/
  this.angle = lerpAngle(beta, this.angle, 0.6)
  ctx1.save()
  // 重新映射画布上的 (this.x,this.y)位置,作用是让鱼出现在画布中间
  // 方法转换画布的用户坐标系统。平移，将画布的坐标原点向左右方向移动x，向上下方向移动y.canvas的默认位置是在（0,0）
  ctx1.translate(this.x, this.y)
  // 让大鱼进行旋转
  ctx1.rotate(this.angle)
  // 绘制鱼尾图片以及位置
  ctx1.drawImage(this.bigTail, -this.bigTail.width * 0.5 + 30, -this.bigTail.height * 0.5)
  ctx1.drawImage(this.bigBody, -this.bigBody.width * 0.5, -this.bigBody.height * 0.5)
  ctx1.drawImage(this.bigEye, -this.bigEye.width * 0.5, -this.bigEye.height * 0.5)
  ctx1.restore()
}
// 备注：save()和restore()的作用是先保存当前画笔的状态save(),再恢复restore()状态,
// 在这之间的，有要旋转画笔，移动画布圆点的操作都不会影响到画布中其他的图形的绘制