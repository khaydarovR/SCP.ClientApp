import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SafeItemComponent} from "../safe-item/safe-item.component";
import {SafeService} from "../services/safe.service";
import {RecordService} from "../services/record.service";

@Component({
  selector: 'app-safes',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SafeItemComponent],
  templateUrl: './safes.component.html',
  styleUrl: './safes.component.css'
})
export class SafesComponent {

  constructor(private recordService: RecordService) {
  }

  createRecord(){

    try {
      let res = this.recordService.createRecord(
          "title1",
          "log1",
          "pw1",
          "sec1",
          "res1",
          "39332870-484c-4c4a-899e-65446edf14a4"
      )
    }
    catch (e){
      console.log(e)
    }


  }
}
