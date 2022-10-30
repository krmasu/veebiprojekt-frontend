import {Component, OnInit} from '@angular/core';
import {HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators'
import {Employee} from "./model/employee";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'veebiprojekt-frontend';
  allEmployees: Employee[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(){
    this.fetchEmployees();
  }

  onEmployeeFetch() {
    this.fetchEmployees();
  }

  private fetchEmployees() {
    this.http.get<Employee>('/api/employee/1')

      .subscribe((res) => {
        console.log(res)
        this.allEmployees = [res]
      })
  }
}


