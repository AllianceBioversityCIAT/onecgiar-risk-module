import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}
  ngOnInit(): void {
    const user = this.userService.getLogedInUser();
    if (user) {
      this.router.navigate(['/initiatives']);
    }
  }
}
