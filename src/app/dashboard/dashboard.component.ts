
import {Component, ElementRef, inject, OnInit, PipeTransform, ViewChild} from '@angular/core';
import {AsyncPipe, CommonModule, DecimalPipe} from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { map, startWith } from 'rxjs/operators';
import {SafesComponent} from "../home/safes/safes.component";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {SafeService} from "../services/safe.service";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {Observable} from "rxjs";
import {UserSelectorComponent} from "../user-selector/user-selector.component";



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SafesComponent, MatInputModule, MatChipsModule, MatAutocompleteModule, MatIconModule, UserSelectorComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredSafes: Observable<IGetLinkedSafeResponse[]>;
  safes: IGetLinkedSafeResponse[] = [];
  allSafes: IGetLinkedSafeResponse[] = [];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private safeService: SafeService) {
    this.filteredSafes = this.fruitCtrl.valueChanges.pipe(
      startWith<string | null>(''), // Используйте тип string | null
      map((value: string | null) => (value ? this._filter(value) : this.allSafes.slice())),
    );
  }

  add(event: MatChipInputEvent): void {

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: IGetLinkedSafeResponse): void {
    const index = this.safes.indexOf(fruit);

    if (index >= 0) {
      this.safes.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.safes.push(
      {
        description: event.option.value.description,
        id: event.option.value.id,
        title: event.option.value.title
      });
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    console.log(this.safes)
  }

  private _filter(value: string): IGetLinkedSafeResponse[] {
    return this.allSafes.filter(s => s.title.toLowerCase().includes(value));
  }

  ngOnInit(): void {
    this.safeService.getLinkedSafes().subscribe({
      next: res => {
        this.allSafes = res as IGetLinkedSafeResponse[]

      }
    })
  }
}
