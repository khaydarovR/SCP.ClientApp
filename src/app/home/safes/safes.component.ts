import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {SafeItemComponent} from "../../safe-item/safe-item.component";
import {SafeService} from "../../services/safe.service";
import {PageNotifyService} from "../../services/page-notify.service";
import {IGetLinkedSafeResponse} from "../../remote/response/IGetLinkedSafeResponse";
import {MSafeCreateComponent} from "../../m-safe-create/m-safe-create.component";
import {ICreateSafeDTO} from "../../remote/dto/ICreateSafeDTO";
import {MatDialog} from "@angular/material/dialog";
import {sample} from "rxjs";

@Component({
  selector: 'app-safes',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, SafeItemComponent],
  templateUrl: './safes.component.html',
  styleUrl: './safes.component.css'
})
export class SafesComponent implements OnInit{
  public safes = Array<IGetLinkedSafeResponse>()
  @Output() safeSelected = new EventEmitter<IGetLinkedSafeResponse>();

  selectedSafeName = ''
  selectedSafeId = ''

  safeForCreate = {
    title: '',
    dsc: ''
  }
  public isHome = false ;
  constructor(private dialog: MatDialog, private safeService: SafeService, private notify: PageNotifyService) {
  }


  addSafe(){
    this.openDialog()
  }

  onSafeSelected(safe: IGetLinkedSafeResponse) {
    this.safeSelected.emit(safe);  // Emit the event with selected safe
    this.selectedSafeName = safe.title
    this.selectedSafeId = safe.id
  }

  private openDialog(): void {
    const dialogRef = this.dialog.open(MSafeCreateComponent, {
      data: this.safeForCreate,
      disableClose: true,
      panelClass: 'rounded-4'
    }).addPanelClass('rounded-4');

    dialogRef.afterClosed().subscribe(result => {
      if (result === false){
        return
      }
      this.safeForCreate = result;
      this.sendRequestForCreate(this.safeForCreate)
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
        this.safeForCreate.title = ''
        this.safeForCreate.dsc = ''
        this.notify.push('Сейф успешно создан')
        this.ngOnInit()
      }
      else{
        this.notify.pushMany(r as string[])
      }
    })
  }


  //Load linked safes
  ngOnInit(): void {
    this.safeService.getLinkedSafes().subscribe({
      next: safesFromResponse => {
        for (let safe of safesFromResponse) {
          let tSafe = safe as IGetLinkedSafeResponse
          let safeExists = this.safes.some(s => s.id === tSafe.id);
          // If not, push the safe into the safes array
          if (!safeExists) {
            this.safes.push(tSafe);
          }
        }
      },
      error: error => {
        // handle your error
        console.error('There was an error!', error);
      }
    })

    this.isHome = location.pathname.includes("home")
  }

  protected readonly sample = sample;
}
