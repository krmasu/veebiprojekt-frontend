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
  @Output() newTitleCreated = new EventEmitter<{ newTitle: string }>();

  projectId = -1;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.projectId = Number(params['projectId']);
    });
  }

  onInput(event: any) {
    this.newTitle = event.target.value;
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
          this.newTitle = data.title;
          this.newTitleCreated.emit({ newTitle: data.title });
        });
    } catch (e) {
      console.log(e);
    }
  }
}
