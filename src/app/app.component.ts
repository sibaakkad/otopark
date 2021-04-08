import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy ,Injectable } from '@angular/core';
import { AuthenticationServiceService } from './authentication-service.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent implements OnInit {
  loggedin: boolean = true;
  admin: boolean = true;
  theTime: any;
  userId: any;
  constructor(private auth: AuthenticationServiceService, private route: Router) {
    this.loggedin =  this.auth.isUserIn;
    this.admin =     this.auth.itItAdmin;
  }

  ngOnInit() {
    
    interval(0).subscribe(async (x) => {
      this.loggedin = await this.auth.loggedIn();
    this.admin =await this.auth.adminOrNot();
    });
  }

  ngOnDestroy() {
    this.theTime.unsubscribe();
  }




}
