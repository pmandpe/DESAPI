import { Component, OnInit } from '@angular/core';
import { EvaluatorService } from '../../services/evaluator.service';
import { AlertService, AuthenticationService } from '../../services';
import { UtilService } from '../../services/utilities.service';

@Component({
  selector: 'app-evaluator-dashboard',
  templateUrl: './evaluator-dashboard.component.html',
  styleUrls: ['./evaluator-dashboard.component.css']
})
export class EvaluatorDashboardComponent implements OnInit {
  breakpoint: number;
  constructor(private evaluatorService: EvaluatorService, private authenticationService: AuthenticationService, private alertService: AlertService, private utilityService: UtilService) { }
  dashboardData : any ; 
  ngOnInit() {
    this.breakpoint = (window.innerWidth <= 400) ? 1 : 6;
    this.evaluatorService.getDashboard()
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
  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 400) ? 1 : 6;
  }

  getAssignedCopies(data) {
    var username = this.authenticationService.currentUserValue.username ;
    var assignee = data.find(function (x) {
      var returnValue = x.username == username
      return (returnValue ? x : null);
    });
    //var scanAssignment = this.utilityService.filterByString(data, username )

    
    return assignee;
  }

}
