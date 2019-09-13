import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MasterService } from '../../../services/master.service';
import { AlertService } from '../../../services';
import { ExamService } from '../../../services/exams.service';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.css']
})
export class ExamListComponent implements OnInit {

  constructor(private router: Router, private examService: ExamService, private alertService: AlertService) { }
  Exams: any;
  ngOnInit() {

    this.examService.getExams()

      .subscribe(
        data => {

          this.Exams = data;

        },
        error => {
          this.alertService.error(error);

        });
  }

}


