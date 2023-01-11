import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-milestone-view',
  templateUrl: './milestone-view.component.html',
  styleUrls: ['./milestone-view.component.scss'],
})
export class MilestoneViewComponent implements OnInit {
  title = '';
  description = '';
  startDate = '';
  endDate = '';
  milestoneId: Number = -1;
  projectId: Number = -1;
  userId: Number = -1;

  milestoneTasks = [
    {
      id: '',
      title: '',
      description: '',
      deadline: '',
      labels: [],
      milestoneId: '',
      statusId: '',
      assignee: '',
    },
  ];

  paginationSettings: Map<string, any> = new Map<string, any>([
    ['sort', ''],
    ['size', 10],
    ['page', 0],
  ]);

  ascending = true;
  direction = 'asc';
  filteringOptions = ['title', 'assignee', 'status'];

  totalPages: number[] = [];

  filteringData: Map<string, string> = new Map<string, string>([
    ['filterBy', 'title'],
    ['textInput', ''],
  ]);

  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.projectId = Number(sessionStorage.getItem('projectId'));
    this.milestoneId = Number(sessionStorage.getItem('milestoneId'));

    const json = sessionStorage.getItem('taskData')!;
    const taskData = JSON.parse(json);
    this.title = taskData.title;
    this.description = taskData.description;
    this.startDate = `${String(taskData.startDate[0]).padStart(
      4,
      '0'
    )}-${String(taskData.startDate[1]).padStart(2, '0')}-${String(
      taskData.startDate[2]
    ).padStart(2, '0')}`;
    this.endDate = `${String(taskData.endDate[0]).padStart(4, '0')}-${String(
      taskData.endDate[1]
    ).padStart(2, '0')}-${String(taskData.endDate[2]).padStart(2, '0')}`;
    this.onGetTasks();
  }

  getSortedTasks(sort: string) {
    this.setDirection();
    this.onGetTasks(sort);
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
          }${`&milestone=${this.milestoneId}`}`,

          { headers: headers }
        )
        .subscribe((data) => {
          this.totalPages = [...Array(data.totalPages).keys()];
          this.milestoneTasks = data.tasks;
          console.log(data.tasks);
        });
    } catch (e) {
      console.log(e);
    }
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

  formatted(date: any) {
    if (date) {
      return `${date[2]}/${date[1]}/${date[0]}`;
    }
    return '';
  }

  onUpdateMilestone() {
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
        .patch<any>(
          `api/project/${this.projectId}/milestone/${this.milestoneId}`,
          {
            title: this.title,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate,
            milestoneId: this.milestoneId,
          },
          options
        )
        .subscribe((data) => {
          alert('Milestone updated');
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

    this._router.navigateByUrl(`task-view`);

    sessionStorage.setItem('taskId', taskId.toString());
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
            this.milestoneTasks = data.tasks;
            alert('Milestone deleted');
          });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
