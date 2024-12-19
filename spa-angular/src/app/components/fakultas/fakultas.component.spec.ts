import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakultasComponent } from './fakultas.component';

describe('FakultasComponent', () => {
  let component: FakultasComponent;
  let fixture: ComponentFixture<FakultasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakultasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakultasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
