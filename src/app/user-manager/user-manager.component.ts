import {Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatButtonModule} from "@angular/material/button";
import {MatChipsModule} from "@angular/material/chips";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {PermisionSelectorComponent} from "../dashboard/permision-selector/permision-selector.component";
import {UserSelectorComponent} from "../dashboard/user-selector/user-selector.component";
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {IGetUserResponse} from "../remote/response/IGetUserResponse";
import {SafeService} from "../services/safe.service";
import {SafeAccessService} from "../services/safe-access.service";
import {MatSelectModule} from "@angular/material/select";
import {IGetLinkedSafeResponse} from "../remote/response/IGetLinkedSafeResponse";
import {Permision, PermisionService} from "../services/permision.service";
import {MatListModule} from "@angular/material/list";
import {PageNotifyService} from "../services/page-notify.service";
import {ISafeStatResponse} from "../remote/response/ISafeStatResponse";


@Component({
  selector: 'app-user-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, MatAutocompleteModule, MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, PermisionSelectorComponent, ReactiveFormsModule, UserSelectorComponent, MatSelectModule, MatListModule],
  templateUrl: './user-manager.component.html',
  styleUrl: './user-manager.component.css'
})
export class UserManagerComponent implements OnInit{
  _selectedUser?: IGetUserResponse;
  constructor(private route: ActivatedRoute,
              private saService: SafeAccessService,
              private  safeSer: SafeService,
              private perSer: PermisionService,
              private notify: PageNotifyService) {
  }
  _safeStat?: ISafeStatResponse
  _selectedSafeId: string = ''
  _searchUserText: string = ''
  _dayLife: number = 30;
  filteredUsers: IGetUserResponse[] = [];
  allUsers: IGetUserResponse[] = [];
  _safes: IGetLinkedSafeResponse[] = []

  set selectedSafeId(val: string){
    this._selectedSafeId = val
    this.laodDataForUI()
  }
  get selectedSafeId():string{
    return this._selectedSafeId;
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.selectedSafeId = params['id']
    });
  }


  public set searchUserText(val: string){
    this._searchUserText = val
    this.filterUsers(this.searchUserText)
  }
  public get searchUserText(){
    return this._searchUserText
  }


  private laodDataForUI() {
    this.saService.GetLinkedUsers().subscribe({
      next: r => {
        this.allUsers = r
        this.filteredUsers = r
      },
    })
    this.safeSer.getLinkedSafes().subscribe({
      next: r =>{
        this._safes = r as IGetLinkedSafeResponse[]
        this._selectedSafeId = this._safes.find(s => s.id == this.selectedSafeId)!.id
      }
    })
    this.safeSer.getStatForSafe(this.selectedSafeId).subscribe({
      next: r => {
        this._safeStat = r
      },
      error: e => console.log(e)
    })
  }

  private filterUsers(searchUserText: string) {
    this.filteredUsers = this.allUsers.filter(u => {
      return u.email.toLowerCase().includes(searchUserText.toLowerCase())
        || u.userName.toLowerCase().includes(searchUserText.toLowerCase());
    })
  }

  userPermissions: Permision[] = []
  @ViewChild('permisionSelector', { static: false }) permisionSelector!: PermisionSelectorComponent;
  sendSelectedPer() {
    this.permisionSelector.updateData(this.userPermissions);
  }
  onSelectUser(id: string) {
    this._selectedUser = this.allUsers.find(u => u.id == id)
    this.perSer.getPerForUser(this.selectedSafeId, this._selectedUser!.id).subscribe({
      next: r => {
        this.userPermissions = r
        this.sendSelectedPer()
      }
    })
  }

  onPatchPermissionsInSafe() {
    if (this._selectedUser == null){
      this.notify.push('Выбирите пользователя!')
      return
    }

    this.saService.patchPermissionsInSafe({
      safeId: this.selectedSafeId,
      userId: this._selectedUser?.id,
      permissionSlags: this.userPermissions.map(p => p.slug),
      dayLife: this._dayLife
    }).subscribe({
      next: r => {
        this.notify.push('Успешно')
      },
      error: e => {
        this.notify.pushMany(e.error)
      }
    })
  }

  getSelectedPer($event: Permision[]) {
    console.log($event)
    this.userPermissions = $event
  }

  justInvite() {
    this.perSer.justInvite(this._selectedSafeId, this._searchUserText).subscribe({
        next: r => {
          this.notify.push(r)
        },
        error: e => {
          console.log(e)
          this.notify.push(e.error)
        }
    })
  }
}
