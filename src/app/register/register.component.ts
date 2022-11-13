import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  inputData: Map<string, string> = new Map<string, string>([['username', ''], ['password', ''], ['email', '']]);

  constructor(private http: HttpClient, private _router: Router) { }

  ngOnInit(): void {
  }
  onInput(event: any) {
    this.inputData.set(event.target.name, event.target.value)
    console.log(this.inputData)
  }

  onRegister() {
    this.http.post<any>('/api/register', { username: this.inputData.get('username'), password: this.inputData.get('password'), email: this.inputData.get('email')}).subscribe(data => {
      console.log(data)
    })
    this.navigateToLogin()
  }

  navigateToLogin() {
    this._router.navigate(['login'])
  }
}
