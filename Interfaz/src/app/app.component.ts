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

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.notificationService.notification$.subscribe(
      (notification: any) => {
        this.visible = true;
        this.notification = notification.notification;
        this.class = notification.classType;

        setTimeout(() => {
          this.visible = false;
        }, 5000);
      }
    );
  }
}
