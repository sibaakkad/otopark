import { Router } from '@angular/router';
import { AuthenticationServiceService } from './../authentication-service.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModalDirective } from 'angular-bootstrap-md';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  visibleProgressBar = true;
  group = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    phone: new FormControl(''),
    plaka: new FormControl(''),
  });
  userID = "";
  constructor(private db: AngularFireDatabase, private angularFireAuth: AngularFireAuth,
    private auth: AuthenticationServiceService,
    private route: Router,
    private el: ElementRef,

  ) {

    this.userID = "";
  }

  async ngOnInit() {
    await this.getUserData();
    this.visibleProgressBar=false;
  }
  /*
  ⦁	onSubmit fonksiyonu:
  Kullanıcı arayüzü üzerinden girilen bilgelerdeki (ad, soyadı, plaka numarası ve telefon numarası) değişiklik,
   veri tabanında güncellemesi sağlar.
  */
  async onSubmit() {
    await this.db.database.ref("users").child(this.userID).update({ name: this.group.value["name"], surname: this.group.value["surname"], telefon: this.group.value["phone"], plaka: this.group.value["plaka"] });
    await this.getUserData();
  }
  ss(frame:any){
    this.onSubmit();
    frame.show();
  }
/*
Arayüz üzerindeki veri tabanında güncellenen kullanıcı 
bilgilerinin görüntülenmesine olanak sağlar.
*/
  async getUserData() {
    this.userID = await this.auth.getUserID() ? await this.auth.getUserID() : "";
    let userData = await (await this.db.database.ref("users").child(this.userID).get()).val();

    this.group.setValue({
      name: userData["name"],
      surname: userData["surname"],
      phone: userData["telefon"],
      plaka: userData["plaka"]
    });
  }

}
