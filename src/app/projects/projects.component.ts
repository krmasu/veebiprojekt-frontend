import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  @Input() showProjects: any[] = [{ title: 'example', id: 'example' }];
  constructor(private _router: Router) {}

  ngOnInit(): void {}

  navigateToProjects() {
    this._router.navigate(['projects']);
  }

  navigateToHome() {
    this._router.navigate(['home']);
  }
}
