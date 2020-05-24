import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../services';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html'
})


export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;
    hideAlert: boolean ;
    constructor(private alertService: AlertService, private _snackBar: MatSnackBar) { }

    ngOnInit() {
        this.hideAlert = false ;
        this.subscription = this.alertService.getMessage().subscribe(message => { 
                //this.message = message; 
                if (message && message != '') {
                    this.openSnackBar(message, "Close");
                }
            
        });
    }


    openSnackBar(message: any, action: string) {
        if (!message) {
            return;
        }
        var panelClassArray;
        if (message.type == "success") {
            panelClassArray = ['green-snackbar'];
        }
        else {
            panelClassArray = ['red-snackbar'];
        }
        this._snackBar.open(message.text, action, {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: panelClassArray
        })
    }
    ngOnDestroy() {
        //this.subscription.unsubscribe();
    }
    removeAlert(alert){
        this.message = "" ;
        this.hideAlert = true ;
    }
}