import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServicesService } from '../service/services.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm: FormGroup;
  users: any[] = [];
  filterUser: any[] = [];
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: ServicesService
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      mobile: ['', [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      address: ['', Validators.required],
      role: [''],
      teamLead: [null],
    });
    this.getUsers();
  }

  getUsers() {
    this.service.getUserList().subscribe({
      next: (res) => {
        this.users = res.response;
      },
      error: (err) => {
        alert(err.error);
      }
    })
  }
  onSubmit() {
    if (this.signupForm.valid) {
      this.service.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.service.sendOtp({ email: res.response.email }).subscribe({
            next: (res) => {
              this.router.navigateByUrl('otp');
              alert(res.message);
            }
          })
        },
        error: (err) => {
          alert(err.error);
        }
      })
    }
  }

  filterUsers() {
    const filerValue = this.signupForm.value.role;
    this.filterUser = this.users.filter(user => { 
      if (filerValue == 'Employee' ) {
        if (user.role == "Team leader"){
          return user;
        }
      } else if (filerValue == 'Team leader') {
        if (user.role == "Manager"){
          return user;
        }
      }
    })
  }
}
