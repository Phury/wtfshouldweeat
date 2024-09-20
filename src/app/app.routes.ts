import { Routes } from '@angular/router';
import {InputPage} from "./atomic/pages/input-page/input.page";
import {DetailPage} from "./atomic/pages/detail/detail.page";

export const routes: Routes = [
  //{ path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: InputPage },
  { path: ':type/:id', component: DetailPage }
]
