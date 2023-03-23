import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  bredcrumbs: any[] = [
    {label: 'home', path: '/'},
    {label: 'id', path: '/'},
    {label: 'pag', path: '/'},
  ]
}
