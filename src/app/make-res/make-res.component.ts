import { AuthenticationServiceService } from './../authentication-service.service';
import { AngularFireDatabase } from '@angular/fire/database';
import { HostListener, Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-make-res',
  templateUrl: './make-res.component.html',
  styleUrls: ['./make-res.component.css']
})
export class MakeResComponent implements OnInit {

  group = new FormGroup({
    atime: new FormControl(''),
    adate: new FormControl(''),
    ltime: new FormControl(''),
    ldate: new FormControl(''),
  });

  price: number = 0;
  theNewEvent: any;
  selectedPlace: any;
  unav: Array<[Number, boolean]>;
  errorRes: any;

  constructor(
    private render: Renderer2,
    private db: AngularFireDatabase,
    private auth: AuthenticationServiceService
  ) 
  {
    this.unav = [];
  }

  ngOnInit(): void {
    for (var i = 0; i < 10; i++) {
      this.unav.push([Number(i + 1), true]);
    }
  }

  /*
  onSave(frame: any, wrong: any, basicModal: any)
  this function save the data in firebase realtime after all the data is validated.
*/
  async onSave(frame: any, wrong: any, basicModal: any) {
    if (this.group.value["atime"] == "" || this.group.value["adate"] == "" || this.group.value["ltime"] == "" 
    || this.group.value["ldate"] == "" || this.selectedPlace == null) {
      this.errorRes = "Tüm alanlar doldur";
      wrong.show();
      return;
    }
    let r = Math.random().toString(36).substring(7); // generated code from 6 charcters or numbers
    let rezDate = new Date().getFullYear().toString() + "-" + new Date().getMonth() + "-" + new Date().getDay();
    let rezTime = new Date().getHours().toString() + ":" + new Date().getMinutes().toString();
    let enterDate = this.group.value["adate"];
    let enterTime = this.group.value["atime"];
    let exitDate = this.group.value["ldate"];
    let exitTime = this.group.value["ltime"];
    let uid = (await this.auth.getUserID()).toString();
    let situation = "active";
    let paied = false;
    let price = this.price;
    let plaka = (await this.db.database.ref("users").child(uid).child("plaka").get()).val();

    if (await this.controllBefore(enterDate, enterTime, exitDate, exitTime)) {
      let ref = [];
      for (var i = 0; i < 10; i++) {
        if (this.unav[i][1]) {
          ref.push(this.unav[i][0]);
        }
      }
      if (ref.indexOf(Number(this.selectedPlace)) != -1) {
        for (var i = 0; i < this.unav.length; i++) {
          if (this.unav[i][0] == this.selectedPlace) {
            if (this.unav[i][1]) {
              this.unav[i][1] = false;
            }
          }
        }
        await this.db.database.ref("rezervasyon").push({
          GeneratedCode: r,
          KulID: uid,
          durum: situation,
          enterDate: enterDate,
          enterTime: enterTime,
          odendi: paied,
          parkNo: plaka,
          rezDate: rezDate,
          rezTime: rezTime,
          exitDate: exitDate,
          exitTime: exitTime,
          place: this.selectedPlace,
          ücret: price,
        }).then((res) => {
          basicModal.hide();
          frame.show();
          for (var i = 0; i < this.unav.length; i++) {
            if (this.unav[i][0] == this.selectedPlace) {
              this.unav[i][1] = false;
            }
          }
        }).catch((err) => {
          this.errorRes = err;
         
          this.errorRes = "Tüm alanlar doldur";
          wrong.show();
        });
      } else {
       
        this.errorRes = "Bu yer daha önce seçildi";
        wrong.show();
      }
    }
    else {
      this.errorRes = "çıkış tarih ve saati, giriş tarih ve saatinden daha sonra olması gerekiyor"

      wrong.show();
    }

  }


/*
  controllBefore(enterDate: string, enterTime: string, exitDate: string, exitTime: string) 
  this function takes the date and the times of leaving and entering the garage to calculate price the and sure
  all the data is ok .
*/
  async controllBefore(enterDate: string, enterTime: string, exitDate: string, exitTime: string) {
    let enterTimeArr = enterTime.split(":");
    let exitTimeArr = exitTime.split(":");
    let datesCompared = this.compareDates(enterDate, exitDate);
    this.price = 0;
    if (datesCompared > 0 || (datesCompared == 0 && enterTimeArr.reduce((a, b) => a = a + b) < exitTimeArr.reduce((a, b) => a = a + b))) {
      let Days = Number(datesCompared);
      let percent = 0.0;
      percent = ((Days * 24 * 60) - (((Number(enterTimeArr[0]) * 60) + (Number(enterTimeArr[1]))) 
      - ((Number(exitTimeArr[0]) * 60) + (Number(exitTimeArr[1]))))) / 60;
      let adPrice = Number((await this.db.database.ref("admin").child("price").child("TL").get()).val());
      console.log(adPrice);
      let predicted = (percent * 60) * (adPrice/60)
      this.price = predicted;
      console.log((predicted));
      return true;
    }
    else {
      return false;
    }
  }

  
/*
  getPriceChange() function will be called every time date and time changes to update the prive will be paied.
*/
  async getPriceChange() {
    if (this.group.value["atime"] == "" || this.group.value["adate"] == "" 
    || this.group.value["ltime"] == "" || this.group.value["ldate"] == "") {
      return;
    }
    let enterDate = this.group.value["adate"];
    let enterTime = this.group.value["atime"];
    let exitDate = this.group.value["ldate"];
    let exitTime = this.group.value["ltime"];
    await this.controllBefore(enterDate, enterTime, exitDate, exitTime);
  }


/*
  compareDates(d1: any, d2: any) this function takes two dates and returns the days between the two dates 
  this function will be useful for price calculating and controlling the the leaving date is bigger or equal to the enter date 
*/
  compareDates(d1: any, d2: any): Number {
    let date1 = new Date(d2);
    let date2 = new Date(d1);
    var diff = Math.floor(date1.getTime() - date2.getTime());
    var day = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / day);
    return days;
  }

  /*
  cont(event: any)
  this function gets all the reserved places and unreserved places to show after choosing time and date.
  is has a parameter event to show and hide dialog.
*/

  async cont(event: any) {
    let enterDate = new Date(this.group.value["adate"] + " " + this.group.value["atime"]);
    let exitDate = new Date(this.group.value["ldate"] + " " + this.group.value["ltime"]);
    let ss = await this.db.database.ref("rezervasyon").get();
    ss.forEach(value => {
      let resenterDate = new Date(value.val()["enterDate"] + " " + value.val()["enterTime"]);
      let resexitDate = new Date(value.val()["exitDate"] + " " + value.val()["exitTime"]);
      if ((resenterDate < enterDate && resexitDate > enterDate) || (resenterDate < exitDate && resexitDate > exitDate)) {

        for (var i = 0; i < this.unav.length; i++) {
          if (this.unav[i][0] == value.val()["place"]) {
            if (this.unav[i][1]) {
              this.unav[i][1] = false;
            }

          }
        }
      }
    });
    event.show();
  }


/*
   btns(btn: any) this function to change the button colors on click while reserving the place. 
*/

  @HostListener('click', ['$event'])
  btns(btn: any) {
    let ref = [];
    for (var i = 0; i < 10; i++) {
      if (this.unav[i][1]) {
        ref.push(this.unav[i][0]);
      }
    }
    if (ref.indexOf(Number(btn.target.id)) != -1) {
      this.selectedPlace = btn.target.id;
      if (this.theNewEvent != null) {
        this.render.removeClass(this.theNewEvent, "selected");
      }
      this.render.addClass(btn.target, "selected");
      this.theNewEvent = btn.target;
    }

  }

}
