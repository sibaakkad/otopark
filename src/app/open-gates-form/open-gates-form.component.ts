import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthenticationServiceService } from '../authentication-service.service';



@Component({
  selector: 'app-open-gates-form',
  templateUrl: './open-gates-form.component.html',
  styleUrls: ['./open-gates-form.component.css']
})
export class OpenGatesFormComponent implements OnInit {


  getin = new FormGroup({
    getinCode: new FormControl(''),
  });
  getout = new FormGroup({
    getoutCode: new FormControl(''),
  });
  userid: any;
  rezs: Array<any>;
  error: string = "";
  constructor(private auth: AuthenticationServiceService, private db: AngularFireDatabase) {
    this.rezs = [];
  }

  async ngOnInit() {
    this.userid = await this.auth.getUserID();
  }

  async enter(frame: any, wrong: any) {
    let dateArray: Array<any> = [];
    let timeArray: Array<any> = [];
    let date = new Date();
    let isitOk = false;
    let ss = await this.db.database.ref("rezervasyon").get();
    ss.forEach(value => {
      if (value.val()["KulID"] === this.userid) {
        let key = value.key || "sdadss";
        dateArray = value.val()["enterDate"].split("-");
        timeArray = value.val()["enterTime"].split(":");
        let situation = value.val()["durum"];
        let code = value.val()["GeneratedCode"];
        let times = this.timeComparing(timeArray[0], timeArray[1], date.getHours(), date.getMinutes());
                                                                                                                                                                                        
        if (date.getFullYear().toString() == dateArray[0] && String(date.getMonth() + 1).padStart(2, '0') == dateArray[1] 
        && String(date.getDate()).padStart(2, '0') == dateArray[2] && /*Durum*/ situation == "active" && times) {
          //the reservation should be on the same day of today and it's situation should be activa and then the time of now should be so close 
          //to the reservation time it can be before 5 min and it can be after 15 min 
          if (this.getin.value["getinCode"] === code) {
            isitOk = true;
            this.db.database.ref("gate").child("frontDoor").set({
              situation: true
            });
            this.db.database.ref("rezervasyon").child(key).update({
              durum: "girdi"
            });
            frame.show();
            return;
          }
        }
      }
    });
    console.log(isitOk);
    if (!isitOk) {
      this.error = "kod yanlış yada giriş saati gelmedi"
      wrong.show();
    }
  }

  async exit(frame: any, wrong: any) {

    let dateArray: Array<any> = [];
    let timeArray: Array<any> = [];
    let isitOk = false;
    
    let ss = await this.db.database.ref("rezervasyon").get();
    ss.forEach(value => {
      if (value.val()["KulID"] === this.userid) {
        let key = value.key || "sdadss";
        dateArray = value.val()["enterDate"].split("-");
        timeArray = value.val()["enterTime"].split(":");
        let situation = value.val()["durum"];
        let odeme = Boolean(value.val()["odendi"]);
        let code = value.val()["GeneratedCode"];
        console.log(code);
        if (situation === "girdi") {
          if (this.getout.value["getoutCode"] === code && odeme) {
            isitOk = true;
            this.db.database.ref("gate").child("backDoor").set({
              situation: true
            });
            this.db.database.ref("rezervasyon").child(key).update({
              durum: "çikti"
            });
            frame.show();
            return;
          }
        }
      }
    });
    if (!isitOk) {
      this.error = "kod yanlış yada ödeme yapılmadı"
      wrong.show();
    }


  }

  timeComparing(h1: number, m1: number, h2: number, m2: number): boolean {

    // if the reservation between 5 min before and 15 min after return true else return false

    let w3 = Number(h1) * 60 + Number(m1);
    let r3 = h2 * 60 + m2;
    if (w3 - r3 < 6 && w3 - r3 > -15) {
      return true;
    } else {
      return false;
    }


  }



}
