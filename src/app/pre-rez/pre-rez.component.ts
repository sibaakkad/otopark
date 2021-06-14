import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from '../authentication-service.service';
import { Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-pre-rez',
  templateUrl: './pre-rez.component.html',
  styleUrls: ['./pre-rez.component.css']
})
export class PreRezComponent implements OnInit {
  
  visibleProgressBar:boolean=true;
  values:Array<any>;
  constructor(
    private auth: AuthenticationServiceService,
    public router: Router,
    private db:AngularFireDatabase,
    ) {
      this.values = [];
  }

  /*
  Get all the reservation as well as loading page.
  */
  async ngOnInit() {
    this.values = [];
    let ss = await this.db.database.ref("rezervasyon").get();
    let uid = await this.auth.getUserID();
    ss.forEach(value => {
      
      if(value.val()["KulID"] === uid){
        this.values.push([value.key , value.val()]);
      }
          
    });
   
    console.warn(this.values);
    this.visibleProgressBar = false;
  }
  async ode(value:string){
    await this.db.database.ref("rezervasyon").child(value).update({
      odendi:true
    });
    this.ngOnInit();
  }
  ngOnDestroy() {
  }

}
