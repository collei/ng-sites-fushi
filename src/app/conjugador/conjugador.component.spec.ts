import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConjugadorComponent } from './conjugador.component';

describe('ConjugadorComponent', () => {
  let component: ConjugadorComponent;
  let fixture: ComponentFixture<ConjugadorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConjugadorComponent]
    });
    fixture = TestBed.createComponent(ConjugadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
