import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from '../authentication-service.service';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users:Array<any>=[];
  
  constructor(private db:AngularFireDatabase) {
    
  }

  async ngOnInit() {
    let records = await this.db.database.ref("/users").get();
    records.forEach((el1) => {
      this.users.push({
        email : el1.val()["email"],
        role : el1.val()["role"],
        name : el1.val()["name"],
        surname : el1.val()["surname"],
        telefon:el1.val()["telefon"],
    });
  });
}

}
