import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../services/lookup.service';

import { ExamService } from '../../services/exams.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../services';

@Component({
  selector: 'app-assign-scanner',
  templateUrl: './assign-scanner.component.html',
  styleUrls: ['./assign-scanner.component.css']
})
export class AssignScannerComponent implements OnInit {


  Users: any;
  @Input() public examFormValues;
  @Input() public examCode;
  @Input() public userType;


  constructor(public activeModal: NgbActiveModal, private lookupService: LookupService, private alertService: AlertService, private examService: ExamService) { }

  ngOnInit() {

    console.log(JSON.stringify(this.examFormValues));

    this.lookupService.getAssignees(this.userType)
      .subscribe(
      data => {
        this.Users = data;
        if (this.userType == "SCANNER") {
          this.setScannedCopies(this.Users);
        }
        else {
          this.setEvaluatorCopies(this.Users);
        }
      },
      error => {
        this.alertService.error(error);
      });
  }

  cancel() {
    this.activeModal.close();
  }

  save() {
    var scanningAssignment = [];
    var evaluationassignment = [];
    var totalAssignedCopies = 0;
    this.Users.forEach(element => {
      if (element.assignedcopies > 0) {
        totalAssignedCopies += parseInt(element.assignedcopies, 10);
        if (this.userType == "SCANNER") {
          scanningAssignment.push({ "username": element.username, "scanningoffice": element.scanningoffice, "assignedcopies": element.assignedcopies, "evaluatedcopies": (element.scannedcopies ? element.scannedcopies : 0) });
        }
        else {
          // For Evaluator
          evaluationassignment.push({ "username": element.username, "assignedcopies": parseInt(element.assignedcopies), "evaluatedcopies": (element.evaluatedcopies ? element.evaluatedcopiesL : 0) });
        }
      }
    });

    if (this.userType == "SCANNER") {
      this.saveScanningData(totalAssignedCopies, scanningAssignment);
    }
    else {
      this.saveEvaluationData(totalAssignedCopies, evaluationassignment);
    }
    //Copies assigned for scanning cannot be more than total copies

  }



  saveScanningData(totalAssignedCopies, scanningAssignment) {
    if (totalAssignedCopies > this.examFormValues.numberofcopies) {
      this.alertService.error("Copies assigned for scanning cannot be more than total copies.");

    }
    else {

      var params = { "examcode": "", "scanningassignment": [], "totalcopiesassignedforscanning": 0 };

      params.examcode = this.examCode;
      params.totalcopiesassignedforscanning = totalAssignedCopies;
      params.scanningassignment = scanningAssignment;

      this.examService.saveScanningAssignment(params)
        .pipe(first())
        .subscribe(
        data => {

          this.alertService.success("Data Saved Successfully");
          this.cancel();

        },
        error => {
          this.alertService.error(error);

        });
    }
  }

  saveEvaluationData(totalAssignedCopies, evaluationassignment) {
    // Evaluation cannot be done without scanning so number of copies in evaluation cannot be greater than scanned copies
    if (totalAssignedCopies > this.examFormValues.scannedcopies) {
      this.alertService.error("Copies assigned for evaluation cannot be more than total scanned copies.");
    }
    else {

      var params = { "examcode": "", "evaluationassignment": [], "totalcopiesassignedforevaluation": 0 };

      params.examcode = this.examCode;
      params.totalcopiesassignedforevaluation = totalAssignedCopies;
      params.evaluationassignment = evaluationassignment;

      this.examService.saveEvaluationAssignment(params)
        .pipe(first())
        .subscribe(
        data => {

          this.alertService.success("Data Saved Successfully");
          this.cancel();

        },
        error => {
          this.alertService.error(error);

        });
    }

  }

  setScannedCopies(userData: any): any {
    userData.forEach(element => {
      //find if user exist in assignedCopies.if he does, populate the userdata with assigned copies for that user
      var assignee = this.examFormValues.scanningassignment.find(function (x) {
        var returnValue = x.username == element.username;
        return (returnValue ? x : null);
      });
      if (assignee) {
        element.assignedcopies = (assignee.assignedcopies ? assignee.assignedcopies : 0);
      }
      else {
        element.assignedcopies = 0;
      }
    });
  }

  setEvaluatorCopies(userData: any): any {
    userData.forEach(element => {
      //find if user exist in assignedCopies.if he does, populate the userdata with assigned copies for that user
      var assignee = this.examFormValues.evaluationassignment.find(function (x) {
        var returnValue = x.username == element.username;
        return (returnValue ? x : null);
      });
      if (assignee) {
        element.assignedcopies = (assignee.assignedcopies ? assignee.assignedcopies : 0);
      }
      else {
        element.assignedcopies = 0;
      }
    });
  }

}






