import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  username: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  async signup(): Promise<void> {
    try {
      await this.authService.signup(this.email, this.password, this.username);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.message;
    }
  }
}