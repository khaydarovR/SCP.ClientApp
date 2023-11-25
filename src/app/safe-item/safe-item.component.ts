import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RecordService} from "../services/record.service";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {Router} from "@angular/router";


@Component({
  selector: 'app-safe-item',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './safe-item.component.html',
  styleUrl: './safe-item.component.css'
})
export class SafeItemComponent implements OnInit{


  @Input() safe!: IGetLinkedSafeResponse;
  @Input() selectedSafeId!: string;
  isHome = false
  constructor(private recordService: RecordService, public router: Router) {
  }

  ngOnInit(): void {
  }

  onClickSettings(id: string) {
    this.router.navigate([`u-m/${id}`]);
  }
}
