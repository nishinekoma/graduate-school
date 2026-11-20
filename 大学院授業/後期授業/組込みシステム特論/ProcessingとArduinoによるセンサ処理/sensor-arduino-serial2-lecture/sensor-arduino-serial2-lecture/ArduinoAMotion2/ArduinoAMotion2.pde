// ArduinoAMotion2 - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
float[] px, py, pz; // 待ち行列
final int SIZE = 100; // 待ち行列の大きさ

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
  // 現在の値を白で描画
  fill(255);
  rect(gx*50+50, gy*50+50, 10, 10);
  // 変量(10回平均から30回平均を引いた値)を緑で描画
  float x = average(px,10)-average(px, 30);
  float y = average(py,10)-average(py, 30);
  fill(0,255,0);
  rect(x*50+50, y*50+50, 10, 10);
}
void shift(float x, float y, float z) {
  for (int i = SIZE-1; i > 0; i--) {
    px[i] = px[i-1];
    py[i] = py[i-1];
    pz[i] = pz[i-1];
  }
  px[0] = x; py[0] = y; pz[0] = z;
}
float average(float[] array, int area) {
  float sum = 0;
  for(int i = 0; i < area; i++) {
    sum += array[i];
  }
  return sum/area;
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
