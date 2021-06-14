import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationServiceService } from '../authentication-service.service';


@Component({
  selector: 'app-base-screen',
  templateUrl: './base-screen.component.html',
  styleUrls: ['./base-screen.component.css']
})
export class BaseScreenComponent implements OnInit {
  userId :any;
  constructor(private auth:AuthenticationServiceService, private route:Router ){
    this.userId = "0"; 
  }
  async ngOnInit(){
    this.userId  = await this.auth.getUserID();
    if(!this.userId){
      this.route.navigate(["login"]);
    }else{
      this.route.navigate(["prerez"]);
    }

   
    }

}
