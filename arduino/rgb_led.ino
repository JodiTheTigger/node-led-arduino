#define slen 7        // 7 characters, e.g. '#ff6666'

char serInStr[slen];  // array to hold the incoming serial string bytes

int red=3, 
    green=5,
    blue=6, 
    i=0,
    j=0,
    color[]={red, green, blue},  // since array counts start a 0, color[0]=9, color[1]=10, color[2]=11
    intensity[]={0, 0,0}; // one intensity level for each color
 
void setup()
{
  // set pins as outputs
  pinMode(red,OUTPUT);
  pinMode(green,OUTPUT);
  pinMode(blue,OUTPUT);
  
  // turn off all colors
  analogWrite(red,0);
  analogWrite(green,0);
  analogWrite(blue,0);
  
  // get ready to listen  
  Serial.begin(9600);
}

//read a string from the serial and store it in an array
int readSerialString() 
{
  int i=0;
  
  if(!Serial.available()) 
  {
    return -1;
  }
  
  while (Serial.available() && i < slen) 
  {
    int c = Serial.read();
    serInStr[i++] = c;
  }
  
  Serial.println(serInStr);
  return i;
}

void loop()
{
  int spos = readSerialString();
  
  if ((spos==slen) && (serInStr[0] == '#'))
  {
    long colorVal = strtol(serInStr+1,NULL,16);
    Serial.print("setting color to r:");
    Serial.print((colorVal&0xff0000)>>16);
    Serial.print(" g:");
    Serial.print((colorVal&0x00ff00)>>8);
    Serial.print(" b:");
    Serial.println((colorVal&0x0000ff)>>0);
    memset(serInStr,0,slen);      // indicates we’ve used this string
    //spos = 0;
    analogWrite(red, (colorVal&0xff0000)>>16 );
    analogWrite(green, (colorVal&0x00ff00)>>8 );
    analogWrite(blue, (colorVal&0x0000ff)>>0 );
  }
  
  delay(200);  // wait a bit, for serial data
}


