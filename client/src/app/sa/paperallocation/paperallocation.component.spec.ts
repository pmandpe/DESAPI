import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperallocationComponent } from './paperallocation.component';

describe('PaperallocationComponent', () => {
  let component: PaperallocationComponent;
  let fixture: ComponentFixture<PaperallocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperallocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperallocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
