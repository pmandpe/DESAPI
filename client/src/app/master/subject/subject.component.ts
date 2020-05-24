import {  Input, EventEmitter, Output } from '@angular/core';


import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { AlertService } from '../../services';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilService } from '../../services/utilities.service';
import { FormGroup, FormBuilder,  Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  Subjects: any;
  passedSubjectCode: any;
  selectedIndex = 0;
  subjectForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  mode: string;
  uniquecode: string;
  subjectdetails: any;
  disableSubjectCode = false;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService, private alertService: AlertService, private utilService: UtilService) { }

  
  ngOnInit() {
    this.createNewSubjectForm() ; 
    this.getSubjects() ;
  }

  createNewSubjectForm(){
    this.subjectForm = this.formBuilder.group({
      subjectcode: ['', Validators.required],
      subjectname: ['', Validators.required],
      subjectclass: ['', Validators.required],
      examyear: ['', Validators.required],
      editmode: new FormControl(""),
      semester: new FormControl(""),
      stream: new FormControl("")


    });
  }

  getSubjects(){
    this.masterService.getSubjects()
      .subscribe(
      data => {
        this.Subjects = data;
      },
      error => {
        this.alertService.error(error);

      });
  }
  onTabChanged(event){
    this.selectedIndex = event.index ; 
  }
  getSubjectDetails(subjectCode, mode) {
    
    this.selectedIndex = 1  ;
    this.mode = mode ; //this.route.snapshot.paramMap.get("mode");
    this.uniquecode = subjectCode ; //this.route.snapshot.paramMap.get("subjectcode");

    if (this.mode != "NEW") {
      this.disableSubjectCode = true;
      this.subjectForm.patchValue({ subjectcode: this.uniquecode });
      this.masterService.getSubjectDetails(this.uniquecode)

        .subscribe(
        data => {

          this.subjectdetails = data[0];
          this.subjectForm.patchValue({ subjectname: this.subjectdetails.subjectname });
          this.subjectForm.patchValue({ subjectclass: this.subjectdetails.subjectclass });
          this.subjectForm.patchValue({ examyear: this.subjectdetails.examyear });
          this.subjectForm.patchValue({ semester: this.subjectdetails.semester });
          this.subjectForm.patchValue({ stream: this.subjectdetails.stream });
          this.subjectForm.patchValue({ editmode: 'EDIT' });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;

        });

    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.subjectForm.controls; }

  addNewSubject(){
    
    this.subjectForm.patchValue({ editmode: 'NEW' });
    this.subjectForm.patchValue({ subjectcode: '0' });
    this.createNewSubjectForm() ; 
    this.selectedIndex = 1  ;

  }

  saveSubject() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.subjectForm.invalid) {
      return;
    }

    if (!this.subjectForm.value.editmode){
      this.subjectForm.patchValue({ editmode: 'NEW' });
    }
    this.loading = true;
    this.masterService.saveSubject(this.subjectForm.value)
      .pipe(first())
      .subscribe(
      data => {
        this.loading = false;
        var responseData: any;
        responseData = data;
        if (responseData.updateCount == 11000 || responseData.updateCount < 0) { //duplicate or saving exception
          this.alertService.error("Update Failed : " + responseData.error);
        }
        else {
          this.alertService.success("Data Saved Successfully");
          this.subjectForm.patchValue({ editmode: 'EDIT' });
          this.disableSubjectCode = true;
          this.getSubjects() ;
        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }


}
