import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeotopiaMapComponent } from './neotopia-map.component';

describe('NeotopiaMapComponent', () => {
  let component: NeotopiaMapComponent;
  let fixture: ComponentFixture<NeotopiaMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NeotopiaMapComponent]
    });
    fixture = TestBed.createComponent(NeotopiaMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
