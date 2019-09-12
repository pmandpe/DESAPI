import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalContainerComponent } from './eval-container.component';

describe('EvalContainerComponent', () => {
  let component: EvalContainerComponent;
  let fixture: ComponentFixture<EvalContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
