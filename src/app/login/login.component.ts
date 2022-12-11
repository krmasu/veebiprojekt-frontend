import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  password: string = 'admin';
  username: string = 'admin';
  inputData: Map<string, string> = new Map<string, string>([
    ['username', ''],
    ['password', ''],
    ['email', ''],
  ]);
  errorMessage: string = '';
  constructor(private http: HttpClient, private _router: Router) {}

  onInput(event: any) {
    this.inputData.set(event.target.name, event.target.value);
  }

  onLogin() {
    if (
      this.inputData.get('username') != '' &&
      this.inputData.get('password') != ''
    ) {
      try {
        this.http
          .post<any>('/api/public/login', {
            username: this.inputData.get('username'),
            password: this.inputData.get('password'),
          })
          .subscribe((data) => {
            sessionStorage.setItem('authToken', data.authToken);
            this.navigateToHome(data.id);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  navigateToHome(userId: Number) {
    sessionStorage.setItem('userId', userId.toString());
    this._router.navigateByUrl(`index`);
  }

  navigateToRegister() {
    this._router.navigate(['register']);
  }
}
