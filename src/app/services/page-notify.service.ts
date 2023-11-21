import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class PageNotifyService {
  private buffer: string[] = [];
  private isRunning = false;

  constructor(private _snackBar: MatSnackBar) {}

  error$ = new Subject<string>()

  public push(message: string){
    // If the buffer is empty, immediately display the message,
    // otherwise, add it to the buffer
    if (this.buffer.length === 0 && !this.isRunning) {
      this.showMessage(message);
      this.showMessages();
    } else {
      this.buffer.push(message);
    }
  }

  public pushMany(messages: string[]){
    for (const message of messages) {
      if (this.buffer.length === 0 && !this.isRunning) {
        this.showMessage(message);
        this.showMessages();
      } else {
        this.buffer.push(message);
      }
    }
  }

  private showMessages() {
    this.isRunning = true;

    // Show a message every two seconds
    let intervalId = setInterval(() => {

      // If there are no more messages to show, stop the interval
      if (this.buffer.length === 0) {
        clearInterval(intervalId);
        this.isRunning = false;
        return;
      }

      // Take the first message from the buffer
      let message = this.buffer.shift()!;
      this.showMessage(message);

    }, 2000);
  }

  private showMessage(message: string) {
    this.error$.next(message);

    // Show message
    let snackBarRef = this._snackBar.open(message, "OK", {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000
    });
  }
}


