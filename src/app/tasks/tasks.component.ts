import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {
  projectId: Number = -1;
  userId: Number = -1;

  newTaskData: Map<string, string> = new Map<string, string>([
    ['title', ''],
    ['description', ''],
    ['deadline', ''],
    ['assignee', ''],
    ['milestone', ''],
  ]);

  totalPages: number[] = [];

  statusesById: Map<string, string> = new Map<string, string>([
    ['1', 'not started'],
    ['2', 'started'],
    ['3', 'finished'],
  ]);

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

  milestoneSelectionIds: Map<string, any> = new Map<string, any>();
  milestoneSelection: string[] = [];

  ascending = true;
  direction = 'asc';
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
    this.userId = Number(sessionStorage.getItem('userId'));
    this.projectId = Number(sessionStorage.getItem('projectId'));
    this.onGetTasks();
    this.getMilestones();
  }

  onNewTaskInput(event: any) {
    this.newTaskData.set(event.target.name, event.target.value);
  }

  onFilteringInput(event: any) {
    this.filteringData.set(event.target.name, event.target.value);
    this.onGetTasks();
  }

  getSortedTasks(sort: string) {
    this.setDirection();
    this.onGetTasks(sort);
  }

  formatted(date: any) {
    if (date) {
      return `${date[2]}/${date[1]}/${date[0]}`;
    }
    return '';
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
        .set('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
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
          this.totalPages = [...Array(data.totalPages).keys()];
          this.projectTasks = data.tasks;
        });
    } catch (e) {
      console.log(e);
    }
  }

  onAddTask() {
    if (this.newTaskData.get('title')) {
      const milestoneTitle = this.newTaskData.get('milestone');
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('authToken')}`
          );
        this.http
          .post<any>(
            `/api/project/${this.projectId}/task`,
            {
              title: this.newTaskData.get('title'),
              description: this.newTaskData.get('description'),
              deadline: this.newTaskData.get('deadline'),
              projectId: this.projectId,
              milestoneId: this.milestoneSelectionIds.get(milestoneTitle!),
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

  getMilestones(): void {
    if (this.projectId != -1) {
      try {
        this.http
          .get<any>(`api/project/${this.projectId}/milestone`, {
            headers: new HttpHeaders()
              .set('content-type', 'application/json')
              .set(
                'Authorization',
                `Bearer ${sessionStorage.getItem('authToken')}`
              ),
          })
          .subscribe((data) => {
            data.milestones.map((milestone: any) => {
              this.milestoneSelectionIds.set(milestone.title, milestone.id);
              this.milestoneSelection.push(milestone.title);
            });
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
              `Bearer ${sessionStorage.getItem('authToken')}`
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

    this._router.navigateByUrl(`task-view`);

    sessionStorage.setItem('taskId', taskId.toString());
  }
}
