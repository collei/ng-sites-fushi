import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscritaComponent } from './escrita.component';

describe('EscritaComponent', () => {
  let component: EscritaComponent;
  let fixture: ComponentFixture<EscritaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EscritaComponent]
    });
    fixture = TestBed.createComponent(EscritaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
