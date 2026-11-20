// ArduinoAScroll - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
int sw;
float gx,gy,gz;
final float THRESHOLD=0.03; //スクロールし始める閾値
final int SCROLL_SPEED=50;//スクロール速度(100が標準)
PImage im;
PFont myFont;
int x, y; // 画像の表示位置(画面左上)
int dx, dy; // マウスドラッグ用
void setup() {
  myFont = loadFont("CourierNewPSMT-24.vlw");
  textFont(myFont, 24);
  size(800,600);
  x=y=0;
  im = loadImage("image.jpg");
  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
}
void draw() { 
//  println(gx+","+gy);
  // 傾きが閾値を超えたらスクロール
  if(abs(gx)>=THRESHOLD) x-=gx*SCROLL_SPEED;
  if(abs(gy)>=THRESHOLD) y-=gy*SCROLL_SPEED;
  limitCheck();
  image(im, -x, -y);
  fill(255,0,0);
  text("("+x+","+y+")", 50,50);
}
void mousePressed() {
  dx = x+mouseX; dy = y+mouseY;
}
void mouseDragged() {
  x = dx-mouseX; y = dy-mouseY;
  limitCheck();
}
void limitCheck() { // 位置が画面端を超えていないかチェック
  x = constrain(x,0,im.width-width);
  y = constrain(y,0,im.height-height);
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
