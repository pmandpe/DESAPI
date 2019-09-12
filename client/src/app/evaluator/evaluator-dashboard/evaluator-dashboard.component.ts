import { Component, OnInit } from '@angular/core';
import { EvaluatorService } from '../../services/evaluator.service';
import { AlertService, AuthenticationService } from '../../services';

@Component({
  selector: 'app-evaluator-dashboard',
  templateUrl: './evaluator-dashboard.component.html',
  styleUrls: ['./evaluator-dashboard.component.css']
})
export class EvaluatorDashboardComponent implements OnInit {

  constructor(private evaluatorService: EvaluatorService, private authenticationService: AuthenticationService, private alertService: AlertService) { }
  dashboardData : any ; 
  ngOnInit() {

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


  getAssignedCopies(data) {

    //scanAssignment = this.utilityService.filterByString(data, "neelesh") ;
    var scanAssignment = data.find(x => x.username == this.authenticationService.currentUserValue[0].username);
    return scanAssignment;
  }

}
