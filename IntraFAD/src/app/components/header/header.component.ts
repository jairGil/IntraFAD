import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../app.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) { }

  ngOnInit(): void {
  }

  isLogged(): boolean {
    return this.loginService.loggedIn();
  }
  
  logout() {
    this.loginService.logout();
    // window.location.reload();
  }
}
