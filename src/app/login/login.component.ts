import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent {
  password: string = 'admin';
  username: string = 'admin';
  inputData: Map<string, string> = new Map<string, string>([['username', ''], ['password', ''], ['email', '']]);
  errorMessage: string = ''
  constructor(private http: HttpClient, private _router: Router) { }


  onInput(event: any) {
    this.inputData.set(event.target.name, event.target.value)
    console.log(this.inputData)
  }

  onLogin() {
    if (this.inputData.get('password') == this.password && this.inputData.get('username') == this.username) {
      this.errorMessage = '';
      this.navigateToHome();
    } else {
      this.errorMessage = 'Error authenticating user'
    }
  }
  navigateToHome() {
    this._router.navigate(['home'])
  }

  navigateToRegister() {
    this._router.navigate(['register'])
  }

}
