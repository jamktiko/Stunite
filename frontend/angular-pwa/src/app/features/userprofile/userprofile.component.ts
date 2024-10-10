import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-userprofile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css'],
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
    // Lomakkeen määrittely
    this.lomake = this.fb.group({
      etunimi: [''],
      sukunimi: [''],
      sahkoposti: [''],
      puhelin: [''],
      koulu: [''],
      ala: [''],
      paikallisyhdistys: [''],
      mielenkiinnonKohde: [''],
    });
  }

  ngOnInit() {
    const currentUser = this.authService.getCurrUser();
    console.log('Current User:', currentUser);
    if (currentUser) {
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
      console.error('Ei löytynyt käyttäjätietoja.');
      this.router.navigate(['/login']);
    }
  }

  enableEdit() {
    this.canEdit = true;
  }

  cancelEdit() {
    this.canEdit = false;
    const currentUser = this.authService.getCurrUser();
    if (currentUser) {
      this.lomake.patchValue({
        etunimi: currentUser.firstName,
        sukunimi: currentUser.lastName,
        sahkoposti: currentUser.email,
        puhelin: currentUser.phoneNumber,
        koulu: currentUser.koulu,
        ala: currentUser.ala,
        paikallisyhdistys: currentUser.paikallisyhdistys,
      });
    }
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
    console.log('Valitut mielenkiinnon kohteet:', this.valitutKohteet);
  }

  // not yet working with backend
  onSubmit() {
    if (this.lomake.valid) {
      const userId = this.authService.getCurrUser()?.id;
      console.log('Päivitetään käyttäjätiedot:', this.lomake.value);
    } else {
      console.error('Tarkista lomake!');
    }
  }
}
