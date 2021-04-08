import { Router } from '@angular/router';
import { UserSignIn } from './shared/services/userSignIn';
import { UserSignUp } from './shared/services/userSignUp';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})


export class AuthenticationServiceService {


  itItAdmin;
  isUserIn;

  constructor(private angularFireAuth: AngularFireAuth, private db: AngularFireDatabase, private route: Router) {
    this.itItAdmin = false;
    this.isUserIn = false;
    
    console.log("here is constructor");
  }

  async SignUp(us: UserSignUp) {
    await this.angularFireAuth
      .createUserWithEmailAndPassword(us.email, us.password)
      .then(async (res) => {
        
        let uid = (res.user?.uid) ? (res.user?.uid) : "";
        const tutRef = this.db.database.ref("users").child(uid);

        tutRef.set({ email: us.email, name: us.name, surname: us.surname, plaka: us.plaka, role: "u", telefon: us.number, id: res.user?.uid });
        await this.getAccess();
      })
      .catch(error => {
        console.log('Something is wrong:', error.message);

      });
  }

  async SignIn(usi: UserSignIn) {
    
    return await this.angularFireAuth
      .signInWithEmailAndPassword(usi.email, usi.password)
      .then(async (res) => {

        await this.getAccess();
        
      })
      .catch(err => {
        err
      });
  }

  async SignOut() {
    console.log("here from out");
    await this.angularFireAuth
      .signOut();
    this.getAccess();
  }

  async loggedIn() {
    await this.getAccess();
    return this.isUserIn;
  }

  async adminOrNot() {
    await this.getAccess();
    return this.itItAdmin;
  }
  async getUserID() {
    let uid = await this.angularFireAuth.currentUser.then((res)=>res?.uid ? res?.uid : "");
    console.warn(uid);
    return uid.toString();
  }

  async getAccess() {
    let uid = await this.angularFireAuth.currentUser.then((res)=>res?.uid ? res?.uid : "");
    if (uid != "") {
      this.isUserIn = true;
      let role = "";
      await this.db.database.ref('/users').child(uid).child("role").once("value").then((read) => role = read.val());
      if (role == "a") {
        this.itItAdmin = true;
      }else{
        this.itItAdmin = false;
      }
    }else{
      this.isUserIn = false;
    }
   
  }
  
}