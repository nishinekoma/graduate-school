// ArduinoAMaze - written by Yoshihiro OHMI
// This program is based on ArduinoAMove3.
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
float mx,my; // 玉の位置
float px,py; // 直前の玉の位置
final float SPEED = 3.0;
PImage map;

void setup() {
  mx = 200; my = 100;
  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
  rectMode(CENTER);
  map = loadImage("map.png");
  surface.setResizable(true);
  surface.setSize(map.width, map.height); //大きさは画像と同じ
}
void draw() {
  image(map,0,0); 

  mx += gx*SPEED;
  my += gy*SPEED;
  mx = constrain(mx, 0, width);
  my = constrain(my, 0, height);
  color c = get(int(mx),int(my)); //getの引数はintである必要がある
  if (c == #000000) { //玉の中心が壁(黒色)なら
    mx=px; my=py; //直前の位置に戻す
  }
  ellipse(mx, my, 10, 10); //玉を表示
  px=mx; py=my; //直前の位置として代入
  println(gx+","+gy);
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
