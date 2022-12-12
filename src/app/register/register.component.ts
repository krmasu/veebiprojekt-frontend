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
          });
      } catch (e) {
        console.log(e);
        alert('Registration failed');
      }
    }
  }

  navigateToLogin() {
    this._router.navigate(['login']);
  }
}
