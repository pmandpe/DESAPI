import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './services';
import { User } from './models';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit{

    isLoggedIn : any ; 
    ngOnInit(): void {
        var currUser = localStorage.getItem('currentUser') ;
        if (currUser && currUser != ''){
            //this.router.navigateByUrl('/dashboard') ;
            this.isLoggedIn = true  ;
        }
        else{
            this.isLoggedIn = false ; 
        }

    }
    currentUser: User;
    
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

        
        
    
    }

    logout() {
        this.authenticationService.logout("");
        this.router.navigate(['/login']);
    }
}