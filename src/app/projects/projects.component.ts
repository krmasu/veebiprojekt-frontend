import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  projectsTestData = [{name: 'Project1'}, {name: 'Project2'}, {name: 'Project3'}]
  constructor(private _router: Router) { }

  ngOnInit(): void {
  }

  navigateToProjects() {
    this._router.navigate(['projects'])
  }

  navigateToHome() {
    this._router.navigate(['home'])

  }

}
