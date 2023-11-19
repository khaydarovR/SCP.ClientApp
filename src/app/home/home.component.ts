import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/auth.service";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {SafeItemComponent} from "../safe-item/safe-item.component";
import {SafeService} from "../services/safe.service";
import {MatDialog} from "@angular/material/dialog";
import {MSafeCreateComponent} from "../m-safe-create/m-safe-create.component";
import {ICreateSafeDTO} from "../remote/dto/ICreateSafeDTO";
import {PageNotifyService} from "../services/page-notify.service";
import {SafesComponent} from "../safes/safes.component";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [CommonModule, MatGridListModule, MatCardModule, MatIconModule, MatButtonModule, SafeItemComponent, SafesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  public safe = {
    title: '',
    dsc: '',
  }

  constructor(public dialog: MatDialog,
              private safeService: SafeService,
              private notify: PageNotifyService) { }

  ngOnInit(): void {

  }

  addSafe(){
    this.openDialog()
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(MSafeCreateComponent, {
      data: this.safe,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === false){
        return
      }
      this.safe = result;
      this.sendRequestForCreate(this.safe)
    });
  }

  private sendRequestForCreate(safe: {title: string, dsc: string}) {
    let dto: ICreateSafeDTO =  {
      description: safe.dsc,
      title: safe.title
    }
    let result = this.safeService.createSafe(dto)

    result.subscribe( r =>{
      if (r === true){
        this.safe.title = ''
        this.safe.dsc = ''
        this.notify.push('Сейф успешно создан')
      }
      else{
        this.notify.pushMany(r as string[])
      }
    })
  }

}
