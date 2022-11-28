import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {
  projectId: Number = -1;
  userId: Number = -1;
  projectTitle = '';
  newTitle = '';
  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.projectId = Number(params['projectId']);
      this.userId = Number(params['userId']);
    });
    if (this.projectId != -1) {
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        this.http
          .get<any>(`/api/project/${this.projectId}`, { headers: headers })
          .subscribe((data) => {
            console.log(data);
            this.projectTitle = data.title;
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  onInput(event: any) {
    this.newTitle = event.target.value;
  }

  updateProject() {
    try {
      const options = {
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`),
      };
      this.http
        .patch<any>(
          '/api/project',
          { projectId: this.projectId, title: this.newTitle },
          options
        )
        .subscribe((data) => {
          this.projectTitle = data.title;
        });
    } catch (e) {
      console.log(e);
    }
  }
}
