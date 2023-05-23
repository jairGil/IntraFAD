import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public visible = false;
  public class = 'alert-success';
  public notification = 'Contenido de la notificación';
  private code = 200;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(
      (notification: any) => {
        this.visible = true;
        this.notification = notification.message;
        this.code = notification.code;

        switch (this.code) {
          case 200:
            this.class = 'alert-success';
            break;
          case 400:
            this.class = 'alert-warning';
            break;
          case 500:
            this.class = 'alert-danger';
            break;
        }

        setTimeout(() => {
          this.visible = false;
        }, 5000);
      }
    );
  }
}
