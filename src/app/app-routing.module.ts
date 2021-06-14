import { UsersComponent } from './users/users.component';
import { User } from './shared/services/user';
import { BaseScreenComponent } from './base-screen/base-screen.component';
import { UserGuard } from './user.guard';
import { SignoutComponent } from './signout/signout.component';
import { PreRezComponent } from './pre-rez/pre-rez.component';
import { ProfileComponent } from './profile/profile.component';
import { OpenGatesFormComponent } from './open-gates-form/open-gates-form.component';
import { MakeResComponent } from './make-res/make-res.component';
import { ReservationsComponent } from './reservations/reservations.component';
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
  { path: 'users', component: UsersComponent, canActivate: [AngularFireAuthGuard, AdminGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'res', component: ReservationsComponent, canActivate: [AngularFireAuthGuard, AdminGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },

  //User Routes
  { path: '', component: BaseScreenComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'makeres', component: MakeResComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'openGates', component: OpenGatesFormComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'profile', component: ProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'prerez', component: PreRezComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  { path: 'logout', component: SignoutComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
