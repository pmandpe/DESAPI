import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from '../guards';
import { Role } from '../models/Role';

import { SubjectComponent } from '../master/subject/subject.component';
import { EditSubjectComponent } from '../master/edit-subject/edit-subject.component';
import { ExamListComponent } from '../administrator/exams/exam-list/exam-list.component';
import { ExamDetailsComponent } from '../administrator/exams/exam-details/exam-details.component';
import { EvaluatorDashboardComponent } from '../evaluator/evaluator-dashboard/evaluator-dashboard.component';
import { ScannerDashboardComponent } from '../scanner/scanner-dashboard/scanner-dashboard.component';
import { ScanDocumentComponent } from '../scanner/scan-document/scan-document.component';
import { AdminDashboardComponent } from '../administrator/admin-dashboard/admin-dashboard.component';
import { ContainerComponent } from '../administrator/container/container.component';
import { MarkingComponent } from '../evaluator/marking/marking.component';
import { EvalContainerComponent } from '../evaluator/eval-container/eval-container.component';







const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'admin',
    component: ContainerComponent,
    data: { roles: [Role.Admin] },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        component: AdminDashboardComponent
      },
      {
        path: 'exams',
        component: ExamListComponent
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
        path: 'edit-exam/:mode/:examcode',
        component: ExamDetailsComponent
      }
    ]
  },
  {
    path: 'scanner',
    canActivate: [AuthGuard],
    component: ScannerDashboardComponent,
    data: { roles: [Role.Evaluator] },
  },
  {
    path: 'scanner/scandocument',
    canActivate: [AuthGuard],
    component: ScanDocumentComponent,
    data: { roles: [Role.Scanner] }
  },
  {
    path: 'evaluator',
    canActivate: [AuthGuard],
    component: EvalContainerComponent,
    data: { roles: [Role.Evaluator] },
    children: [
      {
        path: 'dashboard',
        component: EvaluatorDashboardComponent
      },
      {
        path: 'marking/:examcode',
        component: MarkingComponent
      }
    ]
  }

]

  ;


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
