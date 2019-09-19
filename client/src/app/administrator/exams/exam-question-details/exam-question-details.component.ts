import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExamService } from '../../../services/exams.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../../services';
import { UtilService } from '../../../services/utilities.service';
import { FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-exam-question-details',
  templateUrl: './exam-question-details.component.html',
  styleUrls: ['./exam-question-details.component.css']
})
export class ExamQuestionDetailsComponent implements OnInit {
  @Input() examQuestion;
  @Input() examQuestions;
  @Input() examcode;
  @Input() mode;


  loading: any;
  constructor(public activeModal: NgbActiveModal, private examService: ExamService, private _fb: FormBuilder, private alertService: AlertService, private utilService: UtilService) { }

  ngOnInit() {
    if (!this.examQuestions) { //In case its a new question, the examQuestions will come as undefined
      this.examQuestions = [];
      this.examQuestion = this.getNewQuestion();
    }
   
  }

 
  

  addNewSubQuestion() {
    if (!this.examQuestion.sections){
      this.examQuestion.sections =[] ;
    }
    this.examQuestion.sections.push(this.getNewSubQuestion());
    //this.formArr.push(this.initItemRows()) ;
  }

  save(questionNo) {

    if (this.mode == "EDIT") {
      var question = this.examQuestions.find(function (x) {
        var returnValue = x.questionno == questionNo;
        return (returnValue ? x : null);
      });


      this.examQuestions.forEach(element => {
        if (element.questionno == questionNo) {
          element = this.examQuestion;
        }
      });
    }
    else { //If mode is NEW
      var highestQuestionNo = this.utilService.getMax(this.examQuestions, "questionno");
      if (!highestQuestionNo) {
        highestQuestionNo = "0";
      }
      this.examQuestion.questionno = parseInt(highestQuestionNo) + 1;
      this.examQuestions.push(this.examQuestion);

    }

    //console.log(JSON.stringify(this.examQuestions)) ;

    var params = {
      "questions": this.examQuestions,
      "examcode": this.examcode,
      "mode": this.mode
    }
    this.examService.saveQuestion(params)
      .pipe(first())
      .subscribe(
        data => {
          this.loading = false;
          this.alertService.success("Data Saved Successfully");
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });

  }

  getNewQuestion() {
    var newQuestion = {
      "questionno": 0,
      "questiontext": "",
      "totalmarks": "",
      "idealanswer": "",
      "questiontype": "",
      "sections": []
    }
    return newQuestion;
  }

  getNewSubQuestion() {
    var newQuestion = {
      "subquestionid": 0,
      "subquestiontext": "",
      "totalmarks": "",
      "idealanswer": "",
      "subquestiontype": ""
     }
    return newQuestion;
  }


}
