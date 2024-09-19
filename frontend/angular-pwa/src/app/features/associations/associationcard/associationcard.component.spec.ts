import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationcardComponent } from './associationcard.component';

describe('AssociationcardComponent', () => {
  let component: AssociationcardComponent;
  let fixture: ComponentFixture<AssociationcardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociationcardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssociationcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
