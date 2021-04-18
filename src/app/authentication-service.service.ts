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
    
  }
/*
SignUp fonksiyonu:
Kullanıcının, uygulamaya kayıt 
sırasında girdiği bilgileri veri tabanında kaydeder
*/
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
/**
 * SignIn fonksiyonu:
  Firbasete hazır olan signInWithEmailAndPassword
   fonksiyonunu kullanarak, kullanıcı tarafından girilen e-posta ve şifre 
   bilgilerini veri tabanındaki kullanıcı
   bilgileriyle karşılaştırır ve uygulamanın oturum açmasına izin verir.
 */
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
/*
	SignOut fonksiyonu: 
 Kullanıcının uygulamadan çıkış yapmasına izin verir
*/
  async SignOut() {
    await this.angularFireAuth
      .signOut();
    this.getAccess();
  }

  /* 
    loggedIn fonksiyonu:
    Kullanıcının doğru bir şekilde uygulamaya giriş 
    yapıp yapmadığına bilgisini geriye döndürür.
  */
  async loggedIn() {
    await this.getAccess();
    return this.isUserIn;
  }
/*
⦁	adminOrNot fonksiyonu:
Kullanıcının admin olup olmadığı bilgisini geriye döndürür.


*/
  async adminOrNot() {
    await this.getAccess();
    return this.itItAdmin;
  }



  async getUserID() {
    //Oturum açmış kullanıcının id’yi geriye döndürür.
    let uid = await this.angularFireAuth.currentUser.then((res)=>res?.uid ? res?.uid : "");
    console.warn(uid);
    return uid.toString();
  }


  /*getAccess fonksiyonu: 
  Programa giren kullanıcı admin olup olmadığını kontrol etmek için 
  kullanmaktayım. Programa giriş yapan kişinin veri tabanından rolü 
  kontrol ediyor. Rolü a (yani yönetici) ise true, aksi takdirde geriye 
  false (yani normal kullanıcı) döndürür. Bu fonksiyon yalnızca kullanıcı 
  doğru şekilde oturum açtığında çalışır.
*/
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