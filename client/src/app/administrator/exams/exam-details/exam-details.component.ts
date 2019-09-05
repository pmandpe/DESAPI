import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { get } from 'http';
import { first } from 'rxjs/operators';
import { MasterService } from '../../../services/master.service';
import { AlertService } from '../../../services';
import { ExamService } from 'app/services/exams.service';

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
  mode: string;
  uniquecode: string;
  examdetails: any;
  disableSubjectCode = false;
  showUniqueCode = false ; 
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {


    this.examForm = this.formBuilder.group({
      examname: ['', Validators.required],
      subjectcode: ['', Validators.required],
      examdate: ['', Validators.required],
      resultdate: ['', Validators.required],
      numberofcopies:['', Validators.required],
      comments: new FormControl(""),
      editmode: new FormControl("")

    });
    this.mode = this._Activatedroute.snapshot.paramMap.get("mode");
    this.uniquecode = this._Activatedroute.snapshot.paramMap.get("examcode");

    if (this.uniquecode){
      this.showUniqueCode = false ; 
    }

    if (this.mode != "NEW") {
      this.disableSubjectCode = true;
    
      this.examService.getExamDetails(this.uniquecode)
        .subscribe(
        data => {

          this.examdetails = data[0];
          this.examForm.patchValue({ examname: this.examdetails.examname });
          this.examForm.patchValue({ subjectcode: this.examdetails.subjectcode });
          this.examForm.patchValue({ examdate: this.examdetails.examdate });
          this.examForm.patchValue({ numberofcopies: this.examdetails.numberofcopies });
          this.examForm.patchValue({ resultdate: this.examdetails.resultdate });
          this.examForm.patchValue({ comments: this.examdetails.comments });


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
    console.log("--------------"+ JSON.stringify(this.examForm.value)) ;
     this.loading = true;
     var params = this.examForm.value ; 
     var resultdateValue = this.examForm.value.resultdate.year.toString().padStart(2, '0') + "-" + this.examForm.value.resultdate.month.toString().padStart(2, '0') + "-" + this.examForm.value.resultdate.day.toString().padStart(2, '0') ;
     var examdateValue = this.examForm.value.examdate.year + "-" + this.examForm.value.examdate.month.toString().padStart(2, '0') + "-" +  this.examForm.value.examdate.day.toString().padStart(2, '0') ;
    params.resultdate = resultdateValue ;
    params.examdate = examdateValue ; 
    this.examService.saveExam(this.examForm.value)
      .pipe(first())
      .subscribe(
      data => {
        this.loading = false;
        this.alertService.success("Data Saved Successfully") ;
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
}