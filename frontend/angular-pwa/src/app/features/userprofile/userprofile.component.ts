import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';

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

  constructor(
    private authService: AuthService,
    private userService: UserService,
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
      mielenkiinnonKohde: [''], // Uusi kenttä mielenkiinnon kohteelle
    });
  }

  ngOnInit() {
    const userId = this.authService.getCurrUser()?.id;

    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (userData) => {
          console.log('Käyttäjän tiedot:', userData);
          this.lomake.patchValue({
            etunimi: userData.firstName,
            sukunimi: userData.lastName,
            sahkoposti: userData.email,
            puhelin: userData.phoneNumber,
            koulu: userData.koulu,
            ala: userData.ala,
            paikallisyhdistys: userData.paikallisyhdistys,
          });
        },
        (error) => {
          console.error('Virhe käyttäjän tietojen hakemisessa:', error);
        }
      );
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

  onSubmit() {
    if (this.lomake.valid) {
      const userId = this.authService.getCurrUser()?.id;
      this.userService.updateUserProfile(userId, this.lomake.value).subscribe(
        (response) => {
          console.log('Profiili päivitetty:', response);
          // Voit lisätä onnistumisen ilmoituksen täällä, esimerkiksi toastin
        },
        (error) => {
          console.error('Päivitys epäonnistui:', error);
          // Ei alertia, mutta voit tallentaa virheet johonkin
        }
      );
    } else {
      // Ei alertia, voit vain logata tai käsitellä virheen eri tavalla
      console.error('Tarkista lomake!');
    }
  }
}
