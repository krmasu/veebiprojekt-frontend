import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { IndexComponent } from './index/index.component';
import { RegisterComponent } from './register/register.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { TaskViewComponent } from './task-view/task-view.component';
import { FormsModule } from '@angular/forms';
import { MilestonesComponent } from './milestones/milestones.component';
import { TasksComponent } from './tasks/tasks.component';
import { InfoComponent } from './info/info.component';
import { MilestoneViewComponent } from './milestone-view/milestone-view.component';
import { LabelComponent } from './label/label.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IndexComponent,
    HomeComponent,
    RegisterComponent,
    ProjectsComponent,
    ProjectViewComponent,
    TaskViewComponent,
    MilestonesComponent,
    TasksComponent,
    InfoComponent,
    MilestoneViewComponent,
    LabelComponent,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
