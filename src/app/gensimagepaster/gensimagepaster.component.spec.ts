import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GensimagepasterComponent } from './gensimagepaster.component';

describe('GensimagepasterComponent', () => {
  let component: GensimagepasterComponent;
  let fixture: ComponentFixture<GensimagepasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [GensimagepasterComponent]
    });
    fixture = TestBed.createComponent(GensimagepasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
