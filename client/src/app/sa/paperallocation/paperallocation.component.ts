import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exams.service';
import { AlertService } from '../../services/alert.service';
import { MasterService } from '../../services/master.service';
import { AuthenticationService } from '../../services/authentication.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { DateFormatter, APP_DATE_FORMATS } from '../../helpers/dateformatter';
import { SaService } from '../../services/sa.service';
import { DataRowOutlet } from '@angular/cdk/table';

@Component({
  selector: 'app-paperallocation',
  templateUrl: './paperallocation.component.html',
  styleUrls: ['./paperallocation.component.css'],
  providers: [
    { provide: DateAdapter, useClass: DateFormatter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class PaperallocationComponent implements OnInit {

  Exams: any;
  Users: any;
  selectedExam: any;
  selectedUsers = [];
  targetdate = new Date();
  selectedUser;
  isPaperApproved : boolean ; 
  constructor(private examService: ExamService, private saService: SaService, private masterService: MasterService,
    private authService: AuthenticationService, private alertService: AlertService) { }

  ngOnInit() {

    this.examService.getExams()
      .subscribe(
      data => {
        this.Exams = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  selectExam(examCode) {
    this.isPaperApproved = false  ;
    this.selectedUsers = [];
    var exam = this.Exams.filter(exam => exam.examcode === examCode);
    if (exam && exam.length > 0) {
      this.selectedExam = exam[0];
      if (this.selectedExam.paperallocation) {
        this.selectedExam.paperallocation.forEach(user => {
          this.selectedUsers.push(user.username);
          this.targetdate = user.targetdate;
          if (user.approved && user.approved == "Y"){
            this.isPaperApproved = true ;
          }
        })
      }


    }

    this.masterService.getEvaluators()
      .subscribe(
      data => {
        this.Users = data;
      },
      error => {
        this.alertService.error(error);
      });
    this.step = 1 ;
  }

  allocate() {
    if (this.selectedUsers.length <= 0) {
      this.alertService.error("Please select atleast one user for paper setting");
      return;
    }
    var paperallocations = [];
    let targetDate = this.targetdate;
    var currentUser = this.authService.currentUserValue;
    this.selectedUsers.forEach(function (user) {
      paperallocations.push({
        "username": user,
        "targetdate": targetDate,
        "status": "P",
        "upload_location": ""
      })
    });
    var params = { "examcode": "", "paperallocation": [] };
    params.examcode = this.selectedExam.examcode;
    params.paperallocation = paperallocations;

    this.examService.updatePaperAllocation(params)
      .subscribe(
      data => {
        //this.Users = data;
        if (data["updateCount"] == 1){
          this.alertService.success("Data Updated Successflly") ;
        }
      },
      error => {
        this.alertService.error(error);
      });

  }
  onNgModelChange($event) {
    this.selectedUser = $event;
  }

  viewAllocation(examCode){
    this.selectExam(examCode) ; 
    this.step = 2 ;
  }

  downloadPaper(username){
    this.saService.getPaper(username, this.selectedExam.examcode)
      .subscribe(
      (data : any) => {
        let dataType = data.type;
            let binaryData = [];
            binaryData.push(data);
            let downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
            downloadLink.setAttribute('download', 'paper');
            document.body.appendChild(downloadLink);
            downloadLink.click();
      },
      error => {
        this.alertService.error(error);
      });

  }

  approvePaper(username){
    this.saService.approvePaper(username, this.selectedExam.examcode)
    .subscribe(
    data => {
      //this.Users = data;
      if (data["updateCount"] == 1){
        this.alertService.success("Data Updated Successflly") ;
      }
    },
    error => {
      this.alertService.error("Error in updating the database");
    });
  }
}
