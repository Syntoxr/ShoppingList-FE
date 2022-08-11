import { Component, OnInit } from '@angular/core';
import { AvailableLangs, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.less'],
})
export class GeneralComponent implements OnInit {
  languageList: AvailableLangs = [];
  selectedLanguage = '...';

  constructor(public translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.languageList = this.translocoService.getAvailableLangs();
    this.selectedLanguage = this.translocoService.getActiveLang();
  }
}
