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

  milestoneSelectionIds: Map<string, any> = new Map<string, any>();
  milestoneSelection: string[] = [];

  activeMilestone = '';

  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = Number(sessionStorage.getItem('projectId'));
    this.taskId = Number(sessionStorage.getItem('tasktId'));
    this.userId = Number(sessionStorage.getItem('userId'));

    const json = sessionStorage.getItem('taskData')!;
    const taskData = JSON.parse(json);
    this.title = taskData.title;
    this.description = taskData.description;
    if (taskData.deadline) {
      this.deadline = `${String(taskData.deadline[0]).padStart(
        4,
        '0'
      )}-${String(taskData.deadline[1]).padStart(2, '0')}-${String(
        taskData.deadline[2]
      ).padStart(2, '0')}`;
    }
    this.assignee = taskData.assignee;
    this.statusId = taskData.statusId;
    this.milestoneId = taskData.milestoneId;
    this.getMilestones();
  }

  onUpdateTask() {
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
          `api/project/${this.projectId}/task/${this.taskId}`,
          {
            title: this.title,
            description: this.description,
            deadline: this.deadline,
            assigneeId: this.assignee,
            statusId: this.statusId,
            milestoneId: this.milestoneSelectionIds.get(this.activeMilestone),
          },
          options
        )
        .subscribe((data) => {
          console.log(data);
        });

      this._router.navigateByUrl(`project-view`);

      sessionStorage.setItem('userId', this.userId.toString());
      sessionStorage.setItem('projectId', this.projectId.toString());
    } catch (e) {
      console.log(e);
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
              if (milestone.id == this.milestoneId) {
                this.activeMilestone = milestone.title;
              }
            });
            this.milestoneSelection.push('');
          });
      } catch (e) {
        console.log(e);
      }
    }
  }
}
