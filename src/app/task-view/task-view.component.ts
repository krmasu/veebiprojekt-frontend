import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  title = '';
  description = '';
  deadline = '';
  assignee = '';
  statusId = '';
  milestoneId = '';
  taskId: Number = -1;
  projectId: Number = -1;
  userId: Number = -1;

  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.projectId = Number(params['projectId']);
      this.taskId = Number(params['taskId']);
      this.userId = Number(params['userId']);
    });
    const json = sessionStorage.getItem('taskData')!;
    const taskData = JSON.parse(json);
    this.title = taskData.title;
    this.description = taskData.description;
    this.deadline = `${String(taskData.deadline[0]).padStart(4, '0')}-${String(
      taskData.deadline[1]
    ).padStart(2, '0')}-${String(taskData.deadline[2]).padStart(2, '0')}`;
    console.log(this.deadline);
    this.assignee = taskData.assignee;
    this.statusId = taskData.statusId;
    this.milestoneId = taskData.milestoneId;
  }

  onUpdateTask() {
    try {
      const options = {
        headers: new HttpHeaders()
          .set('content-type', 'application/json')
          .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`),
      };
      // private String title;
      // private String description;
      /// private LocalDate deadline;
      // private Integer assigneeId;
      // private Integer statusId;
      /// private List<Integer> labelIds;
      //private Integer milestoneId;
      this.http
        .patch<any>(
          `api/project/${this.projectId}/${this.taskId}`,
          {
            title: this.title,
            description: this.description,
            deadline: this.deadline,
            assigneeId: this.assignee,
            statusId: this.statusId,
            milestoneId: this.milestoneId,
          },
          options
        )
        .subscribe((data) => {
          console.log(data);
        });

      this._router.navigateByUrl(
        `project-view?userId=${this.userId}&projectId=${this.projectId}`
      );
    } catch (e) {
      console.log(e);
    }
  }
}
