import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../services';
import { UtilService } from '../../../services/utilities.service';
import { ExamQuestionDetailsComponent } from '../../../administrator/exams/exam-question-details/exam-question-details.component';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css']
})
export class ExamQuestionsComponent implements OnInit {

  @Input() examQuestions;
  @Input() examcode;
  @Input() grandTotal  ; 
  totalExamMarks : number ; 
  constructor(private modalService: NgbModal,
    private route: ActivatedRoute,

    private alertService: AlertService,
    private utilService: UtilService) { }

   
ngOnInit(){

}
  

  ngOnChanges(changes: SimpleChanges) {
    console.log("Grand Total " + this.grandTotal ) ;
    if (this.examQuestions && this.examQuestions.length > 0){
      
      this.setTotalSubQuestionMarks() ;
      this.setTotalMarks() ;
    }
    
  }

  setTotalSubQuestionMarks(){
    
    this.examQuestions.forEach(question => {
      var subSectionTotal = 0 ; 
      question.sections.forEach(section => {
        subSectionTotal += parseFloat(section.subquestionmarks ? section.subquestionmarks : 0);
      });
      question.subsectiontotal =  subSectionTotal ; 
    });
  }

  setTotalMarks (){
    this.totalExamMarks = 0 ;
    this.examQuestions.forEach(function(question){
      this.totalExamMarks += question.totalmarks + question.subsectiontotal ; 
    }.bind(this)) ;
  }

  openQuestion(questionNo) {
    var question = {} ;
    var editMode = "EDIT";
    if (questionNo == -1) {
      editMode = "NEW";
    }

    if (editMode == "EDIT") {
      question = this.examQuestions.find(function (x) {
        var returnValue = x.questionno == questionNo;
        return (returnValue ? x : null);
      });
    }



    //const modalRef = this.modalService.open(ExamQuestionDetailsComponent);
    
    var modalRef = this.modalService.open(ExamQuestionDetailsComponent, { windowClass: 'scannerpopup' });
    modalRef.componentInstance.examQuestion = question;
    modalRef.componentInstance.examQuestions = this.examQuestions;
    modalRef.componentInstance.mode = editMode;
    modalRef.componentInstance.examcode = this.examcode;


    modalRef.result.then((result) => {
      if (result){
        this.examQuestions = result ; 
      }
        
    });
  }

}
