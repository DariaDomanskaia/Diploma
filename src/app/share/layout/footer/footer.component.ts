import {Component, inject} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {RequestsService} from "../../sarvices/requests.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  fb = inject(FormBuilder);
  requestService = inject(RequestsService);
  _snackBar = inject(MatSnackBar);

  isConsultationForm: boolean = false;
  isThanksPage: boolean = false;
  consultationForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^([А-Я][а-я]{3,}) ([А-Я][а-я]{3,})$/)]],
    phone: ['', [Validators.required, Validators.maxLength(11)]]
  });


  sendConsultationForm(): void {
    if (this.consultationForm.valid &&
      this.consultationForm.value.name &&
      this.consultationForm.value.phone){
      this.requestService.consultationRequest(this.consultationForm.value.name, this.consultationForm.value.phone, 'null', 'consultation')
        .subscribe((data: DefaultResponseType) => {
          if (!data.error) {
            this.isConsultationForm = false;
            this.isThanksPage = true;
          }
          this._snackBar.open(data.message);
        });
    }

  }

  showModal():void {
    this.isConsultationForm = true;
  }

  closeModal(): void {
    this.isConsultationForm = false;
    this.isThanksPage = false;
  }

}
