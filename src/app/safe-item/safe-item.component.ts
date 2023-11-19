import {Component, Input, EventEmitter, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecordService} from "../services/record.service";
import {SafeService} from "../services/safe.service";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";


@Component({
  selector: 'app-safe-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './safe-item.component.html',
  styleUrl: './safe-item.component.css'
})
export class SafeItemComponent{


  @Input() safe!: IGetLinkedSafeResponse;

  isSelected: boolean = false

  constructor(private recordService: RecordService) {
  }

}
