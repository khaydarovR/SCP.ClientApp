
import {Component, ElementRef, inject, OnInit, PipeTransform, ViewChild} from '@angular/core';
import {AsyncPipe, CommonModule, DecimalPipe} from '@angular/common';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';

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
import {UserSelectorComponent} from "./user-selector/user-selector.component";
import {IGetUserResponse} from "../remote/response/IGetUserResponse";
import {PermisionSelectorComponent} from "./permision-selector/permision-selector.component";
import {Permision} from "../services/permision.service";
import {MatButtonModule} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {ConfirmerComponent} from "../confirmer/confirmer.component";
import {SafeAccessService} from "../services/safe-access.service";
import {IInviteRequestDTO} from "../remote/dto/IInviteRequestDTO";
import {PageNotifyService} from "../services/page-notify.service";



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SafesComponent, MatInputModule, MatChipsModule, MatAutocompleteModule, MatIconModule, UserSelectorComponent, PermisionSelectorComponent, MatButtonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredSafes: Observable<IGetLinkedSafeResponse[]>;
  safes: IGetLinkedSafeResponse[] = [];
  allSafes: IGetLinkedSafeResponse[] = [];

  selectedUsers: IGetUserResponse[] = [];
  selectedPermissions: Permision[] = [];

  receiveSelectedUsers(data: IGetUserResponse[]) {
    this.selectedUsers = data;
    console.log(this.selectedUsers)
  }
  receiveSelectedPermissions(data: Permision[]) {
    this.selectedPermissions = data;
  }

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(private safeService: SafeService,
              public dialog: MatDialog,
              private safeAccessService: SafeAccessService,
              private notify: PageNotifyService) {
    this.filteredSafes = this.fruitCtrl.valueChanges.pipe(
      startWith<string | null>(''), // Используйте тип string | null
      map((value: string | null) => (value ? this._filter(value) : this.allSafes.slice())),
    );
  }
  //usage!!!
  dayLife: number = 30;
  remove(fruit: IGetLinkedSafeResponse): void {
    const index = this.safes.indexOf(fruit);

    if (index >= 0) {
      this.safes.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }
  add(event: MatChipInputEvent): void {

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
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

  openDialog(): void {
    let ref = this.dialog.open(ConfirmerComponent, {
      width: '250px',
    });

    ref.afterClosed().subscribe(result => {
      if (result === true){
        this.sendRequestToInvite()
      }
    });
  }

  private sendRequestToInvite() {
    this.safeAccessService.sendInviteRequest({
      dayLife: this.dayLife,
      safeIds: this.safes.map(s => s.id),
      userIds: this.selectedUsers.map(u => u.id),
      permisions: this.selectedPermissions.map(p => p.slug),
      userEmails: this.selectedUsers.map(u => u.email),
    } as IInviteRequestDTO).subscribe( {
      next: r => {
        this.notify.push('Разрешения успешно обновлены')
      },
      error: err => {this.notify.pushMany(err.error)}
    })
  }
}
