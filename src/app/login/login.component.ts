import {Component, EventEmitter,  Output} from "@angular/core";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  password: string = 'admin';
  username: string = 'admin';
  loginData: Map<string, string> = new Map<string, string>([['username', ''], ['password', '']]);
  errorMessage: string = ''
  @Output() loginEvent = new EventEmitter<boolean>();

  onInput(event: any) {
    this.loginData.set(event.target.name, event.target.value)
    console.log(this.loginData)
  }

  onLogin() {
    if (this.loginData.get('password') == this.password && this.loginData.get('username') == this.username) {
      this.errorMessage = '';
      this.loginEvent.emit(true)
    } else {
      this.errorMessage = 'Error authenticating user'
    }
  }
}
