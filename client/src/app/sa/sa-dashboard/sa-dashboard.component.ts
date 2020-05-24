import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exams.service';
import { AlertService } from '../../services';

@Component({
  selector: 'app-sa-dashboard',
  templateUrl: './sa-dashboard.component.html',
  styleUrls: ['./sa-dashboard.component.css']
})
export class SaDashboardComponent implements OnInit {


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

    return (this.checkNull(value) * 100 / ( dividedBy == 0 ? 1 : dividedBy) + "%" ) ;
  }

  checkNull(input){
    if (!input){
      return 0 ; 
    }
    return input ; 
  }
}
