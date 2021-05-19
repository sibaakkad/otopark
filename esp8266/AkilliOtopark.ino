// Uygulamaya gerekli kütüphaneleri eklemesi
#include <Servo.h>
#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>

/* 1.  WiFi kimlik bilgilerini tanımlaması*/
#define WIFI_SSID "WiFi’nin adı "
#define WIFI_PASSWORD "WiFi’nin şifresi"

/* 2. API Anahtarını (veri tabanı gizli anahtarı) tanımlaması */
#define API_KEY "API Anahtarı"

/* 3. Firebase URL'sini tanımlaması */
#define DATABASE_URL "Firebase URL'si"

/* 4. Veri gönderme ve alma için FirebaseESP8266 veri nesnesini tanımlaması */
FirebaseData fbdo;

// Servo Kütüphanesi kullanılarak iki nesne oluşturulması
Servo GirisServo;
Servo CikisServo;

/*İR Sensörler için iki değişken tanımlaması
  ve sensör ile NodeMCU bağlayacağımız pin numarası ataması */
const int GirisSensor = 14; //D5
const int CikisSensor = 16; //D0

/*Ledler için 5 değişken tanımlaması
  ve led ile NodeMCU bağlayacağımız pin numarası ataması*/
int YLed = 5; //D1 Yeşil
int KLed = 4;  //D2 Kırmızı
int BLed = 0; //D3 Beyaz
int Mled = 12; //D6 Mavi
int SLed = 13; //D7 Sarı

long  rasgeleSayi = 0;


void setup()
{
  /*Tanımlanan servo nesnelerin hangi pini kullanacağının belirtilmesi */
  GirisServo.attach(2); //D4
  CikisServo.attach(15); //D8

  // Servoların ilk konumunu 45 derece belirtilmesi
  GirisServo.write(45);
  CikisServo.write(45);

  /*Belirtilen led pinin bir çıkış pini olarak kullanılacağının belirtilmesi*/
  pinMode(YLed, OUTPUT);
  pinMode(KLed, OUTPUT);
  pinMode(BLed, OUTPUT);
  pinMode(Mled, OUTPUT);
  pinMode(SLed, OUTPUT);

  /*Belirtilen IR Sensör pinin bir giriş pini olarak kullanılacağının belirtilmesi*/
  pinMode(GirisSensor, INPUT);
  pinMode(CikisSensor, INPUT);

  Serial.begin(115200);

  // Ağa bağlanma
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");

  //Bağlantı başarılı bir şekilde kurulana kadar bekliyor.

  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());  // ESP8266'nın IP adresini bilgisayara gönderiyor.
  Serial.println();

  /*  Kütüphanenin kimlik doğrulama verileriyle başlatılması */
  Firebase.begin(DATABASE_URL, API_KEY);

  /* Bağlantı kesildiğinde WiFi'ye otomatik yeniden bağlanmayı etkinleştirme */
  Firebase.reconnectWiFi(true);

}

void loop()
{
  //Mavi, sarı ve beyaz ledlerin sönmesi
  digitalWrite(Mled, LOW);
  digitalWrite(SLed, LOW);
  digitalWrite(BLed, LOW);

  /*DigitalRead () fonksiyonu ile sensörlerden gelen değeri okunması
    ve long tipindeki değişkende saklanması*/
  long girisDurumu = digitalRead(GirisSensor);
  long cikisDurumu = digitalRead(CikisSensor);

  // GetBool fonksiyonu yardımıyla Firebase'den giriş kapısının  durumuna (açık / kapalı) elde ediyoruz.
  Firebase.getBool(fbdo, "/gate/frontDoor/situation");
  Serial.print("firebase durumu : ");
  Serial.println( fbdo.boolData());

  if (girisDurumu == HIGH )     //Giriş sensörü çıkışını kontrol etme.
  {
    //Sensörde hiçbir şey algılanmazsa, bu eylemler gerçekleştirilecektir.

    GirisServo.write(45); // Giriş Servosu 45 derce döndürmesi
    digitalWrite(KLed, HIGH);   // Kırmızı LED'i yanacak
    digitalWrite(YLed, LOW); //Yeşil led sönmesi

    /*Bu kod parçası araç otoparka girdiğinde kullanıcının ayırdığı parkının ledi yanmasını sağlıyor.*/
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

  /*Giriş sensöründe bir araç algılandığında
    ve firebase’ten gelen giriş kapısının durumu true ise, bu eylemler gerçekleştirilecektir.*/
  else if (girisDurumu == LOW && fbdo.boolData())
  {
    delay(1000);

    /* Otoparka girmeye çalışan kullanıcının ayırdığı park numarasını firebase’ten elde ediyoruz
      ve rasgeleSayi değişkenine atıyoruz.
      Bu değişkeni kullanarak araç otoparka girdiğinde kullanıcının ayırdığı parkının ledi yanmasını sağlamaktadır.*/
    Firebase.getInt(fbdo, "/place/number");
    rasgeleSayi = fbdo.intData();
    Serial.print("place number : ");
    Serial.println(rasgeleSayi);

    digitalWrite(KLed, LOW);   // Kırmızı LED'i sönecek
    digitalWrite(YLed, HIGH); //Yeşil led yanacak
    GirisServo.write(140);   //Giriş kapısı açılacak
    Serial.println(girisDurumu);

    /*giriş sensörünün önünden araba geçmesini bekleyecek.*/
    while ( digitalRead(GirisSensor) == LOW) {
      Serial.println("giriş açık .. .. .. ..");
    }
    Serial.println("updated");

    /*araba giriş kapısından geçtikten sonra,
      firebase’te giriş kapısının durumu setBool fonksiyonu yardımıyla false olarak güncellenir.*/
    bool t = false;
    if (Firebase.setBool(fbdo, "/gate/frontDoor/situation", t))
    {
      Serial.println("PASSED");
    }
  }

  // Çıkış kapısı

  /*getBool fonksiyonu yardımıyla Firebase'den çıkış kapısının durumunu (açık / kapalı) elde ediyoruz.*/
  Firebase.getBool(fbdo, "/gate/backDoor/situation");
  Serial.print("firebase durumu : ");
  Serial.println( fbdo.boolData());

  /* Çıkış sensöründe bir araç algılandığında ve
      firebase’ten gelen çıkış kapısının durumu true ise,
      bu eylemler gerçekleştirilecektir.*/
  if (cikisDurumu == LOW && fbdo.boolData())
  { delay(1000);
    digitalWrite(KLed, LOW);    //Kırmızı LED'i sönecek
    digitalWrite(YLed, HIGH);  //Yeşil led yanacak
    CikisServo.write(140);    //Çıkış kapısı açılacak

    //Çıkış sensörünün önünden araba geçmesini bekleyecek.
    while ( digitalRead(CikisSensor) == LOW) {
      Serial.println("çıkış açık ");
    }
    Serial.println("updated");

    /*araba çıkış kapısından geçtikten sonra,
      firebase’te çıkış kapısının durumu setBool fonksiyonu yardımıyla false olarak güncellenir.*/
    bool t = false;
    if (Firebase.setBool(fbdo, "/gate/backDoor/situation", t))
    {
      Serial.println("PASSED");
    }
  }

  else
  {
    //Sensörde hiçbir şey algılanmazsa, bu eylemler gerçekleştirilecektir.

    CikisServo.write(45); //Çıkış Servosu 45 derce döndürmesi
    Serial.println(cikisDurumu);
  }
}
