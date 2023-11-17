import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  jwt?: string;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

  }

  logout() {
    this.authService.logout();
    window.location.reload();
  }

}
