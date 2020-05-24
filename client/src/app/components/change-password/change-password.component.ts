import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service'
import { MasterService } from '../../services/master.service'
import { UtilService } from '../../services/utilities.service'
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  userForm: FormGroup;
  loading: boolean;
  submitted : boolean ;
  constructor(private formBuilder: FormBuilder, private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.submitted = false ; 
    this.createChangePasswordForm();
  }
  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }
  createChangePasswordForm() {
    this.userForm = this.formBuilder.group({
      current_pwd: ['', Validators.required],
      pwd: ['', Validators.required],
      confirm_pwd: ['', Validators.required]
    },
      {
        validators: this.password.bind(this)
      });
  }


  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('pwd');
    const { value: confirmPassword } = formGroup.get('confirm_pwd');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }



  change() {

    this.submitted = true ; 
    // stop here if form is invalid
    if (this.userForm.invalid) {
      if (this.userForm.errors["passwordNotMatch"]) {
        this.alertService.error("Password and Confirm password donnot match.")
      }
      return;
    }

    this.authenticationService.changePassword(this.userForm.value)
      .pipe(first())
      .subscribe(
      data => {

        if (data["updateCount"] < 0) { //duplicate or saving exception
          this.alertService.error("Update Failed : Password is not changed");
        }
        else {
          this.alertService.success("Password Changed Successfully");


        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }
}
