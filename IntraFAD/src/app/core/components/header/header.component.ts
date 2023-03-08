import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', '../../../app.component.scss']
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
  ) { }

  isLogged(): boolean {
    return this.authService.loggedIn();
  }
  
  logout() {
    this.authService.logout();
    window.location.reload();
  }
}
