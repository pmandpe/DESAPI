import { Component, OnInit, Input } from '@angular/core';
import { EvaluatorService } from '../../services/evaluator.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../services';
import { ConfirmationDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-answer-marking',
  templateUrl: './answer-marking.component.html',
  styleUrls: ['./answer-marking.component.css']
})
export class AnswerMarkingComponent implements OnInit {

  examCode: string;
  questionData: any;
  answerData: any;
  totalObtainedMarks: any;
  disableSaveButton: boolean;
  answerCode: any;
  evaluationData: any;
  totalMarks: any;
  answerpdf: any;
  validation: boolean;


  json: any;


  constructor(
    private evaluatorService: EvaluatorService,
    private _Activatedroute: ActivatedRoute,
    private alertService: AlertService,
    private router: Router,
    private confirmDialogService: ConfirmationDialogService) {

  }


  ngOnInit() {

    this.examCode = this._Activatedroute.snapshot.paramMap.get("examcode");
    this.answerCode = this._Activatedroute.snapshot.paramMap.get("answercode");
    this.evaluatorService.getQuestionAnswers(this.examCode, this.answerCode)
      .subscribe(
      data => {
        var questionDataPlaceHolder: any;
        questionDataPlaceHolder = data;
        this.totalMarks = questionDataPlaceHolder.questions.totalexammarks;
        this.answerData = questionDataPlaceHolder.answers.answerdata;
        this.questionData = questionDataPlaceHolder.questions.questions;

        this.disableSaveButton = false;
        this.validation = true;

        this.getAnswerDetails();
        //this.answerData = {"questionno":"", "totalmarks":0, "marksobtained":0, "sections": []} ;
        this.setInitialAnswerData(data, this.questionData);

      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });
  }

  setInitialAnswerData(data: any, answerArray): any {

    //--disable the save button if the answer is ALREADY evaluated
    if (this.answerData && this.answerData && this.answerData[0].isevaluated && this.answerData[0].isevaluated == "Y") {
      this.disableSaveButton = true;
    }
    var questions = data.questions.questions;
    var answers = this.answerData[0].answers;
    questions.forEach(function (question) {
      var answer;
      //answerArray.questionno = question.questionno ; 
      //answerArray.totalmarks = question.totalmarks
      if (answers && answers.length > 0) {
        //-- set the presaved marks, if any
        answer = answers.find(function (x) {
          var returnValue = x.questionid == question.id;
          return (returnValue ? x : null);
        });
        question.marksobtained = answer.marksobtained;
      }
      else {
        question.marksobtained = 0;
      }
      if (question.sections && question.sections.length > 0) {
        question.sections.forEach(function (section) {
          var answerSection = answer.sections.find(function (answersection) {
            var returnValue = answersection.subquestionid == section.subquestionid;
            return (returnValue ? answersection : null);
          });
          section.marksobtained = answerSection.marksobtained;
        })
      }
    }.bind(this))

  }

  setTotalMarks() {
    var totalmarks = 0;

    for (let question of this.questionData) {
      if (question.marksobtained > parseInt(question.totalmarks)) {
        this.validation = false;
        break;
      }
      else {
        this.validation = true;
      }
      totalmarks += (question.marksobtained ? question.marksobtained : 0);
      if (question.sections && question.sections.length > 0) {
        question.sections.forEach(function (section) {
          totalmarks += (section.marksobtained ? section.marksobtained : 0);
        })
      }

    }
    this.totalObtainedMarks = totalmarks;
  }

  validateAndSave(submitFlag) {

    if (!this.validation) {
      this.alertService.error("Data entered is not valid. Please check the answer sheet for any errors");
      return false;
    }

    var returnValue = this.confirmDialogService.confirm('Please confirm..', 'Do you want to submit this Answer Sheet ? Once submitted, it cannot be changed.')
      .then((confirmed) => {
        if (!confirmed) {
          return false
        }
        this.saveAnswer(submitFlag);
        return true;
      })
      .catch(() => {
        console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)')
        return false;
      }
      );
  }


  saveAnswer(submitFlag) {
    var params = { "answercode": "", "examcode": "", "answers": [], "isevaluated": "" };
    params.answercode = this.answerCode;
    params.examcode = this.examCode;
    params.answers = this.questionData;
    params.isevaluated = submitFlag;
    this.evaluatorService.saveAnswers(params)//--Question data includes answers 
      .subscribe(
      data => {
        this.alertService.success("Data Saved Successfully")
        setTimeout(function () {
          this.router.navigate(['/evaluator/marking', this.examCode]);
        }.bind(this)
          , 3000);
        this.disableSaveButton = true;
      },
      error => {
        this.alertService.error(error);
      });

  }

  getJsonData() {
    this.json = JSON.stringify(this.questionData);
  }

  getAnswerDetails() {
    this.evaluatorService.getMarkingDetails(this.examCode, this.answerCode)
      .subscribe(
      data => {
        this.evaluationData = data;
        this.getPdf();
      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      }
      );
  }

  getPdf() {
    this.evaluatorService.getPdf(this.examCode, this.evaluationData.answerdata[0].answercode)
      .subscribe(
      data => {
        this.answerpdf = URL.createObjectURL(data);
      },
      error => {
        this.alertService.error(error);
        //this.loading = false;

      });
  }

}

