import {Component, ElementRef, EventEmitter, inject, OnInit, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IGetUserResponse} from "../../remote/response/IGetUserResponse";
import {SafeAccessService} from "../../services/safe-access.service";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {MatChipInputEvent, MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {Observable} from "rxjs";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {map, startWith} from "rxjs/operators";
import {MatIconModule} from "@angular/material/icon";



@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatChipsModule, MatFormFieldModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './user-selector.component.html',
  styleUrl: './user-selector.component.css'
})
export class UserSelectorComponent implements OnInit {
  constructor(private saService: SafeAccessService) {
    this.filteredUsers = this.fruitCtrl.valueChanges.pipe(
      startWith<string | null>(''), // Используйте тип string | null
      map((value: string | null) => (value ? this._filter(value) : this.allUsers.slice())),
    );
  }
  @Output() sendSelectedUsersEvent = new EventEmitter<IGetUserResponse[]>();

  ngOnInit(): void {
    this.saService.GetLinkedUsers().subscribe({
      next: r => this.allUsers = r,
      error: e => console.log(e)
    })
  }


  outputUsers: IGetUserResponse[] = []
  sendOutputUsers() {
    this.outputUsers = structuredClone(this.users)
    this.sendSelectedUsersEvent.emit(this.outputUsers);
  }


  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredUsers: Observable<IGetUserResponse[]>;
  users: IGetUserResponse[] = [];
  allUsers: IGetUserResponse[] = [];

  @ViewChild('fruitInput') fruitInput!: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);


  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.users.push({id: "", userName: "", email: event.value});
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);
    this.sendOutputUsers()
  }

  remove(u: IGetUserResponse): void {
    const index = this.users.indexOf(u);

    if (index >= 0) {
      this.users.splice(index, 1);

      this.announcer.announce(`Removed ${u}`);
    }
    this.sendOutputUsers()
  }

  selected(event: MatAutocompleteSelectedEvent): void {

    this.users.push(
      {
        email: event.option.value.email,
        id: event.option.value.id,
        userName: event.option.value.userName
      });
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);

    this.sendOutputUsers()
  }

  private _filter(value: string): IGetUserResponse[] {
    return this.allUsers.filter(s => s.email.toLowerCase().includes(value));
  }

}
