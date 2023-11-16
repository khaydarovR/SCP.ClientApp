import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class PageNotifyService {

  constructor(private _snackBar: MatSnackBar) { }

  error$ = new Subject<string>()

  public handle(message: string){
    this.error$.next(message)
    // Simple message.
    let snackBarRef = this._snackBar.open('Ошибка: ' + message, "Ok", {
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

}
