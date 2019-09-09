import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from '../guards';
import { Role } from '../models/Role';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { SubjectComponent } from '../master/subject/subject.component';
import { EditSubjectComponent } from '../master/edit-subject/edit-subject.component';
import { ExamListComponent } from 'app/administrator/exams/exam-list/exam-list.component';
import { ExamDetailsComponent } from 'app/administrator/exams/exam-details/exam-details.component';
import { EvaluatorDashboardComponent } from 'app/evaluator/evaluator-dashboard/evaluator-dashboard.component';
import { ScannerDashboardComponent } from 'app/scanner/scanner-dashboard/scanner-dashboard.component';






const routes: Routes = [
  {
      path: 'login',
      component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    
    children: [
      {
        path: 'admin',
        canActivate: [AuthGuard],
        component: AdminDashboardComponent,
        data: { roles: [Role.Admin] } ,
      },
      {
        path: 'scanner',
        canActivate: [AuthGuard],
        component: ScannerDashboardComponent,
        data: { roles: [Role.Admin] } ,
      },
      {
        path: 'evaluator',
        canActivate: [AuthGuard],
        component: EvaluatorDashboardComponent,
        data: { roles: [Role.Evaluator] } ,
      },

      {
        path: 'subject',
        component: SubjectComponent
      },
      {
        path: 'edit-subject/:mode/:subjectcode',
        component: EditSubjectComponent
      },
    {
      path: 'exams',
      component: ExamListComponent
    },
    {
      path: 'edit-exam/:mode/:examcode',
      component: ExamDetailsComponent
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
