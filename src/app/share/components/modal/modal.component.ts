import {Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit{

  @Input() type: string = '';
  @Output() isClose:  EventEmitter<boolean> = new EventEmitter<boolean>();

  fb = inject(FormBuilder);

  isApplicationForm: boolean = true;
  isThanksPage: boolean = false;

  applicationForm = this.fb.group({
    service: [''],
    name: ['', [Validators.required, Validators.pattern(/^([А-Я][а-я]{3,}) ([А-Я][а-я]{3,})$/)]],
    phone: ['', [Validators.required, Validators.maxLength(11)]]
  });

  constructor() {
    // this.type = '';
  }


  closeModal(): void {
    this.isApplicationForm = false;
    this.isThanksPage = false;
    this.isClose.emit(true);

  }

  ngOnInit(): void {
    this.applicationForm.get('service')?.setValue(this.type);
    console.log(this.type);
  }
}
