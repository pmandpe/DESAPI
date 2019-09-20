import { Component, OnInit } from '@angular/core';
import { EvaluatorService } from '../../services/evaluator.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../services';

@Component({
  selector: 'app-answer-marking',
  templateUrl: './answer-marking.component.html',
  styleUrls: ['./answer-marking.component.css']
})
export class AnswerMarkingComponent implements OnInit {

  constructor(private evaluatorService: EvaluatorService, private _Activatedroute: ActivatedRoute, private alertService: AlertService) { }

  examCode: string;
  questionData: any;
  answerData: {} ;

  ngOnInit() {
    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
    this.evaluatorService.getQuestions(this.examCode)
      .subscribe(
        data => {
          this.questionData = data;
          console.log(JSON.stringify(data));
        },
        error => {
          this.alertService.error(error);
          //this.loading = false;

        });
  }
}

