import { Component, OnInit } from '@angular/core';
import moment from 'moment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  currentYear!: number;

  ngOnInit() {
    this.currentYear = moment().year();
  }
}
