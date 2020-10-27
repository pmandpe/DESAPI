import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService, AlertService } from '../../services';
import { MatSidenav } from '@angular/material';


@Component({ 
    selector: 'app-header', 
    templateUrl: 'header.component.html' ,
    styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit{
    @Input() inputSideNav: MatSidenav;
    isLoggedIn : any ;
    currUser : any ; 
    ngOnInit(): void {
        this.currUser = localStorage.getItem('currentUser') ;
        if (this.currUser && this.currUser != ''){
            this.currUser = JSON.parse(this.currUser) ;
            //this.router.navigateByUrl('/dashboard') ;
            this.isLoggedIn = true  ;
        }
        else{
            this.isLoggedIn = false ; 
        }

    }
    
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
    }

    logout() {
        this.authenticationService.logout("");
        this.router.navigate(['/login']);
    }
}