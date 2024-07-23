import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScolarComponent } from './scolar.component';

describe('ScolarComponent', () => {
  let component: ScolarComponent;
  let fixture: ComponentFixture<ScolarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScolarComponent]
    });
    fixture = TestBed.createComponent(ScolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
