import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  templateUrl: 'faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FAQsComponent implements OnInit{

  constructor(
    public titleService: Title
  ) { }

  ngOnInit(){
    this.titleService.setTitle('Frequently Asked Questions and Helps');
  }
}
