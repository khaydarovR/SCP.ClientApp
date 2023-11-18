import {Component, Inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA, MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {HomeComponent} from "../home/home.component";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";

export interface DialogData {
  title: string;
  dsc: string;
}

@Component({
  selector: 'app-m-safe-create',
  standalone: true,
  imports: [CommonModule, MatInputModule, FormsModule, MatDialogClose, MatDialogContent, MatDialogTitle, MatDialogActions, MatButtonModule, MatListModule],
  templateUrl: './m-safe-create.component.html',
  styleUrl: './m-safe-create.component.css'
})
export class MSafeCreateComponent {

  constructor(
    public dialogRef: MatDialogRef<HomeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}


  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

}
