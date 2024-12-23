import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../service/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css']
})
export class OtpComponent {
  otpForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: ServicesService,
    private router: Router
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]]
    });
  }

  onSubmit() {
    if (this.otpForm.valid) {
      console.log('OTP Submitted:', this.otpForm.value.otp);
      this.service.verifyUser(this.otpForm.value.otp).subscribe({
        next: (res) => {
          this.router.navigateByUrl('login');
        },
        error: (err) => {
          alert(err.error);
        }
      })
    } else {
      console.error('Invalid OTP');
    }
  }
}
