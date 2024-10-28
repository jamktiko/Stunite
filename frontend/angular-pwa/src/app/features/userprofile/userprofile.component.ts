import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class UserprofileComponent implements OnInit {
  lomake: FormGroup;
  valitutKohteet: string[] = [];
  canEdit: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize the form
    this.lomake = this.fb.group({
      etunimi: [''],
      sukunimi: [''],
      sahkoposti: [''],
      puhelin: [''],
      koulu: [''],
      ala: [''],
      paikallisyhdistys: [''],
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
    const currentUser = this.authService.getCurrUser();
    if (currentUser) {
      // put currentusers data to input fields
      this.lomake.patchValue({
        etunimi: currentUser.firstName,
        sukunimi: currentUser.lastName,
        sahkoposti: currentUser.email,
        puhelin: currentUser.phoneNumber,
        koulu: currentUser.koulu,
        ala: currentUser.ala,
        paikallisyhdistys: currentUser.paikallisyhdistys,
      });
    } else {
      console.error('Käyttäjä ei löytynyt.');
    }
  }

  enableEdit() {
    this.canEdit = true;
  }

  cancelEdit() {
    this.canEdit = false;
    // reset values to original from backend
    this.loadUserData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  selectKohde(kohde: string) {
    const index = this.valitutKohteet.indexOf(kohde);
    if (index === -1) {
      this.valitutKohteet.push(kohde);
    } else {
      this.valitutKohteet.splice(index, 1);
    }
  }

  onSubmit() {
    if (this.lomake.valid) {
      const currentUser = this.authService.getCurrUser();
      if (currentUser) {
        const updatedUser: any = {
          id: currentUser.id,
          firstName: this.lomake.value.etunimi,
          lastName: this.lomake.value.sukunimi,
          email: this.lomake.value.sahkoposti,
          password: currentUser.password,
          phoneNumber: this.lomake.value.puhelin,
          koulu: this.lomake.value.koulu,
          ala: this.lomake.value.ala,
          paikallisyhdistys: this.lomake.value.paikallisyhdistys,
          supporterMember: currentUser.supporterMember,
          supporterPayment: currentUser.supporterPayment,
        };

        this.authService.editUser(updatedUser);
        this.canEdit = false;
      } else {
        console.error('Käyttäjä ei löytynyt.');
      }
    } else {
      console.error('Tarkista lomake!');
    }
  }
}
