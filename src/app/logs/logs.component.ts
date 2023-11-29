import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RecordService} from "../services/record.service";
import {IRLogsResponse} from "../remote/response/IRLogsResponse";
import {ActivatedRoute} from "@angular/router";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {RecordItemComponent} from "../record-item/record-item.component";

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, RecordItemComponent],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.css'
})
export class LogsComponent implements OnInit{
  _logs: IRLogsResponse[] = []
  _currentRecId = ""
  constructor(private recSer: RecordService, private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._currentRecId = params['rid']
    });

    this.recSer.getLogs(this._currentRecId).subscribe({
      next: r => {
        this._logs = r.sort((a, b) => {
          if (a.at > b.at) {
            return -1;
          } else if (a.at < b.at) {
            return 1;
          } else {
            return 0;
          }
        });
      },
      error: e => {
        console.log(e.error);
      }
    })
  }

}
