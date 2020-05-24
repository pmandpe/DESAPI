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
import { ExamQuestionDetailsComponent } from '../administrator/exams/exam-question-details/exam-question-details.component';
import { ScannerContainerComponent } from '../scanner/scanner-container/scanner-container.component';
import { AnswerMarkingComponent } from '../evaluator/answer-marking/answer-marking.component';
import { UserComponent } from '../master/user/user.component' ;
import { SaContainerComponent } from '../sa/sa-container/sa-container.component';
import { SaDashboardComponent } from '../sa/sa-dashboard/sa-dashboard.component';
import { PaperallocationComponent } from '../sa/paperallocation/paperallocation.component';
import { ManageUsersComponent } from '../sa/manage-users/manage-users.component';
import { PaperSettingComponent } from '../evaluator/paper-setting/paper-setting.component';
import { ChangePasswordComponent } from '../components/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo:'/login',
    pathMatch: 'full'
  },
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
        path: 'users',
        component: UserComponent
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
      },
      

      {
        path: 'exam-question-details/:mode/:questionno',
        component: ExamQuestionDetailsComponent
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      }
    ]
  },
  {
    path: 'scanner',
    canActivate: [AuthGuard],
    component: ScannerContainerComponent,
    data: { roles: [Role.Scanner] },
    children: [
      {
        path: 'dashboard',
        component: ScannerDashboardComponent
      },
      {
        path: 'scandocument/:examcode',
        component: ScanDocumentComponent
      },
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      }
    ]
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
      },
      {
        path: 'marking/answer/:answercode/:examcode',
        component: AnswerMarkingComponent
      },
      {
        path: 'papersetting',
        component: PaperSettingComponent
      }
      ,
      {
        path: 'changepassword',
        component: ChangePasswordComponent
      }
    ]
  },
  {
    path: 'sa',
    canActivate: [AuthGuard],
    component: SaContainerComponent,
    data: { roles: [Role.SA] },
    children: [
      {
        path: 'dashboard',
        component: SaDashboardComponent
      },
      {
        path: 'paperallocation',
        component: PaperallocationComponent
      },
      {
        path: 'manage-users',
        component: ManageUsersComponent
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
