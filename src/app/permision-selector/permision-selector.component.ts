import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {Permision, PermisionService} from "../services/permision.service";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {CdkDragDrop, CdkDropList, moveItemInArray} from "@angular/cdk/drag-drop";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule} from "@angular/material/list";
import {IGetUserResponse} from "../remote/response/IGetUserResponse";

@Component({
  selector: 'app-permision-selector',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, ReactiveFormsModule, MatIconModule, CdkDropList, MatChipsModule, MatListModule],
  templateUrl: './permision-selector.component.html',
  styleUrl: './permision-selector.component.css'
})
export class PermisionSelectorComponent implements OnInit{

  @Output() sendSelectedPerEvent = new EventEmitter<Permision[]>();

  _permisions!: Permision[]

  selectedPermisions: Permision[] = []


 constructor(private perSer: PermisionService, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.perSer.GetAllPermisions().subscribe({
      next: r =>{
          this._permisions = r
          console.log(this._permisions)
        }
    })
  }

  addToSelectedList(p: Permision) {
    this.add(p, this.selectedPermisions)
    this.remove(p, this._permisions);
    this.sendSelectedPerEvent.emit(this.selectedPermisions)
  }

  add(permission: Permision, items: Permision[]) {
    items.push(permission);
  }

  // Method to remove a permission
  remove(p: Permision, items: Permision[]) {
    const index = items.indexOf(p);
    if (index > -1) {
      items.splice(index, 1);
    }
  }

  // Method to find a permission
  find(permission: Permision) {
    return this.selectedPermisions.find(p => p === permission) || null;
  }


  removeFromSelectedList(p: Permision) {
    this.remove(p, this.selectedPermisions)
    this.add(p, this._permisions);
    this.sendSelectedPerEvent.emit(this.selectedPermisions)
  }
}
