import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/types';
import * as iconListData from 'src/assets/icons/category-icon-list.json';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.less'],
})
export class NewCategoryComponent implements OnInit {
  iconList = (iconListData as any).default;
  sampleCategory: Category = {
    name: 'test',
    color: this.getRandomColor(),
    icon: 'dots-horizontal.svg',
    id: 42,
  };

  constructor() {}

  ngOnInit(): void {}

  onIconSelect(icon: string) {
    this.sampleCategory.icon = icon;
  }

  getRandomColor() {
    var letters = '3456789ABCD';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 11)];
    }
    return color;
  }
}
