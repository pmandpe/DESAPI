import { Component, OnInit, Directive, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { first } from 'rxjs/operators';
import { MasterService } from '../../../services/master.service';
import { AlertService } from '../../../services';
import { ExamService } from '../../../services/exams.service';
import { UtilService } from '../../../services/utilities.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AssignScannerComponent } from '../../../administrator/assign-scanner/assign-scanner.component';
import { ExamQuestionsComponent } from '../exam-questions/exam-questions.component';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import { LookupService } from '../../../services/lookup.service';
import { SaService } from '../../../services/sa.service';

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {
  examForm: FormGroup;
  loading = false;
  subjectlist : any ; 
  submitted = false;
  returnUrl: string;
  examQuestions: any;
  mode: string;
  examcode: string;
  examdetails: any;
  disableSubjectCode = false;
  showUniqueCode = false;
  closeResult: string;
  paperApproved : boolean ; 
  isScanningDisabled = false ; 
  isEvaluationDisabled = true  ; 
  @Input() public passedExamCode;
  @ViewChild(ExamQuestionsComponent, {static: false}) examQuestionChildComponent:ExamQuestionsComponent;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private saService: SaService,
    private examService: ExamService,
    private lookupService: LookupService,
    private alertService: AlertService,
    private utilService: UtilService,

    private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {
    this.subjectlist = this.getSubjectList() ; 
    this.createExamForm();
    //this.mode = this.examForm.value.editmode ; 
    this.mode = this._Activatedroute.snapshot.paramMap.get("mode");
    this.examcode = this._Activatedroute.snapshot.paramMap.get("examcode");

    if (this.examcode) {
      this.showUniqueCode = false;
    }


    if (this.mode != "NEW") {
      this.getExamDetails();
    }

  }

  createExamForm() {

    this.examForm = this.formBuilder.group({
      examname: ['', Validators.required],
      subjectcode: ['', Validators.required],
      examdate: ['', Validators.required],
      resultdate: ['', Validators.required],
      numberofcopies: ['', Validators.required],
      comments: new FormControl(""),
      totalcopiesassignedforscanning: new FormControl(0),
      totalcopiesassignedforevaluation: new FormControl(0),
      scanningassignment: new FormControl([]),
      totalscannedcopies: new FormControl(0),
      totalevaluatedcopies: new FormControl(0),
      totalmarks: new FormControl(0),
      evaluationassignment: new FormControl([]),
      editmode: new FormControl(""),
      class: new FormControl(""),
      semester: new FormControl("")


    });

  }
  setExamCode(exCode, exMode) {
    this.examcode = exCode;
    this.mode = exMode;
    this.createExamForm();
    this.disableSubjectCode = false;
    if (this.mode != "NEW") {
      this.getExamDetails();
    }
  }

  getExamDetails() {
    this.disableSubjectCode = true;

    this.examService.getExamDetails(this.examcode)
      .subscribe(
      (data: any) => {

        if (data && data.length > 0) {

          this.examdetails = data[0];
          this.examQuestions = this.examdetails.questions;
          this.isPaperApproved() ; 
          var exDate = this.utilService.getBrokenDate(this.examdetails.examdate);
          var reDate = this.utilService.getBrokenDate(this.examdetails.resultdate);

          this.examForm.patchValue({ examname: this.examdetails.examname });
          this.examForm.patchValue({ subjectcode: this.examdetails.subjectcode });
          this.examForm.patchValue({ examdate: this.utilService.getJoinedDate(exDate) });
          this.examForm.patchValue({ numberofcopies: (this.examdetails.numberofcopies ? this.examdetails.numberofcopies : 0) });
          this.examForm.patchValue({ totalmarks: (this.examdetails.totalmarks ? this.examdetails.totalmarks : 0) });
          this.examForm.patchValue({ totalcopiesassignedforscanning: (this.examdetails.totalcopiesassignedforscanning ? this.examdetails.totalcopiesassignedforscanning : 0) });
          this.examForm.patchValue({ totalcopiesassignedforevaluation: (this.examdetails.totalcopiesassignedforevaluation ? this.examdetails.totalcopiesassignedforevaluation : 0) });
          
          this.examForm.patchValue({ resultdate: this.utilService.getJoinedDate(reDate) });
          this.examForm.patchValue({ comments: this.examdetails.comments });
          this.examForm.patchValue({ scanningassignment: this.examdetails.scanningassignment })
          this.examForm.patchValue({ evaluationassignment: this.examdetails.evaluationassignment });
          this.examForm.patchValue({ totalscannedcopies: (this.examdetails.totalscannedcopies ? this.examdetails.totalscannedcopies : 0) });
          this.examForm.patchValue({ totalevaluatedcopies: (this.examdetails.totalevaluatedcopies ? this.examdetails.totalevaluatedcopies : 0) });
          this.examForm.patchValue({ class: this.examdetails.class });
          this.examForm.patchValue({ semester: this.examdetails.semester });
          this.examForm.patchValue({ editmode: 'EDIT' });
          
          //-- set the exam questions and total marks on child component
          this.examQuestionChildComponent.setExamQuestions(this.examQuestions) ;
          this.examQuestionChildComponent.setTotalMarks() ; 
          this.disableScanning() ;
          this.disableEvaluation() ;


        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;

      });
  }


  saveExam() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.examForm.invalid) {
      return;
    }
    this.loading = true;


    var params = this.examForm.value;
    params.examcode = this.examcode;
    //var resultdateValue = //this.examForm.value.resultdate.year.toString().padStart(2, '0') + "-" + this.examForm.value.resultdate.month.toString().padStart(2, '0') + "-" + this.examForm.value.resultdate.day.toString().padStart(2, '0');
    //var examdateValue = this.examForm.value.examdate.year + "-" + this.examForm.value.examdate.month.toString().padStart(2, '0') + "-" + this.examForm.value.examdate.day.toString().padStart(2, '0');
    //params.resultdate = resultdateValue;
    //params.examdate = examdateValue;
    /*
    if (this.examForm.value.numberofcopies < this.examForm.value.totalcopiesassignedforscanning) {
      this.alertService.error("Total Number of copies cannot be less than already assigned for scanning");
      this.loading = false;
      return;
    }
    */

    this.examService.saveExam(params)
      .pipe(first())
      .subscribe(
      (data: any) => {

        if (data.updateCount == 11000){
          this.alertService.error("This exam code is duplicate, please retry.");  
          return ; 
        }
        this.loading = false;
        this.alertService.success("Data Saved Successfully");
        this.examForm.patchValue({ editmode: 'EDIT' });
        this.disableSubjectCode = true;
        this.examcode = data.examcode ; 
        this.reloadComponent();

      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

  reloadComponent() {
    this.router.navigateByUrl('/login', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/admin/edit-exam', 'EDIT', this.examcode]);
    });
  }



  // convenience getter for easy access to form fields
  get f() { return this.examForm.controls; }



  open(openFor) {

    const modalRef = this.modalService.open(AssignScannerComponent, { windowClass: 'scannerpopup' });
    modalRef.componentInstance.examFormValues = this.examForm.value;
    modalRef.componentInstance.examCode = this.examcode;
    modalRef.componentInstance.userType = openFor;

    modalRef.result.then((result) => {
      if (result) {
        this.getExamDetails();
      }
    });
  }

  getSubjectList() {
    this.lookupService.getSubjects()
    .pipe(first())
    .subscribe(
    data => {
      this.subjectlist = data ; 

    },
    error => {
      this.alertService.error(error);
      this.loading = false;
    });
  }

  downloadPaper(){
    this.examService.getPaper("", this.examcode)
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

  isPaperApproved(){
    if (this.examdetails.paperallocation){
      var appovedPaper = this.examdetails.paperallocation.filter(paper => paper.status === "U");
      if (appovedPaper && appovedPaper.length > 0){
        this.paperApproved = true ; 
      }
    }
   
  }

  public disableScanning(){
    let scannedCopies = (this.examdetails && this.examdetails.totalscannedcopies ? this.examdetails.totalscannedcopies : 0 ) ;
    let assignedForScanning = (this.examdetails && this.examdetails.totalcopiesassignedforscanning ? this.examdetails.totalcopiesassignedforscanning : 0 ) ;
    let totalCopies = (this.examdetails && this.examdetails.numberofcopies  ? this.examdetails.numberofcopies : 0 ) ;

    if ( (scannedCopies + assignedForScanning) >= totalCopies ){
      this.isScanningDisabled = true ; 
    }
    if (this.mode == 'NEW'){
      this.isScanningDisabled = true ; 
    }
    if (this.paperApproved == false){
      this.isScanningDisabled = true ; 
    }
  }

  public disableEvaluation(){

    if(this.examdetails && this.examdetails.totalscannedcopies && this.examdetails.totalscannedcopies == 0){
      this.isEvaluationDisabled = true ; 
    } 

    if (this.examdetails && this.examdetails.totalscannedcopies <=  this.examdetails.totalcopiesassignedforevaluation ){
      this.isEvaluationDisabled = false ; 
    }
  }
}