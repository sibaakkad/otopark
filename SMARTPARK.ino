#include <Servo.h>

Servo GirisServo;
Servo CikisServo;

const int GirisSensor=14; //D5
const int CikisSensor=16; //D0

int YLed = 5; //D1 Yeşil
int KLed = 4;  //D2 Kırmızı
int BLed = 0; //D3 Beyaz
int Mled = 12; //D6 Mavi
int SLed = 13; //D7 Sarı

long  rasgeleSayi = 0;

void setup() 
{ 
  GirisServo.attach(2); //D4
  CikisServo.attach(15); //D8
  GirisServo.write(45);
  CikisServo.write(45);
  
  pinMode(YLed, OUTPUT);                 
  pinMode(KLed, OUTPUT);  
  pinMode(BLed, OUTPUT);                 
  pinMode(Mled, OUTPUT);
  pinMode(SLed, OUTPUT); 
              
  pinMode(GirisSensor,INPUT);    
  pinMode(CikisSensor,INPUT); 
  
  Serial.begin(9600);
}

void loop() 
{    
   digitalWrite(Mled, LOW); 
   digitalWrite(SLed, LOW);  
   digitalWrite(BLed, LOW); 

  long girisDurumu = digitalRead(GirisSensor);
  long cikisDurumu = digitalRead(CikisSensor);
  
 
  if(girisDurumu == HIGH)      //Sensör çıkışını kontrol etme.
  { 
    
    GirisServo.write(45);
    digitalWrite(KLed, HIGH);   // Kırmızı LED'i yanacak
    digitalWrite(YLed, LOW); 
     
     switch (rasgeleSayi) {
  case 1:
    digitalWrite(BLed, HIGH); 
    delay(6000);    
    break; 
    
  case 2:
  digitalWrite(Mled, HIGH);  
  delay(6000);
    break;
    
  case 3:
    digitalWrite(SLed, HIGH);
    delay(6000);
    break;   
    
  default:
  Serial.println("yanlis deger girildi ");
   
}
    Serial.println(girisDurumu);    
    rasgeleSayi = 0;
      
  }
  
  else
  { 
    delay(1000);
    rasgeleSayi = random(1,4);
    digitalWrite(KLed, LOW);    // Kırmızı LED'i sönecek
    digitalWrite(YLed, HIGH);
    GirisServo.write(140); 
    Serial.println(girisDurumu);   
     delay(4000);
   
  }
 
//Cikis
   if(cikisDurumu == LOW)      //Sensör çıkışını kontrol etme.
  { delay(1000); 
     CikisServo.write(140);
    digitalWrite(KLed, LOW);    // Kırmızı LED'i sönecek
    digitalWrite(YLed, HIGH);   
    Serial.println(cikisDurumu);    
    delay(4000);      
  }
  
  
  else
  { 
    CikisServo.write(45);
    Serial.println(cikisDurumu);   
       
  }
}
