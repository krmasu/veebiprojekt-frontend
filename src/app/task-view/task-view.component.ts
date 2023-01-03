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

  activeStatus = '';

  milestoneSelectionIds: Map<string, any> = new Map<string, any>();
  milestoneSelection: string[] = [];

  activeMilestone = '';

  statusesById: Map<string, string> = new Map<string, string>([
    ['1', 'not started'],
    ['2', 'started'],
    ['3', 'finished'],
  ]);

  idsByStatus: Map<string, string> = new Map<string, string>([
    ['not started', '1'],
    ['started', '2'],
    ['finished', '3'],
  ]);

  labelInputMap: Map<string, string> = new Map<string, string>([
    ['labelInput', ''],
    ['labelColor', 'neutral'],
  ]);

  labelIdMap: Map<string, string> = new Map<string, string>();
  labelTitleMap: Map<string, string> = new Map<string, string>();

  taskLabels: any[] = [
    {
      title: '',
      colorCode: '',
      id: '',
    },
  ];

  activeLabel = '';

  statustOptions = ['not started', 'started', 'finished'];

  colors = ['neutral', 'green', 'blue', 'yellow', 'black', 'red'];

  projectLabels = [
    {
      title: '',
      colorCode: '',
      id: '',
    },
  ];

  changeActiveLabel(event: any) {
    this.activeLabel = event.target.value;
  }

  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectId = Number(sessionStorage.getItem('projectId'));
    this.taskId = Number(sessionStorage.getItem('taskId'));
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
    this.activeStatus = this.statusesById.get(taskData.statusId.toString())!;

    this.taskLabels = taskData.labels;

    this.getMilestones();
    this.getLabel();
  }

  addLabel() {
    let labelData = this.labelIdMap.get(this.activeLabel);
    this.taskLabels.push(labelData);
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
            statusId: this.idsByStatus.get(this.activeStatus),
            milestoneId: this.milestoneSelectionIds.get(this.activeMilestone),
            labelIds: this.taskLabels.map((taskLabel) => taskLabel.id),
          },
          options
        )
        .subscribe((data) => {
          console.log(data);
        });

      this._router.navigateByUrl(`project-view`);
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

  removeLabel(labelId: any) {
    let newTaskLabels: any[] = [];
    this.taskLabels.map((taskLabel) => {
      if (labelId != taskLabel.id) {
        newTaskLabels.push(taskLabel);
      }
    });
    this.taskLabels = newTaskLabels;
  }

  getLabel(): void {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
      this.http
        .get<any>(`api/project/${this.projectId}/label`, { headers: headers })
        .subscribe((data) => {
          data.labels.map((label: any) => {
            this.labelIdMap.set(label.title, label);
            this.labelTitleMap.set(label.id, label);
          });
          this.projectLabels = data.labels;
          this.activeLabel =
            this.projectLabels.length != 0 ? this.projectLabels[0].title : '';
        });
    } catch (e) {
      console.log(e);
    }
  }
}
