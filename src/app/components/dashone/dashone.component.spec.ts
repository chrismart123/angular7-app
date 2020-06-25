import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashoneComponent } from './dashone.component';

describe('DashoneComponent', () => {
  let component: DashoneComponent;
  let fixture: ComponentFixture<DashoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
