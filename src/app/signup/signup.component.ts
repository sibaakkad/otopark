import { Router } from '@angular/router';
import { UserSignUp } from './../shared/services/userSignUp';
import { User } from './../shared/services/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { AuthenticationServiceService } from '../authentication-service.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  myGroup = new FormGroup({
    name: new FormControl(''),
    surname: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    number: new FormControl(''),
    plaka: new FormControl(''),
  });

  constructor(private Service: AuthenticationServiceService , private route:Router ) {

  }

  ngOnInit(): void {
    if(this.Service.isUserIn){
      if(this.Service.itItAdmin){
        this.route.navigate(["prerez"]);
      }else{

        this.route.navigate(["makeres"]);
      }
    }
  }
  async onSubmit() {
    let ur: UserSignUp;
    ur = { 
      name: this.myGroup.value["name"], 
      surname: this.myGroup.value["surname"], 
      email: this.myGroup.value["email"], 
      password: this.myGroup.value["password"], 
      number: this.myGroup.value["number"], 
      plaka: this.myGroup.value["plaka"] };


   await this.Service.SignUp(ur);
    this.route.navigate(["makeres"]);
  }


}
