import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngDtablesComponent } from './ang-dtables.component';

describe('AngDtablesComponent', () => {
  let component: AngDtablesComponent;
  let fixture: ComponentFixture<AngDtablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngDtablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngDtablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
