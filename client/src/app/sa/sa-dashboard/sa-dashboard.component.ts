import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exams.service';
import { AlertService } from '../../services';

@Component({
  selector: 'app-sa-dashboard',
  templateUrl: './sa-dashboard.component.html',
  styleUrls: ['./sa-dashboard.component.scss']
})
export class SaDashboardComponent implements OnInit {

  value = 40 ; 

  constructor(private examService: ExamService, private alertService: AlertService) { }
  Exams: any;
  ngOnInit() {
    this.examService.getExamDashboard()
      .subscribe(
        data => {
          this.Exams = data;
        },
        error => {
          this.alertService.error(error);
        });
  }

  getWidth(value, totalValue){
    let dividedBy = this.checkNull(totalValue) ;
    let percentvalue = this.checkNull(value) * 100 / ( dividedBy == 0 ? 1 : dividedBy)  + "" ;
    let returnValue = parseFloat(percentvalue).toFixed(2)
    return (returnValue + "%" ) ;
  }

  checkNull(input){
    if (!input){
      return 0 ; 
    }
    return input ; 
  }
}
