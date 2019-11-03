import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LasvegasComponent } from './lasvegas.component';

describe('LasvegasComponent', () => {
  let component: LasvegasComponent;
  let fixture: ComponentFixture<LasvegasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LasvegasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LasvegasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
