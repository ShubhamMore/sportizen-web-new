import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactUsService } from './contact-us.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./../common-content.scss', './contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @ViewChild('formDirective') formDirective: FormGroupDirective;

  form: FormGroup;

  constructor(private contactUsService: ContactUsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required],
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      message: new FormControl(null, {
        validators: [Validators.required],
      }),
    });
  }

  scrollToElement(sectionId: any): void {
    document
      .querySelector(sectionId)
      .scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }

  sendMessage() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.contactUsService.sendEnquiry(this.form.value).subscribe(
        (res: any) => {
          this.formDirective.resetForm();
          this.form.reset();
          this.snackBar.open('Message Send Successfully!', null, {
            duration: 2000,
            panelClass: ['success-snackbar'],
          });
        },
        (error: any) => {
          this.formDirective.resetForm();
          this.form.reset();
          this.snackBar.open(error, null, {
            duration: 2000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    }
  }
}
