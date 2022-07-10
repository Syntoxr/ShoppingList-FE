import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  authForm: FormGroup;

  constructor(private authService: AuthService, private store: Store) {}

  ngOnInit(): void {
    this.authService.autoLogin();

    this.authForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      remember: new FormControl(false),
    });
  }

  async onSubmit() {
    const username: string = this.authForm.controls['username'].value;
    const password: string = this.authForm.controls['password'].value;
    const remember: boolean = this.authForm.controls['remember'].value;

    this.authService.authenticate(username, password, remember);
  }
}
