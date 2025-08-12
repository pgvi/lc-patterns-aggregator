import { Component } from '@angular/core';
import { Toolbar } from './shared/container/toolbar';
import { ProblemsList } from './aggregator/container/problems-list';
import { ProblemsFilter } from './aggregator/container/problems-filter';

@Component({
  selector: 'app-root',
  imports: [Toolbar, ProblemsList, ProblemsFilter],
  templateUrl: 'app.html',
})
export class App {}
