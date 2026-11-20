// ArduinoAMove2 - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
float mx,my;
final float SPEED = 3.0;

void setup() {
  mx = 50; my = 50;
  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
  rectMode(CENTER);
}
void draw() {
  background(128);

  mx += gx*SPEED;
  my += gy*SPEED;
  if (mx < 5) mx = 5;
  if (mx > 95) mx = 95;
  if (my < 5) my = 5;
  if (my > 95) my = 95;
  rect(mx, my, 10, 10);
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
