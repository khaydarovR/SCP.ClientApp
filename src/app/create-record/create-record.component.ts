import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-create-record',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './create-record.component.html',
  styleUrl: './create-record.component.css'
})

export class CreateRecordComponent implements OnInit {
  forSafe!: { id: string, title: string };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.forSafe = {
        id: params['id'],
        title: params['title']
      };
    });
  }
}
