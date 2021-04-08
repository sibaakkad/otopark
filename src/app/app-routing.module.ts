import { User } from './shared/services/user';
import { UserGuard } from './user.guard';
import { SignoutComponent } from './signout/signout.component';
import { ProfileComponent } from './profile/profile.component';

import { SignupComponent } from './signup/signup.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard } from './admin.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(["login"]);
const adminOnly = () => hasCustomClaim('admin');
const redirectLoggedInToIHome = () => redirectLoggedInTo(['makeres']);



const routes: Routes = [
  { path: 'signup', component: SignupComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToIHome } },
  { path: 'login', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToIHome } },

  //Admin Routes
  { path: 'changeprice', component: HomeComponent, canActivate: [AngularFireAuthGuard, AdminGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },


  //User Routes
  { path: 'profile', component: ProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'logout', component: SignoutComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
