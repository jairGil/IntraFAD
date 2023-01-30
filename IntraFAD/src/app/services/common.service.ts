import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private subjectName = new Subject<any>(); 

  sendUpdate(data: any) { 
    this.subjectName.next({ datos: data });
  }

  getUpdate(): Observable<any> { 
    return this.subjectName.asObservable();
  }
  
  //constructor() { }
}
