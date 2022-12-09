import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-view',
  templateUrl: './project-view.component.html',
  styleUrls: ['./project-view.component.scss'],
})
export class ProjectViewComponent implements OnInit {
  projectId: Number = -1;
  userId: Number = -1;
  navbarItem = 'info';
  projectTitle = '';
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
  }

  onUpdateTitle(eventData: { newTitle: string }) {
    this.projectTitle = eventData.newTitle;
  }
}
