import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {
  @Input() title = '';
  newTitle = this.title;
  colors = ['neutral', 'green', 'blue', 'yellow', 'black', 'red'];

  labels = [
    {
      title: '',
      colorCode: '',
      id: '',
    },
  ];

  labelInputMap: Map<string, string> = new Map<string, string>([
    ['labelInput', ''],
    ['labelColor', 'neutral'],
  ]);

  @Output() newTitleCreated = new EventEmitter<{ newTitle: string }>();

  projectId = -1;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectId = Number(sessionStorage.getItem('projectId'));
    this.getProject();
    this.getLabel();
  }

  onInput(event: any) {
    this.newTitle = event.target.value;
  }

  getProject() {
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);

      this.http
        .get<any>(`/api/project/${this.projectId}`, { headers: headers })
        .subscribe((data) => {
          this.newTitle = data.title;
          this.newTitleCreated.emit({ newTitle: data.title });
        });
    } catch (e) {
      console.log(e);
    }
  }

  updateProject() {
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
          '/api/project',
          { projectId: this.projectId, title: this.newTitle },
          options
        )
        .subscribe((data) => {
          this.newTitle = data.title;
          this.newTitleCreated.emit({ newTitle: data.title });
        });
    } catch (e) {
      console.log(e);
    }
  }

  addLabel(): void {
    if (this.labelInputMap.get('labelInput') != '') {
      try {
        const headers = new HttpHeaders()
          .set('content-type', 'application/json')
          .set(
            'Authorization',
            `Bearer ${sessionStorage.getItem('authToken')}`
          );
        this.http
          .post<any>(
            `api/project/${this.projectId}/label`,
            {
              title: this.labelInputMap.get('labelInput'),
              colorCode: this.labelInputMap.get('labelColor'),
            },
            { headers: headers }
          )
          .subscribe((data) => {
            this.labels = data.labels;
            alert('Label added');
          });
      } catch (e) {
        console.log(e);
        alert('Adding label failed');
      }
    } else {
      alert("Title can't be empty");
    }
  }

  onLabelInput(event: any) {
    this.labelInputMap.set(event.target.name, event.target.value);
  }

  removeLabel(labelId: any) {
    console.log(labelId);
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
        .delete<any>(`api/project/${this.projectId}/label/${labelId}`, options)
        .subscribe((data) => {
          this.labels = data.labels;
        });
    } catch (e) {
      console.log(e);
    }
  }

  getLabel(): void {
    console.log(this.labelInputMap.get('labelInput'));
    try {
      const headers = new HttpHeaders()
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${sessionStorage.getItem('authToken')}`);
      this.http
        .get<any>(`api/project/${this.projectId}/label`, { headers: headers })
        .subscribe((data) => {
          this.labels = data.labels;
          console.log(this.labels);
        });
    } catch (e) {
      console.log(e);
    }
  }
}
