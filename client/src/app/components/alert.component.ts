import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../services';



@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html'
})


export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;
    hideAlert: boolean ;
    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.hideAlert = false ;
        this.subscription = this.alertService.getMessage().subscribe(message => { 
            this.message = message; 
        });
    }

    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }
    removeAlert(alert){
        this.message = "" ;
        this.hideAlert = true ;
    }
}