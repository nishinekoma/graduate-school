// ArduinoAQueue2 - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
float[] px, py, pz; //過去の値を入れる待ち行列
final int SIZE = 50; //待ち行列の大きさ

void setup() {
  px = new float[SIZE];
  py = new float[SIZE];
  pz = new float[SIZE];
  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
  rectMode(CENTER);
}
void draw() {
  background(128);

  shift(gx, gy, gz);
  noFill(); stroke(0);
  for (int i = 0; i < SIZE; i++) {
    // 待ち行列の値を描画
    rect(px[i]*50+50, py[i]*50+50, 10, 10);
  }
  // 現在の値は赤で描画
  stroke(255,0,0);
  rect(gx*50+50, gy*50+50, 10, 10);
}
// 待ち行列をずらす(新しくx,y,zを入れる)
void shift(float x, float y, float z) {
  for (int i = SIZE-1; i > 0; i--) {
    px[i] = px[i-1];
    py[i] = py[i-1];
    pz[i] = pz[i-1];
  }
  px[0] = x; py[0] = y; pz[0] = z;
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
