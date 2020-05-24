import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSettingComponent } from './paper-setting.component';

describe('PaperSettingComponent', () => {
  let component: PaperSettingComponent;
  let fixture: ComponentFixture<PaperSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaperSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
