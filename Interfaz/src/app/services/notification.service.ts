import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSource = new Subject();
  notification$ = this.notificationSource.asObservable();

  constructor() { }

  public showNotification(message: string, code: number) {
    this.notificationSource.next({message: message, code: code});
  }
}
