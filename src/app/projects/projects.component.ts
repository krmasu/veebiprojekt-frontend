import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @Input() showProjects: any[] = [{ title: 'example', id: 'example' }];
  constructor(
    private _router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}
  newProjectName = '';
  userId = -1;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.userId = Number(params['userId']);
    });
  }

  onInput(event: any) {
    this.newProjectName = event.target.value;
  }

  registerProject() {
    if (this.userId != -1) {
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        this.http
          .post<any>(
            '/api/project',
            { ownerId: this.userId, title: this.newProjectName },
            { headers: headers }
          )
          .subscribe((data) => {
            this.showProjects = data;
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  deleteProject(projectId: Number) {
    if (this.userId != -1) {
      try {
        const options = {
          headers: new HttpHeaders()
            .set('content-type', 'application/json')
            .set(
              'Authorization',
              `Bearer ${localStorage.getItem('authToken')}`
            ),
          body: { ownerId: this.userId, projectId: projectId },
        };
        this.http.delete<any>('/api/project', options).subscribe((data) => {
          this.showProjects = data;
        });
      } catch (e) {
        console.log(e);
      }
    }
  }

  navigateToProjects() {
    this._router.navigate(['projects']);
  }

  navigateToHome() {
    this._router.navigate(['home']);
  }

  navigateToProjectView(projectId: Number) {
    this._router.navigateByUrl(
      `project-view?userId=${this.userId}&projectId=${projectId}`
    );
  }
}
