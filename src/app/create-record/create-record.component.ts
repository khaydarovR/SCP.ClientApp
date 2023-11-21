import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router} from "@angular/router";
import {RecordService} from "../services/record.service";
import {FormsModule} from "@angular/forms";
import {PageNotifyService} from "../services/page-notify.service";

@Component({
  selector: 'app-create-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-record.component.html',
  styleUrl: './create-record.component.css'
})

export class CreateRecordComponent implements OnInit {
  forSafe!: { id: string, title: string };

  title = ''
  login = ''
  pw = ''
  secret = ''
  forResource = ''

  constructor(private route: ActivatedRoute,
              private recordService: RecordService,
              private notify: PageNotifyService,
              private router: Router) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.forSafe = {
        id: params['id'],
        title: params['title']
      };
    });
  }

  onCreateRec(){
    this.recordService.createRecord(
      this.title,
      this.login,
      this.pw,
      this.secret,
      this.forResource,
      this.forSafe.id
    ).then( r => {
        if(r === true){
          this.notify.push('Успешно')
          this.router.navigate(['home'])
        }
        else {
          this.notify.push('Ошибка: проверьте правильность заполенния полей')
        }

        if (Array.isArray(r)){
          this.notify.pushMany(r)
        }
      }
    ).catch( e => {
        this.notify.push('Ошибка: ' + e.message)
      }

    )
  }
}
