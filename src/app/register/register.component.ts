import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  inputData: Map<string, string> = new Map<string, string>([
    ['username', ''],
    ['password', ''],
    ['email', ''],
  ]);
  registrationSuccess = false;

  constructor(private http: HttpClient, private _router: Router) {}

  ngOnInit(): void {}
  onInput(event: any) {
    this.inputData.set(event.target.name, event.target.value);
  }

  onRegister() {
    if (
      this.inputData.get('username') != '' &&
      this.inputData.get('password') != '' &&
      this.inputData.get('email') != ''
    ) {
      try {
        this.http
          .post<any>('/api/public/register', {
            username: this.inputData.get('username'),
            password: this.inputData.get('password'),
            email: this.inputData.get('email'),
          })
          .subscribe((data) => {
            this.registrationSuccess = true;
            alert('Registration successful');
            this.onLogin();
          });
      } catch (e) {
        console.log(e);
        alert('Registration failed');
      }
    }
  }

  onLogin() {
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

  navigateToHome(userId: Number) {
    sessionStorage.setItem('userId', userId.toString());
    this._router.navigateByUrl(`index`);
  }

  navigateToLogin() {
    this._router.navigate(['login']);
  }
}
