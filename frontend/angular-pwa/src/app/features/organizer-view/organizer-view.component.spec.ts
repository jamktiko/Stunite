import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerViewComponent } from './organizer-view.component';

describe('OrganizerViewComponent', () => {
  let component: OrganizerViewComponent;
  let fixture: ComponentFixture<OrganizerViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
