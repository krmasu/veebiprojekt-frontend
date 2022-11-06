import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'veebiprojekt-frontend';
  loggedIn: boolean = false;

  constructor() {
  }

  logIn(event: any) {
    this.loggedIn = event
  }
}


