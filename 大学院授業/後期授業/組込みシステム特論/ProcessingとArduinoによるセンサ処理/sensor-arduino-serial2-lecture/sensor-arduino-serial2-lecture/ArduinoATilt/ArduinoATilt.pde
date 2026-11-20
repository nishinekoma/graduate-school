// ArduinoATilt - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
float mx,my; // 玉の現在位置
float sx,sy; // 玉の速度
final float SPEED = 0.1; // 速度係数
final float SLOW = 0.01; // 減速係数

void setup() {
  mx = 50; my = 50;
  sx = 0; sy = 0;
  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
  ellipseMode(CENTER);
}
void draw() {
  background(128);
 
  // 現在速度に現在の加速度を加える
  sx += gx*SPEED;
  sy += gy*SPEED;
  // 摩擦力を反映する
  sx = friction(sx);
  sy = friction(sy);
  // 現在位置に現在速度を加える
  mx += sx;
  my += sy;
  // 画面端のチェック
  float px = mx, py = my;
  mx = constrain(mx, 5, 95);
  if (px != mx) sx = 0; // xの速度を0に
  my = constrain(my, 5, 95);
  if (py != my) sy = 0; // yの速度を0に
  ellipse(mx, my, 10, 10);
}
// 摩擦力の処理(速度の絶対値をSLOWだけ減らす)
float friction(float s) {
  if (s >= SLOW) {
    return s-SLOW;
  } else if (s <= -SLOW) {
    return s+SLOW;
  }
  // 絶対値がSLOW未満の場合は0にする
  return 0;
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
