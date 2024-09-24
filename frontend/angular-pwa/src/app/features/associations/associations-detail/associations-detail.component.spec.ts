import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationsDetailComponent } from './associations-detail.component';

describe('AssociationsDetailComponent', () => {
  let component: AssociationsDetailComponent;
  let fixture: ComponentFixture<AssociationsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationsDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
