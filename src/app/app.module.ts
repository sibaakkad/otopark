import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { ReservationsComponent } from './reservations/reservations.component';
import { MakeResComponent } from './make-res/make-res.component';
import { OpenGatesFormComponent } from './open-gates-form/open-gates-form.component';
import { ProfileComponent } from './profile/profile.component';
import { PreRezComponent } from './pre-rez/pre-rez.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule } from '@angular/forms';
import { SignoutComponent } from './signout/signout.component';
import { BaseScreenComponent } from './base-screen/base-screen.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    ReservationsComponent,
    MakeResComponent,
    OpenGatesFormComponent,
    ProfileComponent,
    PreRezComponent,
    SignoutComponent,
    BaseScreenComponent,
    UsersComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    MDBBootstrapModule.forRoot(),
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
