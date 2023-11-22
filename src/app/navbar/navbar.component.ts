import { Component } from '@angular/core';
import { AuthService } from '../services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private authenticationSub!: Subscription;
  userAuthenticated = false;
  constructor(private authService: AuthService) {}

  ngOnDestroy(): void {
    this.authenticationSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userAuthenticated = this.authService.getIsAuthenticated();
    this.authenticationSub = this.authService
      .getAuthenticatedSub()
      .subscribe((status) => {
        this.userAuthenticated = status;
      });
  }

  logout() {
    this.authService.logout();
  }
}
