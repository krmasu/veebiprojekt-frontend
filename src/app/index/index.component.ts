import { Component, OnInit } from '@angular/core';
import { Employee } from '../model/employee';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  projects: any[] = [];
  quote = 'Requesting quote...';
  quoteAuthor = 'Anoynymous';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    if (this.userId != -1) {
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('authToken')}`
          );
        this.http
          .post<any>(
            '/api/user',
            {
              id: this.userId,
            },
            { headers: headers }
          )
          .subscribe((data) => {
            this.username = data.username;
            this.email = data.email;
            this.projects = data.projects;
          });

        this.http
          .get<any>('/api/quote/knowledge', { headers: headers })
          .subscribe((data) => {
            this.quote = data.quote;
            this.quoteAuthor = data.author;
          });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
