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

  constructor(
    private http: HttpClient,
    private _router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.projectId = Number(params['projectId']);
      this.milestoneId = Number(params['milestoneId']);
      this.userId = Number(params['userId']);
    });
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
          .set('Authorization', `Bearer ${localStorage.getItem('authToken')}`),
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
          console.log(data);
        });
    } catch (e) {
      console.log(e);
    }
  }
}