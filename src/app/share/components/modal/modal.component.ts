import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {RequestsService} from "../../services/requests.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit{

  @Input() type: string = '';
  @Output() isClose:  EventEmitter<boolean> = new EventEmitter<boolean>();

  fb = inject(FormBuilder);
  requestService = inject(RequestsService);
  _snackBar = inject(MatSnackBar);

  isApplicationForm: boolean = true;
  isThanksPage: boolean = false;

  applicationForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern(/^\s*([А-Я][а-я]+\s*)+$/)]],
    phone: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(10)]]
  });

  constructor() {

  }


  closeModal(): void {
    this.isApplicationForm = false;
    this.isThanksPage = false;
    this.isClose.emit(true);

  }

  ngOnInit(): void {
    this.applicationForm.get('service')?.setValue(this.type);

  }

  sendApplicationForm(): void {
    if (this.applicationForm.valid &&
      this.applicationForm.value.service &&
      this.applicationForm.value.name &&
      this.applicationForm.value.phone) {
      this.requestService.consultationRequest(this.applicationForm.value.name, this.applicationForm.value.phone, this.applicationForm.value.service, 'order')
        .subscribe((data: DefaultResponseType) => {
          if (!data.error) {
            this.isApplicationForm = false;
            this.isThanksPage = true;
          }
          this._snackBar.open(data.message);
        });
    }

  }
}
