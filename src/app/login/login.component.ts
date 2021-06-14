import { UserSignIn } from './../shared/services/userSignIn';
import { UserSignUp } from './../shared/services/userSignUp';
import { User } from './../shared/services/user';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable } from 'rxjs';
import { AuthenticationServiceService } from '../authentication-service.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  error:string="";
  visibleProgressBar = false;
  group = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private Service: AuthenticationServiceService, private route: Router) {

  }

  ngOnInit() {
    
  }


  /*
  Kullanıcı girişYap düğmesine bastığında, 
  bu fonksiyon kullanıcı arayüz üzerinde girdiği bilgileri (mail ve şifre) alıp authentication 
  service sınıfında SignIn fonksiyona gönderir. Ardından kullanıcı 
  oturum açıp açmadığını kontrol edecek ve 
  buna göre kullanıcı başka sayfaya yönlendirecektir. 
  */
  async onSubmit() {
    this.error="";
    this.visibleProgressBar = true;
    let usi: UserSignIn;
    usi = {
      email: this.group.value["email"],
      password: this.group.value["password"],
    }
    await this.Service.SignIn(usi) ;
    let isIn = await this.Service.loggedIn();
    if (isIn) {

      this.route.navigate(["prerez"]);
      this.visibleProgressBar = false;


    }else{
      this.error = "Eposta yada şifre hatalı"
      this.visibleProgressBar = false;
    }

  }
}
