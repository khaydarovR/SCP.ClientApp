import { OAuthModule } from 'angular-oauth2-oidc';
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import { ImportExcelComponent } from './import-excel/import-excel.component';


@NgModule({
  declarations: [
    ImportExcelComponent,
  ],
  imports: [
    OAuthModule.forRoot()
  ],
  exports: [
    NgModule,
    ImportExcelComponent
  ]

})
export class AppModule {
}
