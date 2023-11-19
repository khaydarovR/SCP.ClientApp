import {Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IGetRecordResponse} from "../remote/response/GetRecordResponseю";

@Component({
  selector: 'app-record-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './record-item.component.html',
  styleUrl: './record-item.component.css'
})
export class RecordItemComponent {
  @Input() record!: IGetRecordResponse
}
