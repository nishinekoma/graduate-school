// ArduinoAShake2 - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
int count=0;
float px, py, pz;
final float THRE = 0.5;
PFont myFont;

void setup() {
  myFont = loadFont("CourierNewPSMT-24.vlw");
  textFont(myFont, 24);
  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
}
void draw() {
  background(128); 

  if (gx >= THRE && px < THRE) count++;
  text(count, 25,50);
  rect(10,0, 10, count%100);
  px = gx; py = gy; pz = gz;
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
