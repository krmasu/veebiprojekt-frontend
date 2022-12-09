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
    ['assignee', ''],
  ]);
  totalPages: number[] = [];
  direction = 'asc';

  projectTasks = [
    {
      id: '',
      title: 'example',
      description: '',
      deadline: '',
      labels: [],
      milestoneId: '',
      statusId: '',
      assignee: '',
    },
  ];

  ascending = true;

  filteringOptions = ['title', 'assignee', 'status', 'milestone'];
  filteringData: Map<string, string> = new Map<string, string>([
    ['filterBy', 'title'],
    ['textInput', ''],
  ]);
  paginationSettings: Map<string, any> = new Map<string, any>([
    ['sort', ''],
    ['size', 10],
    ['page', 0],
  ]);

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
  }

  onFilteringInput(event: any) {
    this.filteringData.set(event.target.name, event.target.value);
    this.onGetTasks();
    console.log(this.filteringData);
  }

  getSortedTasks(sort: string) {
    this.setDirection();
    this.onGetTasks(sort);
  }

  setDirection() {
    if (this.ascending) {
      this.direction = 'asc';
      this.ascending = false;
    } else {
      this.direction = 'desc';
      this.ascending = true;
    }
  }

  onGetTasks(
    sort = this.paginationSettings.get('sort'),
    size = this.paginationSettings.get('size'),
    page = this.paginationSettings.get('page')
  ) {
    this.paginationSettings.set('sort', sort);
    this.paginationSettings.set('size', size);
    this.paginationSettings.set('page', page);

    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
      this.http
        .get<any>(
          `/api/project/${this.projectId}/task/?size=${size}&page=${page}${
            sort && `&sort=${sort},${this.direction}`
          }${
            this.filteringData.get('textInput') &&
            `&${this.filteringData.get('filterBy')}=${this.filteringData.get(
              'textInput'
            )}`
          }`,

          { headers: headers }
        )
        .subscribe((data) => {
          console.log(data);
          this.totalPages = [...Array(data.totalPages).keys()];
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
            this.projectTasks = data.tasks;
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  onDeleteTask(taskId: string) {
    if (this.userId != -1) {
      try {
        const options = {
          headers: new HttpHeaders()
            .set('content-type', 'application/json')
            .set(
              'Authorization',
              `Bearer ${localStorage.getItem('authToken')}`
            ),
        };
        this.http
          .delete<any>(`api/project/${this.projectId}/task/${taskId}`, options)
          .subscribe((data) => {
            this.projectTasks = data.tasks;
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

  navigateToTaskView(
    taskId: String,
    title: String,
    description: String,
    deadline: String,
    milestoneId: String,
    statusId: String,
    assignee: String
  ) {
    const taskData = JSON.stringify({
      title: title,
      description: description,
      deadline: deadline,
      milestoneId: milestoneId,
      statusId: statusId,
      assignee: assignee,
    });
    sessionStorage.setItem('taskData', taskData);

    this._router.navigateByUrl(
      `task-view?userId=${this.userId}&projectId=${this.projectId}&taskId=${taskId}`
    );
  }
}
