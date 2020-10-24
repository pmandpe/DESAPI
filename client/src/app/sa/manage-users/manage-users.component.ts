import { Component, OnInit } from '@angular/core';
import { MasterService } from '../../services/master.service';
import { AlertService } from '../../services';
import { User } from '../../models/user';
import { FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from '../../services/utilities.service'

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  Users: any;
  AdminUsers: any;
  userName: any;
  userForm: FormGroup;
  selectedIndex: number;
  userDetails: any;
  disableUsername: any;
  mode: any;
  loading: boolean;
  submitted: boolean;
  constructor(private masterService: MasterService, private alertService: AlertService, private formBuilder: FormBuilder,     private route: ActivatedRoute,
    private router: Router
) { }

  ngOnInit() {
    this.createNewUserForm();
    this.masterService.getEvaluators()
      .subscribe(
      data => {
        this.Users = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  saveUsers() {

    var paramUsers = this.getUsersForApproval(this.Users);
    this.masterService.approveUsers(paramUsers)
      .subscribe(
      data => {
        console.log(JSON.stringify(data));
        if (data["updateCount"] > 0) {
          this.alertService.success("Data Updated Successfully");
        }
      },
      error => {
        this.alertService.error(error);
      });
  }

  checkChanged(event, i) {
    if (event) {
      this.Users[i].isactive = (event.checked ? "Y" : "N");
    }
  }


  getUsersForApproval(Users) {
    var returnUsers = [];
    Users.forEach(user => {
      returnUsers.push({ "username": user.username, "isactive": user.isactive })
    }
    )
    return returnUsers;
  }

  onTabChanged(event) {
    if (event.index == 1) {
      this.populateAdminUsers();
    }
  }

  populateAdminUsers() {
    this.masterService.getAdminUsers()
      .subscribe(
      data => {
        this.AdminUsers = data;
      },
      error => {
        this.alertService.error(error);
      });
  }

  createNewUserForm() {
    this.disableUsername = false;
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      name: ['', Validators.required],
      pwd: ['', Validators.required],
      role: ['', Validators.required],
      isactive: [''],
      emailid: ['', Validators.required],
      editmode: new FormControl("")
    });
  }


  getUserDetails(userName, mode) {
    this.disableUsername = true;
    this.selectedIndex = 2;
    this.mode = mode; //this.route.snapshot.paramMap.get("mode");
    this.userName = userName; //this.route.snapshot.paramMap.get("subjectcode");

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
          this.userForm.patchValue({ pwd: this.userDetails.pwd });
          this.userForm.patchValue({ role: this.userDetails.role });
          this.userForm.patchValue({ isactive: this.userDetails.isactive });
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

  addNewUser() {
    
    
    this.createNewUserForm() ;
    this.userForm.patchValue({ editmode: 'NEW' });
    this.userForm.patchValue({ username: '' });
    this.userForm.patchValue({ isactive: 'Y' });
    this.selectedIndex = 2 ;
    

  }

  saveUser() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    if (!this.userForm.value.editmode) {
      this.userForm.patchValue({ editmode: 'NEW' });
      this.userForm.patchValue({ isactive: 'Y' });
    }
    this.loading = true;
    this.masterService.saveAdmin(this.userForm.value)
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
          //this.getUsers() ;
        }
      },
      error => {
        this.alertService.error(error);
        this.loading = false;
      });
  }

}