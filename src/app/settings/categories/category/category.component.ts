import { Component, Input, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/types';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.less'],
})
export class CategoryComponent implements OnInit {
  @Input() category: Category;

  constructor() {}

  ngOnInit(): void {}
}
