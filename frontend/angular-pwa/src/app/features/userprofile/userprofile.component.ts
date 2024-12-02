import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NotificationService } from '../../core/services/notification.service';

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

  user$: Observable<any> = new Observable();
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
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
    this.user$ = this.authService.getCurrUserObser();
    this.loadUserData();
  }

  loadUserData() {
    this.authService.fetchCurrUser().subscribe({
      next: (user) => {
        if (user) {
          this.lomake.patchValue({
            etunimi: user.firstName,
            sukunimi: user.lastName,
            sahkoposti: user.email,
            puhelin: user.phoneNumber,
            koulu: user.koulu,
            ala: user.ala,
            paikallisyhdistys: user.paikallisyhdistys,
          });
          console.log('User data loaded');
        } else {
          console.error('User data not found.');
        }
      },
      error: (err) => {
        console.error('Failed to load user data:', err);
      },
    });
  }

  enableEdit() {
    this.canEdit = true;
  }

  cancelEdit() {
    this.canEdit = false;
    this.loadUserData();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
    this.onLogout();
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
      this.authService.fetchCurrUser().subscribe({
        next: (currentUser) => {
          if (currentUser) {
            const updatedUser: any = {
              id: currentUser.id,
              firstName: this.lomake.value.etunimi,
              lastName: this.lomake.value.sukunimi,
              email: this.lomake.value.sahkoposti,
              phoneNumber: this.lomake.value.puhelin,
              koulu: this.lomake.value.koulu,
              ala: this.lomake.value.ala,
              paikallisyhdistys: this.lomake.value.paikallisyhdistys,
            };

            // edit user
            this.authService.editUser(updatedUser).subscribe({
              next: (updatedUserFromBackend) => {
                this.lomake.patchValue({
                  etunimi: updatedUserFromBackend.firstName,
                  sukunimi: updatedUserFromBackend.lastName,
                  sahkoposti: updatedUserFromBackend.email,
                  puhelin: updatedUserFromBackend.phoneNumber,
                  koulu: updatedUserFromBackend.koulu,
                  ala: updatedUserFromBackend.ala,
                  paikallisyhdistys: updatedUserFromBackend.paikallisyhdistys,
                });

                this.authService.updateCurrUser(updatedUserFromBackend);

                this.canEdit = false;
                this.loadUserData();
                console.log('Käyttäjän tiedot päivitetty onnistuneesti!');
                this.onEditSuccess();
              },
              error: (err) => {
                console.error('Päivitys epäonnistui:', err);
              },
            });
          } else {
            console.error('Käyttäjä ei löytynyt.');
          }
        },
        error: (err) => {
          console.error('Käyttäjän haku epäonnistui:', err);
        },
      });
    } else {
      console.error('Lomake ei ole kelvollinen!');
    }
  }
  onEditSuccess() {
    this.notificationService.showSuccess(
      'Käyttäjätietojen muokkaus onnistui.',
      ''
    );
  }

  onLogout() {
    this.notificationService.showInfo('Uloskirjauduttu', '');
  }
}
