import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-milestones',
  templateUrl: './milestones.component.html',
  styleUrls: ['./milestones.component.scss'],
})
export class MilestonesComponent implements OnInit {
  projectId: Number = -1;
  userId: Number = -1;
  totalPages: number[] = [];
  headers = new HttpHeaders()
    .set('content-type', 'application/json')
    .set('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);

  newMilestoneData: Map<string, string> = new Map<string, string>([
    ['title', ''],
    ['description', ''],
    ['endDate', ''],
    ['startDate', ''],
  ]);

  milestones = [
    {
      description: '',
      startDate: '',
      endDate: '',
      id: '',
      title: '',
    },
  ];

  ascending = true;
  direction = 'asc';

  filteringOptions = ['title'];
  filteringData: Map<string, string> = new Map<string, string>([
    ['filterBy', 'title'],
    ['textInput', ''],
  ]);
  paginationSettings: Map<string, any> = new Map<string, any>([
    ['sort', ''],
    ['size', 10],
    ['page', 0],
  ]);

  constructor(private http: HttpClient, private _router: Router) {}

  ngOnInit(): void {
    this.userId = Number(sessionStorage.getItem('userId'));
    this.projectId = Number(sessionStorage.getItem('projectId'));

    this.getMilestones();
  }

  onNewMilestoneInput(event: any) {
    this.newMilestoneData.set(event.target.name, event.target.value);
  }

  onFilteringInput(event: any) {
    this.filteringData.set(event.target.name, event.target.value);
    this.getMilestones();
  }

  getSortedTasks(sort: string) {
    this.setDirection();
    this.getMilestones(sort);
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

  addMilestone() {
    if (this.newMilestoneData.get('title')) {
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('authToken')}`
          );
        this.http
          .post<any>(
            `/api/project/${this.projectId}/milestone`,
            {
              title: this.newMilestoneData.get('title'),
              description: this.newMilestoneData.get('description'),
              startDate: this.newMilestoneData.get('startDate'),
              endDate: this.newMilestoneData.get('endDate'),
              projectId: this.projectId,
            },
            { headers: headers }
          )
          .subscribe((data) => {
            this.milestones = data.milestones;
            alert('Milestone added');
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  formatted(date: any) {
    if (date) {
      return `${date[2]}/${date[1]}/${date[0]}`;
    }
    return '';
  }

  getMilestones(
    sort = this.paginationSettings.get('sort'),
    size = this.paginationSettings.get('size'),
    page = this.paginationSettings.get('page')
  ): void {
    this.paginationSettings.set('sort', sort);
    this.paginationSettings.set('size', size);
    this.paginationSettings.set('page', page);

    if (this.projectId != -1) {
      try {
        this.http
          .get<any>(
            `api/project/${
              this.projectId
            }/milestone/?size=${size}&page=${page}${
              sort && `&sort=${sort},${this.direction}`
            }${
              this.filteringData.get('textInput') &&
              `&${this.filteringData.get('filterBy')}=${this.filteringData.get(
                'textInput'
              )}`
            }`,
            {
              headers: this.headers,
            }
          )
          .subscribe((data) => {
            this.totalPages = [...Array(data.totalPages).keys()];

            this.milestones = data.milestones;
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  onDeleteMilestone(milestoneId: string) {
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
          .delete<any>(
            `api/project/${this.projectId}/milestone/${milestoneId}`,
            options
          )
          .subscribe((data) => {
            this.milestones = data.milestones;
          });
      } catch (e) {
        console.log(e);
      }
    }
  }

  navigateToMilestoneView(
    title: String,
    description: String,
    milestoneId: String,
    startDate: String,
    endDate: String
  ) {
    const taskData = JSON.stringify({
      title: title,
      description: description,
      milestoneId: milestoneId,
      startDate: startDate,
      endDate: endDate,
    });
    sessionStorage.setItem('taskData', taskData);

    this._router.navigateByUrl(`milestone-view`);

    sessionStorage.setItem('milestoneId', milestoneId.toString());
  }
}
