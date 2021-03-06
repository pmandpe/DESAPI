import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login/login.component';
import { MaterialModule } from  './material.module';
import { AlertComponent } from './components';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ErrorInterceptor, JwtInterceptor } from './helpers';

import { SubjectComponent } from './master/subject/subject.component';
import { EditSubjectComponent } from './master/edit-subject/edit-subject.component';
import { ExamListComponent } from './administrator/exams/exam-list/exam-list.component';
import { ExamDetailsComponent } from './administrator/exams/exam-details/exam-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AssignScannerComponent } from './administrator/assign-scanner/assign-scanner.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScannerDashboardComponent } from './scanner/scanner-dashboard/scanner-dashboard.component';
import { EvaluatorDashboardComponent } from './evaluator/evaluator-dashboard/evaluator-dashboard.component';

import { InlineEditComponent } from './components/inline-edit/inline-edit.component';
import { AdminDashboardComponent } from './administrator/admin-dashboard/admin-dashboard.component';

import { AdminMenuComponent } from './administrator/admin-menu/admin-menu.component';
import { ContainerComponent } from './administrator/container/container.component';
import { MarkingComponent } from './evaluator/marking/marking.component';
import { EvalContainerComponent } from './evaluator/eval-container/eval-container.component';
import { ScanDocumentComponent } from './scanner/scan-document/scan-document.component';
import {PdfViewerModule} from 'ng2-pdf-viewer'
import { ExamQuestionsComponent } from './administrator/exams/exam-questions/exam-questions.component';
import { ExamQuestionDetailsComponent } from './administrator/exams/exam-question-details/exam-question-details.component';
import { AnswerMarkingComponent } from './evaluator/answer-marking/answer-marking.component';
import { ScannerContainerComponent } from './scanner/scanner-container/scanner-container.component';
import { SubjectMenuComponent } from './master/subject-menu/subject-menu.component';

import { TopMenuComponent } from './components/top-menu/top-menu.component';
import { ConfirmationDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { ConfirmationDialogService } from './services/confirm-dialog.service';
import { ExamMenuComponent } from './administrator/exams/exam-menu/exam-menu.component';
import { HeaderComponent } from './components/header/header.component';

import { ComponentsModule } from './components/components.module';
import { UserComponent } from './master/user/user.component';
import { SaContainerComponent } from './sa/sa-container/sa-container.component' ;
import { SaDashboardComponent } from './sa/sa-dashboard/sa-dashboard.component';
import { SaMenuComponent } from './sa/sa-menu/sa-menu.component';
import { PaperallocationComponent } from './sa/paperallocation/paperallocation.component';
import { ManageUsersComponent } from './sa/manage-users/manage-users.component';
import { EvalMenuComponent } from './evaluator/eval-menu/eval-menu.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { PaperSettingComponent } from './evaluator/paper-setting/paper-setting.component';
import { UploadService } from './services/upload.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { DwtComponent } from './scanner/dwt/dwt.component';
import { CallbackPipe } from './scanner/Callback.pipe';
import { SafeurlPipe } from './scanner/safeurl.pipe';
import { LoaderComponent } from './components/loader/loader.component';
import { SpinnerService } from './services';
import { MAT_DATE_LOCALE } from '@angular/material';


const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: { title: 'Login to DES' }
  },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dashboard' }
  }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    AlertComponent,
    DashboardComponent,
    InlineEditComponent,
    AdminMenuComponent,
    AdminDashboardComponent,
    ExamListComponent,
    ExamDetailsComponent,
    SubjectComponent,
    SubjectMenuComponent,
    EditSubjectComponent,
   AdminMenuComponent,
    AssignScannerComponent,
    ContainerComponent,
    MarkingComponent,
    EvalContainerComponent,
    ScannerDashboardComponent,
    AssignScannerComponent,
    EvalContainerComponent,
    EvaluatorDashboardComponent,
    ScanDocumentComponent,
    ExamQuestionsComponent,
    ExamQuestionDetailsComponent,
    AnswerMarkingComponent,
    ScannerContainerComponent,
    ExamMenuComponent,
    TopMenuComponent,
    ConfirmationDialogComponent,
    UserComponent,
    SaContainerComponent,
    SaDashboardComponent,
    SaMenuComponent,
    PaperallocationComponent,
    ManageUsersComponent,
    EvalMenuComponent,
    ChangePasswordComponent,
    PaperSettingComponent,
    FileSelectDirective,
    DwtComponent,
    CallbackPipe,
    SafeurlPipe,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule, 
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    PdfViewerModule,
    MaterialModule,
   ComponentsModule,
    RouterModule

  ],

  
  providers: [
    
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      {provide: MAT_DATE_LOCALE, useValue: 'en-GB'     },
    NgbActiveModal,
    ConfirmationDialogService,
    UploadService,
    SpinnerService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AssignScannerComponent,
    ConfirmationDialogComponent

  ]
})
export class AppModule { }
