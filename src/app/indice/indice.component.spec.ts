import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceComponent } from './indice.component';

describe('IndiceComponent', () => {
  let component: IndiceComponent;
  let fixture: ComponentFixture<IndiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [IndiceComponent]
    });
    fixture = TestBed.createComponent(IndiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
