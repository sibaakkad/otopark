import { Router } from '@angular/router';
import { AuthenticationServiceService } from './../authentication-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(
    private auth:AuthenticationServiceService,
    private route:Router,
  ) { 
   
  }
/*
Kullanıcı çıkış Yap düğmesine bastığında,
 bu fonksiyon authentication service sınıfında 
 SignOut fonksiyonu çağırarak kullanıcının başarıyla 
 oturumu kapatmasına olanak tanır.
*/
 async ngOnInit() {
    await this.auth.SignOut();
    this.route.navigateByUrl("/login")
  }

}
