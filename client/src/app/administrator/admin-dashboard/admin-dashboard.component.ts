import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../services/exams.service';
import { AlertService } from '../../services';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

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


}
