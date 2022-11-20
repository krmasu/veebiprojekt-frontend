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
    console.log(this.inputData);
  }

  onLogin() {
    if (
      this.inputData.get('username') != '' &&
      this.inputData.get('password') != ''
    ) {
      try {
        this.http
          .post<any>('/api/login', {
            username: this.inputData.get('username'),
            password: this.inputData.get('password'),
          })
          .subscribe((data) => {
            this.navigateToHome(data.id);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  navigateToHome(userId: Number) {
    this._router.navigate(['home', { queryParams: { userId: userId } }]);
  }

  navigateToRegister() {
    this._router.navigate(['register']);
  }
}
