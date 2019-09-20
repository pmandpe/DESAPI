import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerMarkingComponent } from './answer-marking.component';

describe('AnswerMarkingComponent', () => {
  let component: AnswerMarkingComponent;
  let fixture: ComponentFixture<AnswerMarkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnswerMarkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnswerMarkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
