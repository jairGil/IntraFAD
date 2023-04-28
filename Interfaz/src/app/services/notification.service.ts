import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSource = new Subject();
  notification$ = this.notificationSource.asObservable();

  constructor() { }

  showNotification(notification: string, classType: string) {
    this.notificationSource.next({notification, classType});
  }
}
