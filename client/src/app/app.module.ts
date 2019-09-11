import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login/login.component';
import { MyMaterialModule } from  './material.module';
import { AlertComponent } from './components';
import { DashboardComponent } from './dashboard/dashboard.component';

import { ErrorInterceptor, JwtInterceptor } from './helpers';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SubjectComponent } from './master/subject/subject.component';
import { EditSubjectComponent } from './master/edit-subject/edit-subject.component';
import { ExamListComponent } from './administrator/exams/exam-list/exam-list.component';
import { ExamDetailsComponent } from './administrator/exams/exam-details/exam-details.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AssignScannerComponent } from './administrator/assign-scanner/assign-scanner.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScannerDashboardComponent } from './scanner/scanner-dashboard/scanner-dashboard.component';
import { EvaluatorDashboardComponent } from './evaluator/evaluator-dashboard/evaluator-dashboard.component';
import { ScannerModule } from './scanner/module/scanner.module';
import { EvaluatorModule } from './evaluator/evaluator/evaluator.module';
import { InlineEditComponent } from './components/inline-edit/inline-edit.component';

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
    AlertComponent,
    DashboardComponent,
    AdminDashboardComponent,
    SubjectComponent,
    EditSubjectComponent,
    ExamListComponent,
    ExamDetailsComponent,
    AssignScannerComponent,
    InlineEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule, 
    AppRoutingModule,
    ReactiveFormsModule,
    MyMaterialModule,
    NgbModule,
    ScannerModule,
    EvaluatorModule

  ],

  
  providers: [

    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    NgbActiveModal
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AssignScannerComponent
  ]
})
export class AppModule { }
