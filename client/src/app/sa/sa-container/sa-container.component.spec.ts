import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaContainerComponent } from './sa-container.component';

describe('SaContainerComponent', () => {
  let component: SaContainerComponent;
  let fixture: ComponentFixture<SaContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
