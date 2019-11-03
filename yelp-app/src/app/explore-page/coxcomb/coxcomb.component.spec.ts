import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoxcombComponent } from './coxcomb.component';

describe('CoxcombComponent', () => {
  let component: CoxcombComponent;
  let fixture: ComponentFixture<CoxcombComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoxcombComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoxcombComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
