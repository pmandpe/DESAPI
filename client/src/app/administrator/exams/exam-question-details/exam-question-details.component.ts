import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExamService } from '../../../services/exams.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../../services';
import { UtilService } from '../../../services/utilities.service';
import { FormBuilder, FormArray } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


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
  dataSaved: boolean;
  subquestiontotal: any;
  totalquestionmarks: any;
  constructor(public activeModal: NgbActiveModal, private examService: ExamService, private _fb: FormBuilder, private alertService: AlertService, private utilService: UtilService) { }

  ngOnInit() {
    this.dataSaved = false;
    if (!this.examQuestions) { //In case its a new question, the examQuestions will come as undefined
      this.examQuestions = [];
      this.examQuestion = this.getNewQuestion();
    }
    else {
      this.setTotalMarks();
    }

  }

  closeModal() {
    this.activeModal.close(this.examQuestions);
  }


  addNewSubQuestion() {
    if (!this.examQuestion.sections) {
      this.examQuestion.sections = [];
    }
    this.examQuestion.sections.push(this.getNewSubQuestion());
    //this.formArr.push(this.initItemRows()) ;
  }

  setTotalMarks() {

    var mainQuestionMarks = this.examQuestion.totalmarks;
    var subQuestionMarks = 0.0;
    this.examQuestion.sections.forEach(element => {
      subQuestionMarks += parseFloat(element.subquestionmarks ? element.subquestionmarks : 0);
    });

    this.examQuestion.totalmarks = mainQuestionMarks;
    this.subquestiontotal = subQuestionMarks;
    this.totalquestionmarks = mainQuestionMarks + subQuestionMarks;


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
        this.dataSaved = true;
   

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
