import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatorDashboardComponent } from './evaluator-dashboard.component';

describe('EvaluatorDashboardComponent', () => {
  let component: EvaluatorDashboardComponent;
  let fixture: ComponentFixture<EvaluatorDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatorDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
