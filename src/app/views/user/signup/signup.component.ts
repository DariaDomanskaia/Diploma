import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  fb = inject(FormBuilder);

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-Я][а-я]{3,11}) ([А-Я][а-я]{3,11})$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });



  signup(): void {

  }
}
