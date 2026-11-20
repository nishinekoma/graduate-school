// AnalogReporter --- A simple sample which reports accelerometer values to PC
// written by Yoshihiro OHMI <ohmi@rsch.tuis.ac.jp>

int X0G=534, Y0G=525, Z0G=568; //0Gのセンサ値
int X1G=743, Y1G=746, Z1G=762; //1Gのセンサ値

void setup() {
  pinMode(2, INPUT); // for push switch
  digitalWrite(2, HIGH); // pull up
  Serial.begin(38400);
}

void loop() {
  int ax = analogRead(A1);
  int ay = analogRead(A2);
  int az = analogRead(A0);
  int sw = 1-digitalRead(2);
  float gx = float(ax-X0G)/(X1G-X0G);
  float gy = float(ay-Y0G)/(Y1G-Y0G);
  float gz = float(az-Z0G)/(Z1G-Z0G);
  // output format "AX,AY,AZ,SW"
  Serial.print(gx,2);
  Serial.print(",");
  Serial.print(gy,2);
  Serial.print(",");
  Serial.print(gz,2);
  Serial.print(",");
  Serial.print(sw);
  Serial.println();
  Serial.flush();
  delay(1000/30);
}
