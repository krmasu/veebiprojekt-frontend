import { Component, OnInit } from '@angular/core';
import {Employee} from "../model/employee";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  allEmployees: Employee[] = [];
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
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
