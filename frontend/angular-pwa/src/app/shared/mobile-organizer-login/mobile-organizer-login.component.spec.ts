import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileOrganizerLoginComponent } from './mobile-organizer-login.component';

describe('MobileOrganizerLoginComponent', () => {
  let component: MobileOrganizerLoginComponent;
  let fixture: ComponentFixture<MobileOrganizerLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobileOrganizerLoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileOrganizerLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
