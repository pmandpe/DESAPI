import { Component, OnInit } from '@angular/core';
import { ScannerService } from '../../services/scanner.service';
import { AlertService, AuthenticationService } from '../../services';
import { UtilService } from '../../services/utilities.service';

@Component({
  selector: 'app-scanner-dashboard',
  templateUrl: './scanner-dashboard.component.html',
  styleUrls: ['./scanner-dashboard.component.css']
})
export class ScannerDashboardComponent implements OnInit {

  dashboardData: any;
  scanningAssignment: any;
  constructor(
    private scannerService: ScannerService,
    private alertService: AlertService,
    private utilityService: UtilService,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {

    this.scannerService.getDashboard()
      .subscribe(
        data => {
          this.dashboardData = data;
          // this.scanningAssignment = this.getScanningAssignment(data);
        },
        error => {
          this.alertService.error(error);
          //this.loading = false;

        });

  }

  getAssignedCopies(data) {

    //scanAssignment = this.utilityService.filterByString(data, "neelesh") ;
    var scanAssignment = data.find(x => x.username == this.authenticationService.currentUserValue);
    return scanAssignment;
  }

}

