import {Component} from "@angular/core";
import {Employee} from "../model/employee";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']

})
export class HomeComponent {
  allEmployees: Employee[] = [];
  constructor(private http: HttpClient, private _router: Router) { }

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
  navigateToProjects() {
    this._router.navigate(['projects'])
  }

  navigateToHome() {
    this._router.navigate(['home'])

  }
}
