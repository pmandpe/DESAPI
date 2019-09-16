import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.css']
})
export class ExamQuestionsComponent implements OnInit {

  @Input() examQuestions ; 
  constructor() { }

  ngOnInit() {
    console.log(JSON.stringify("------------" + this.examQuestions)) ;
  }

}
