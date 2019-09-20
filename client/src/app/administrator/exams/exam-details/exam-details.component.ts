import { Component, OnInit, Directive } from '@angular/core';
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

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.css']
})
export class ExamDetailsComponent implements OnInit {
  examForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  examQuestions: any;
  mode: string;
  examcode: string;
  examdetails: any;
  disableSubjectCode = false;
  showUniqueCode = false;
  closeResult: string;
  constructor(private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private alertService: AlertService,
    private utilService: UtilService,

    private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {


    this.examForm = this.formBuilder.group({
      examname: ['', Validators.required],
      subjectcode: ['', Validators.required],
      examdate: ['', Validators.required],
      resultdate: ['', Validators.required],
      numberofcopies: ['', Validators.required],
      comments: new FormControl(""),
      totalcopiesassignedforscanning: new FormControl(0),
      totalcopiesassignedforevaluation: new FormControl(0),
      scanningassignment: new FormControl([]) ,
      scannedcopies: new FormControl(0) ,
      evaluationassignment: new FormControl([]) ,
      editmode: new FormControl("")


    });
    //this.mode = this.examForm.value.editmode ; 
    this.mode = this._Activatedroute.snapshot.paramMap.get("mode") ; 
    this.examcode = this._Activatedroute.snapshot.paramMap.get("examcode");
    
  

    if (this.examcode) {
      this.showUniqueCode = false;
    }

    if (this.mode != "NEW") {
      this.disableSubjectCode = true;

      this.examService.getExamDetails(this.examcode)
        .subscribe(
        data => {
          
          this.examdetails = data[0];
          this.examQuestions = this.examdetails.questions; 
         
          var exDate = this.utilService.getBrokenDate(this.examdetails.examdate);
          var reDate = this.utilService.getBrokenDate(this.examdetails.resultdate);
          
          this.examForm.patchValue({ examname: this.examdetails.examname });
          this.examForm.patchValue({ subjectcode: this.examdetails.subjectcode });
          this.examForm.patchValue({ examdate: exDate });
          this.examForm.patchValue({ numberofcopies: this.examdetails.numberofcopies });
          this.examForm.patchValue({ totalcopiesassignedforscanning: this.examdetails.totalcopiesassignedforscanning });
          this.examForm.patchValue({ totalcopiesassignedforevaluation: this.examdetails.totalcopiesassignedforevaluation });
          this.examForm.patchValue({ resultdate: reDate });
          this.examForm.patchValue({ comments: this.examdetails.comments });
          this.examForm.patchValue({scanningassignment: this.examdetails.scanningassignment})
          this.examForm.patchValue({evaluationassignment: this.examdetails.evaluationassignment}) ;
          this.examForm.patchValue({scannedcopies: this.examdetails.scannedcopies})



          this.examForm.patchValue({ editmode: 'EDIT' });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;

        });

    }
   
  }




  saveExam() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.examForm.invalid) {
      return;
    }
    this.loading = true;
    

    var params = this.examForm.value;
    params.examcode = this.examcode ;
    var resultdateValue = this.examForm.value.resultdate.year.toString().padStart(2, '0') + "-" + this.examForm.value.resultdate.month.toString().padStart(2, '0') + "-" + this.examForm.value.resultdate.day.toString().padStart(2, '0');
    var examdateValue = this.examForm.value.examdate.year + "-" + this.examForm.value.examdate.month.toString().padStart(2, '0') + "-" + this.examForm.value.examdate.day.toString().padStart(2, '0');
    params.resultdate = resultdateValue;
    params.examdate = examdateValue;
  
    this.examService.saveExam(params)
      .pipe(first())
      .subscribe(
      data => {
        this.loading = false;
        this.alertService.success("Data Saved Successfully");
        this.examForm.patchValue({ editmode: 'EDIT' });
        this.disableSubjectCode = true;
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }



  // convenience getter for easy access to form fields
  get f() { return this.examForm.controls; }



  open(openFor) {

    const modalRef = this.modalService.open(AssignScannerComponent,   { windowClass: 'scannerpopup'});
    modalRef.componentInstance.examFormValues =  this.examForm.value;
    modalRef.componentInstance.examCode = this.examcode ; 
    modalRef.componentInstance.userType = openFor ;
    
    modalRef.result.then((result) => {
      if (result) {
        this.ngOnInit() ;
      }
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}