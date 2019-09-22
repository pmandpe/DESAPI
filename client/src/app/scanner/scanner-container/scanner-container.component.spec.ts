import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScannerContainerComponent } from './scanner-container.component';

describe('ScannerContainerComponent', () => {
  let component: ScannerContainerComponent;
  let fixture: ComponentFixture<ScannerContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScannerContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScannerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
