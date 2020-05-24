import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services/alert.service'
import { MasterService } from '../../services/master.service'
import { UtilService } from '../../services/utilities.service'
import { first } from 'rxjs/operators';
import { Role } from '../../models/Role';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  Users: any;
  
  userName : any ;
  userForm: FormGroup;
  selectedIndex: number ; 
  userDetails : any ; 
  disableUsername : any ;
  mode: any ;
  loading : boolean ; 
  submitted : boolean ; 
  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private masterService: MasterService, private alertService: AlertService, private utilService: UtilService) { }

  ngOnInit() {
    this.selectedIndex = 0 ;
    
    this.createNewUserForm();
    this.getUsers();
  }

  getUsers(): any {
    this.masterService.getUsers()
      .subscribe(
      data => {
        this.Users = data;
      },
      error => {
        this.alertService.error(error);

      });
  }

  createNewUserForm() {
    this.disableUsername = false ; 
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      role: ['', Validators.required],
      isactive: [''],
      emailid: ['', Validators.required],
      pwd: ['', Validators.required],
      confirm_pwd: ['', Validators.required],
      officecode: [''],
      officename:[''],
      contactperson:[''],
      address:[''],
      phone:[''],
      cell:[''],
      editmode: new FormControl("")
    },
    { 
      validators: this.password.bind(this)
    });
  }

  onTabChanged(event){
    this.selectedIndex = event.index ; 
  }
  getUserDetails(userName, mode) {
    this.disableUsername = true ;
    this.selectedIndex = 1  ;
    this.mode = mode ; //this.route.snapshot.paramMap.get("mode");
    this.userName = userName ; //this.route.snapshot.paramMap.get("subjectcode");

    if (this.mode != "NEW") {
      this.disableUsername = true;
      this.userForm.patchValue({ username: this.userName });
      this.masterService.getUserDetails(this.userName)

        .subscribe(
        data => {

          this.userDetails = data[0];
          this.userForm.patchValue({ username: this.userDetails.username });
          this.userForm.patchValue({ name: this.userDetails.name });
          this.userForm.patchValue({ emailid: this.userDetails.emailid });
          this.userForm.patchValue({ role: this.userDetails.role });
          this.userForm.patchValue({ isactive: this.userDetails.isactive });
          this.userForm.patchValue({ pwd: this.userDetails.pwd });
          this.userForm.patchValue({ confirm_pwd: this.userDetails.pwd });

          //-- setting scanning office details
          if (this.userDetails.role == Role.Scanner){
            this.userForm.patchValue({ officecode: this.userDetails.scanningoffice.officecode });
            this.userForm.patchValue({ contactperson: this.userDetails.scanningoffice.contactperson });
            this.userForm.patchValue({ officename: this.userDetails.scanningoffice.officename });
            this.userForm.patchValue({ address: this.userDetails.scanningoffice.address });
            this.userForm.patchValue({ cell: this.userDetails.scanningoffice.cell });
            this.userForm.patchValue({ phone: this.userDetails.scanningoffice.phone });
          }
          this.userForm.patchValue({ editmode: 'EDIT' });
        },
        error => {
          this.alertService.error(error);
          this.loading = false;

        });

    }
  }
  // convenience getter for easy access to form fields
  get f() { return this.userForm.controls; }

  addNewUser(){
    
    this.userForm.patchValue({ editmode: 'NEW' });
    this.userForm.patchValue({ username: '' });
    this.userForm.patchValue({ isactive: 'N' });
    this.createNewUserForm() ; 
    this.selectedIndex = 1  ;

  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('pwd');
    const { value: confirmPassword } = formGroup.get('confirm_pwd');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }

  saveUser() {
    this.submitted = true;
    
    // stop here if form is invalid
    if (this.userForm.invalid) {
      if (this.userForm.errors["passwordNotMatch"]){
        this.alertService.error("Password and Confirm password donnot match.")
      }
      return;
    }

    if (!this.userForm.value.editmode){
      this.userForm.patchValue({ editmode: 'NEW' });
      this.userForm.patchValue({ isactive: 'N' });
    }
    this.loading = true;
    this.masterService.saveUser(this.userForm.value)
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
          this.userForm.patchValue({ editmode: 'EDIT' });
          this.disableUsername = true;
          this.getUsers() ;
        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }























}
