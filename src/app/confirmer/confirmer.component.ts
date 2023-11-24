import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-confirmer',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatDialogClose],
  templateUrl: './confirmer.component.html',
  styleUrl: './confirmer.component.css'
})
export class ConfirmerComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmerComponent>) {}

}
