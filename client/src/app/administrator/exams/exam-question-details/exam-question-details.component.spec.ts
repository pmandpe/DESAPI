import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamQuestionDetailsComponent } from './exam-question-details.component';

describe('ExamQuestionDetailsComponent', () => {
  let component: ExamQuestionDetailsComponent;
  let fixture: ComponentFixture<ExamQuestionDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamQuestionDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamQuestionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
