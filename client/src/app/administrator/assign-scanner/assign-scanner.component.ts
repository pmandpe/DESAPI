import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LookupService } from '../../services/lookup.service';

import { ExamService } from '../../services/exams.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../services';
import { UtilService } from '../../services/utilities.service';

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


  constructor(public activeModal: NgbActiveModal, private lookupService: LookupService, private alertService: AlertService, private examService: ExamService, private utilService: UtilService) { }

  ngOnInit() {
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
    this.activeModal.close('Closed'); 
  }

  save() {
    var scanningAssignment = [];
    var evaluationassignment = [];
    var totalAssignedCopies = 0;
    var additionalCopies = 0  ;
    this.Users.forEach(element => {
      if (element.additionalcopies > 0) {
        var additionalCopies =this.utilService.getNumbericValue(element.additionalcopies) ; 
        totalAssignedCopies += this.utilService.getNumbericValue(element.assignedcopies) + additionalCopies;
        var assignedCopies = this.utilService.getNumbericValue(element.assignedcopies) + additionalCopies;;
        var evaluatedCopies = this.utilService.getNumbericValue(element.evaluatedcopies)  ;
        var scannedCopies = this.utilService.getNumbericValue(element.scannedcopies)  ;
        //additionalCopies = parseInt(element.additionalcopies)  ;
        if (this.userType == "SCANNER") {
          scanningAssignment.push({ "username": element.username, "scanningoffice": element.scanningoffice,"targetdate":this.utilService.getJoinedDate(element.targetdate), "assigneddate":new Date(),  "assignedcopies": assignedCopies, "scannedcopies": scannedCopies, "evaluatedcopies": (evaluatedCopies ? evaluatedCopies : 0) });
        }
        else {
          // For Evaluator
          evaluationassignment.push({ "username": element.username, "additionalcopies": additionalCopies,  "assignedcopies": assignedCopies, "evaluatedcopies": (evaluatedCopies ? evaluatedCopies : 0) });
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

  clearData(){
    this.examService.clearData(this.examCode)
        .pipe(first())
        .subscribe(
        data => {
          this.alertService.success("Data Saved Successfully");
        },
        error => {
          this.alertService.error(error);

        });
  }


  saveScanningData(totalAssignedCopies, scanningAssignment) {
    var scannedCopies = (this.examFormValues.totalscannedcopies ? this.examFormValues.totalscannedcopies : 0) ;
    if (totalAssignedCopies > (this.examFormValues.numberofcopies - scannedCopies)) {
      this.alertService.error("Copies assigned for scanning cannot be more than (Total Copies - Already Scanned Copies).");

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
        },
        error => {
          this.alertService.error(error);

        });
    }
  }


  getAdditionalCopies(user){
      try{
        return user.assignedcopies + parseInt(user.additionalcopies) ;
      }
      catch(ex){
        this.alertService.error("Additional copies should be a number") ;
      }
    
  }
  
  
  
  saveEvaluationData(totalCopiesAssignedForEvaluation, evaluationassignment) {
    // Evaluation cannot be done without scanning so number of copies in evaluation cannot be greater than scanned copies
    if (totalCopiesAssignedForEvaluation > ( this.examFormValues.totalscannedcopies) ){
      this.alertService.error("Copies assigned for evaluation cannot be more than total scanned copies");
      
    }
    else {

      var params = { "examcode": "", "evaluationassignment": [], "totalcopiesassignedforevaluation": 0 , "additionalcopies": 0};

      params.examcode = this.examCode;
      params.totalcopiesassignedforevaluation = totalCopiesAssignedForEvaluation ;
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
      element.additionalcopies = 0 ; 
      if (assignee) {
        element.assignedcopies = (assignee.assignedcopies ? assignee.assignedcopies : 0);
        element.scannedcopies = (assignee.scannedcopies ? assignee.scannedcopies : 0);
        element.targetdate = (assignee.targetdate ? this.utilService.getBrokenDate(assignee.targetdate) : "");
        element.assigneddate = (assignee.assigneddate ? assignee.assigneddate : "");
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
      element.additionalcopies = 0 ;
      if (assignee) {
        element.assignedcopies = (assignee.assignedcopies ? assignee.assignedcopies : 0);
        element.evaluatedcopies = (assignee.evaluatedcopies ? assignee.evaluatedcopies : 0);
        
      }
      else {
        element.assignedcopies = 0;
      }
    });
  }

}






