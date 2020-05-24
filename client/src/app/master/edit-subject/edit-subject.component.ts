import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { MasterService } from '../../services/master.service';
import { AlertService } from '../../services';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./edit-subject.component.css']
})
export class EditSubjectComponent implements OnInit {
  subjectForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  mode: string;
  uniquecode: string;
  subjectdetails: any;
  disableSubjectCode = false;
  @Input() passedCode: string;
  @Output() changeName = new EventEmitter();
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService,
    private alertService: AlertService,
    private _Activatedroute: ActivatedRoute) { }

  ngOnInit() {

    console.log("------------------------------"+this.passedCode) ;
    this.subjectForm = this.formBuilder.group({
      subjectcode: ['', Validators.required],
      subjectname: ['', Validators.required],
      subjectclass: ['', Validators.required],
      examyear: ['', Validators.required],
      editmode: new FormControl(""),
      semester: new FormControl(""),
      stream: new FormControl("")


    });
    this.mode = this._Activatedroute.snapshot.paramMap.get("mode");
    this.uniquecode = this._Activatedroute.snapshot.paramMap.get("subjectcode");

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
          this.loading = false ;

        });

    }
   
  }


  updateName() {
    // emitting changeName custom event
    this.changeName.emit();
  }

// convenience getter for easy access to form fields
get f() { return this.subjectForm.controls; }

getSubjectCode(){
  return this.passedCode ;
}
saveSubject() {
  this.submitted = true;
  // stop here if form is invalid
  if (this.subjectForm.invalid) {
    return;
  }

  this.loading = true;
  this.masterService.saveSubject(this.subjectForm.value)
    .pipe(first())
    .subscribe(
    data => {
      this.loading = false;
      var responseData : any ;
      responseData = data ; 
      if (responseData.updateCount == 11000 || responseData.updateCount < 0){ //duplicate or saving exception
        this.alertService.error("Update Failed : " + responseData.error) ;
      }
      else{
        this.alertService.success("Data Saved Successfully") ;
        this.subjectForm.patchValue({ editmode: 'EDIT' });
        this.disableSubjectCode = true;
      }
    },
    error => {
      this.alertService.error(error);
      this.loading = false;
    });
}

}