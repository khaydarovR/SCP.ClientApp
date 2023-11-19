import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecordService} from "../services/record.service";

@Component({
  selector: 'app-safe-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './safe-item.component.html',
  styleUrl: './safe-item.component.css'
})
export class SafeItemComponent {

  constructor(private recordService: RecordService) {
  }
  readRecord() {
    this.recordService.readRecord('719a1e58-81ba-4f86-8b11-5944cda3f4dd').then(
      r => {
        console.log(r.eLogin)
        console.log(r.ePw)
        console.log(r.eSecret)
        console.log(r.forResource)
      }
    )
  }
}
