// ArduinoAGraph - written by Yoshihiro OHMI
import processing.serial.*;

Serial arduino;
final int PSIZE=150;
int sw;
float gx,gy,gz;
float[] px,py,pz; // 過去のG値
int ix,iy,iz; // 現在の値の位置
PFont myFont;

void setup() {
  size(800,600);
  myFont = loadFont("CourierNewPSMT-24.vlw");
  ix=iy=iz=0;
  px=new float[PSIZE];
  py=new float[PSIZE];
  pz=new float[PSIZE];

  String[] list = Serial.list();
//  arduino = new Serial(this, list[0], 38400);
  arduino = new Serial(this, list[list.length-1], 38400);
  arduino.bufferUntil(10);
}
void draw() {
  background(240,240,220); 

  for(int i=-150; i<=150; i+=25) {
    if(i%100==0) {
      strokeWeight(2);
      stroke(0,0,0);
    }
    else {
      strokeWeight(0);
      stroke(200,200,200);
    }
    line(150,300+i,700,300+i);
  }
 
  rectMode(CORNERS);
  fill(255,0,0,90);stroke(255,0,0);
  drawGraph(gx,px,ix,150,300);
  fill(0,255,0,90);stroke(0,255,0);
  drawGraph(gy,py,iy,350,300);
  fill(0,0,250,90);stroke(0,0,250);
  drawGraph(gz,pz,iz,550,300);

  fill(0,0,0);
  textFont(myFont, 48);
  text("X", 220,50);
  text("Y", 420,50);
  text("Z", 620,50);  
  text("-1G", 50,215);
  text(" 0G", 50,315);
  text("+1G", 50,415);
  fill(100,0,0);
  fill(0,0,100);
  textFont(myFont, 24);
  text("G value",20,530);
  text("(1G=1.0)",20,550);
  textFont(myFont, 40);
  text(gx, 160,550);
  text(gy, 360,550);
  text(gz, 560,550);
  
  px[ix]=gx;py[iy]=gy;pz[iz]=gz;
  ix=(ix+1)%PSIZE;iy=(iy+1)%PSIZE;iz=(iz+1)%PSIZE;
}

void drawGraph(float v, float[] pv, int iv, int x, int y) {
  rect(x, y, x+150, y+v*100);
  noFill();
  beginShape();
  for(int i = 0; i < PSIZE; i++) {
    vertex(x+i, y+pv[(i+iv)%PSIZE]*100);
  }
  endShape();
}

void serialEvent(Serial p) {
  try {
    String line = p.readString();
    float[] d = float(split(line, ','));
    gx = d[0]; gy = d[1]; gz = d[2]; sw = (int)d[3];
  } catch(RuntimeException e) {;
  }
}
