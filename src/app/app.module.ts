import { OAuthModule } from 'angular-oauth2-oidc';
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";



@NgModule({
  imports: [
    OAuthModule.forRoot(),
],

})
export class AppModule {
}
