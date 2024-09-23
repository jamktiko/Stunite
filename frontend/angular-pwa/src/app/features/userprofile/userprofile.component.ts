// User can access this page after logging in successfully
import { Component } from '@angular/core';
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
export class UserprofileComponent {
  lomake: FormGroup;
  valitutKohteet: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Lomakkeen määrittely
    this.lomake = this.fb.group({
      nimi: [''],
      sahkoposti: [''],
      puhelin: [''],
      koulu: [''],
      ala: [''],
      paikallisyhdistys: [''],
      mielenkiinnonKohde: [''], // Uusi kenttä mielenkiinnon kohteelle
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  selectKohde(kohde: string) {
    const index = this.valitutKohteet.indexOf(kohde);
    if (index === -1) {
      this.valitutKohteet.push(kohde); // Lisää kohde taulukkoon
    } else {
      this.valitutKohteet.splice(index, 1); // Poista kohde taulukosta
    }
    console.log('Valitut mielenkiinnon kohteet:', this.valitutKohteet);
  }
  onSubmit() {
    if (this.lomake.valid) {
      console.log(this.lomake.value);
      alert(
        'Lomake lähetetty onnistuneesti! Valitsit mielenkiinnon kohteiksi: ' +
          this.valitutKohteet.join(', ')
      );
    } else {
      alert('Tarkista lomake!');
    }
  }
}
