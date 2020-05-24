import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaMenuComponent } from './sa-menu.component';

describe('SaMenuComponent', () => {
  let component: SaMenuComponent;
  let fixture: ComponentFixture<SaMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
