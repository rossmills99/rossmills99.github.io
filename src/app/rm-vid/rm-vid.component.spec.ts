import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmVidComponent } from './rm-vid.component';

describe('RmVidComponent', () => {
  let component: RmVidComponent;
  let fixture: ComponentFixture<RmVidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmVidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmVidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
