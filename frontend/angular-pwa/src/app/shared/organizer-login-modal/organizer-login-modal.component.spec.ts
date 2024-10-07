import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerLoginModalComponent } from './organizer-login-modal.component';

describe('OrganizerLoginModalComponent', () => {
  let component: OrganizerLoginModalComponent;
  let fixture: ComponentFixture<OrganizerLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerLoginModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
