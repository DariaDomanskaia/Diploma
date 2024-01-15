import {Component, DoCheck, EventEmitter, inject, Input, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() param: string = '';

  userService = inject(UserService);
  authService = inject(AuthService);
  router = inject(Router);
  _snackBar = inject(MatSnackBar);


  userName: string | null = null;
  isLogged: boolean = false;
  active: string = 'offer';

  constructor() {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  ngOnInit(): void {
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      this.getUserName();
    });

    this.getUserName();
  }

  getUserName(): void {
    this.userService.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        const userInfo = data as UserInfoType;
        if (userInfo && userInfo.name) {
          this.userName = userInfo.name.split(' ',)[0];
        }
      });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        }
      })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackBar.open('Выход из системы выполнен');
    this.router.navigate(['/']);
  }


  changeParam(value: string) {
    this.active = value;
  }

  scrollToElement($element: any): void {

    $element.scrollIntoView({behavior: "smooth", inline: "nearest"});
  }

}
