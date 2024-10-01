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
    // Hae käyttäjän profiilitiedot palvelusta
    const userId = this.authService.getCurrUser()?.id; // Oletetaan, että käyttäjän ID on saatavilla
    if (userId) {
      this.userService.getUserProfile(userId); // Hae käyttäjän tiedot

      // Päivitetään lomake signaalista
      const userProfileSignal = this.userService.getUserProfileSignal();
      // Huomioi, että signaalin arvo on suoraan saatavilla
      this.lomake.patchValue({
        etunimi: userProfileSignal()?.firstName,
        sukunimi: userProfileSignal()?.lastName,
        sahkoposti: userProfileSignal()?.email,
        puhelin: userProfileSignal()?.phoneNumber,
        koulu: userProfileSignal()?.koulu,
        ala: userProfileSignal()?.ala,
        paikallisyhdistys: userProfileSignal()?.paikallisyhdistys,
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

  onSubmit() {
    if (this.lomake.valid) {
      const userId = this.authService.getCurrUser()?.id;
      this.userService.updateUserProfile(userId, this.lomake.value).subscribe(
        (response) => {
          console.log('Profiili päivitetty:', response);
          alert(
            'Lomake lähetetty onnistuneesti! Valitsit mielenkiinnon kohteiksi: ' +
              this.valitutKohteet.join(', ')
          );
        },
        (error) => {
          console.error('Päivitys epäonnistui:', error);
          alert('Päivitys epäonnistui!');
        }
      );
    } else {
      alert('Tarkista lomake!');
    }
  }
}
