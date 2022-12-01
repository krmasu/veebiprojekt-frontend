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
  newTaskData: Map<string, string> = new Map<string, string>([
    ['title', ''],
    ['description', ''],
    ['deadline', ''],
  ]);
  pages = [0, 1, 2, 3, 4, 5];
  projectTasks = [
    {
      title: 'example',
      description: '',
      deadline: '',
      labels: [],
      milestoneId: '',
      statusId: '',
      assignee: '',
    },
  ];
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
    this.onGetTasks();
  }

  onInput(event: any) {
    this.newTitle = event.target.value;
  }

  onNewTaskInput(event: any) {
    this.newTaskData.set(event.target.name, event.target.value);
    console.log(this.newTaskData);
  }

  onGetTasks(sort = '', size = 10, page = 1) {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
      this.http
        .get<any>(
          `/api/project/${this.projectId}/task/${
            sort && `?sort=${sort}?limit=${size}?page=${page}`
          }`,

          { headers: headers }
        )
        .subscribe((data) => {
          console.log(data);
          this.projectTasks = data.tasks;
        });
    } catch (e) {
      console.log(e);
    }
  }

  onAddTask() {
    if (this.newTaskData.get('title')) {
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
        this.http
          .post<any>(
            `/api/project/${this.projectId}/task`,
            {
              title: this.newTaskData.get('title'),
              description: this.newTaskData.get('description'),
              deadline: this.newTaskData.get('deadline'),
              projectId: this.projectId,
            },
            { headers: headers }
          )
          .subscribe((data) => {
            console.log(data);
            this.projectTasks = data;
          });
      } catch (e) {
        console.log(e);
      }
    }
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
