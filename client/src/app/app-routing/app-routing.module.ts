import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from 'app/login/login.component';
import { DashboardComponent } from 'app/dashboard/dashboard.component';
import { AuthGuard } from 'app/guards';
import { Role } from 'app/models/Role';
import { AdminDashboardComponent } from 'app/admin-dashboard/admin-dashboard.component';
import { SubjectComponent } from 'app/master/subject/subject.component';



const routes: Routes = [
  {
      path: 'login',
      component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Evaluator, Role.Admin, Role.Scanner] } ,
    children: [
      {
        path: '',
        component: AdminDashboardComponent
      },
      {
        path: 'subject',
        component: SubjectComponent
      }
    ]
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
],
exports: [
    RouterModule
],
declarations: []
})

export class AppRoutingModule { }
