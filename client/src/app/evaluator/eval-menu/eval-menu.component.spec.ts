import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalMenuComponent } from './eval-menu.component';

describe('EvalMenuComponent', () => {
  let component: EvalMenuComponent;
  let fixture: ComponentFixture<EvalMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
