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
  answerData: any;
  totalObtainedMarks: any;
  totalExamMarks : any ;
  json: any ;
  ngOnInit() {
    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
    this.evaluatorService.getQuestions(this.examCode)
      .subscribe(
      data => {
        this.questionData = data;
        
        //this.answerData = {"questionno":"", "totalmarks":0, "marksobtained":0, "sections": []} ;
        this.setInitialAnswerData(data, this.questionData);

      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });
  }

  setInitialAnswerData(data: any, answerArray): any {

    data.forEach(function (question) {
      //answerArray.questionno = question.questionno ; 
      //answerArray.totalmarks = question.totalmarks
      answerArray.marksobtained = 0;
      if (question.sections && question.sections.length > 0) {
        answerArray.sections = [];
        question.sections.forEach(function (section) {
          //answerArray.sections.push ({"subquestionno": section.subquestionno, "totalmarks": section.totalmarks, "obtainedmarks" : 0} ) ;
          section.marksobtained = 0;
        })
      }
    })

  }

  setTotalMarks() {
    var totalmarks = 0;
    this.questionData.forEach(function (question) {
      totalmarks += (question.marksobtained ? question.marksobtained : 0);
      if (question.sections && question.sections.length > 0) {
        question.sections.forEach(function (section) {
          totalmarks += (section.marksobtained ? section.marksobtained : 0 );
        })
      }
    })
    this.totalObtainedMarks = totalmarks;
  }

  getJsonData(){
    this.json = JSON.stringify(this.questionData) ;
  }
}

