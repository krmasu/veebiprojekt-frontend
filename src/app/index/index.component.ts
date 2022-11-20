import { Component, OnInit } from '@angular/core';
import { Employee } from '../model/employee';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  allEmployees: Employee[] = [];
  navbarItem = 'home';
  userId: Number = -1;
  username = '';
  email = '';
  projects = [];

  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = Number(params['userId']);
    });
    if (this.userId != -1) {
      try {
        this.http
          .post<any>('/api/user', {
            id: this.userId,
          })
          .subscribe((data) => {
            this.username = data.username;
            this.email = data.email;
            this.projects = data.projects;
            console.log(this.username);
            console.log(this.email);
            console.log(this.projects);
          });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
