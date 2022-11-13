import { NgModule } from '@angular/core';
import {Router, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {IndexComponent} from "./index/index.component";
import { RegisterComponent } from './register/register.component';
import {ProjectsComponent} from "./projects/projects.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component:HomeComponent},
  {path: '', component: LoginComponent},
  {path: 'projects', component: ProjectsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

  constructor(private _router: Router) { }

  navigateToLogin() {
    this._router.navigate(['login'])
  }
  navigateToHome() {
  this._router.navigate(['home'])
  }
}
