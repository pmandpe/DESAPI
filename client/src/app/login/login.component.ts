import { Component, OnInit, AfterContentInit,AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../services';
import 'rxjs/add/operator/filter';



@Component(
    {templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit, AfterViewInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    dashboardUrl : string ; 
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private authenticationService: AuthenticationService
    ) {
        // redirect to home if already logged in
        this.dashboardUrl = this.authenticationService.getDashboardUrl() ; 
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate([this.dashboardUrl]);
        }
    }



    ngAfterViewInit(): void {
        if (this.authenticationService.forcedLogout){
            this.alertService.error("You are logged out. This may happen if you are trying to access unauthorized services.");
        }
      }
    

    ngOnInit() {

       
        
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.dashboardUrl;
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    signIn() {

        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    if (data.status && data.status == 400) { //Invalid user id password
                       this.alertService.error(data.message) ;
                       this.loading = false ; 
                    }
                    else{
                        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || this.authenticationService.getDashboardUrl();
                        this.router.navigate([this.returnUrl]);
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
