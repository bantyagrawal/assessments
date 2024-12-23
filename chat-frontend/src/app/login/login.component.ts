import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from '../service/services.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private service: ServicesService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.service.login(this.loginForm.value).subscribe(
        {
          next: (result) => {
            localStorage.setItem('authToken', result.response);
            this.router.navigate(['']);
            alert(result.message);
          },
          error: (err) => {
            alert(err.error);
          }
        }
      );
    }
  }
}
