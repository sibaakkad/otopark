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

 async ngOnInit() {
    await this.auth.SignOut();
    console.log("after signedOut");
    this.route.navigateByUrl("/login")
  }

}
