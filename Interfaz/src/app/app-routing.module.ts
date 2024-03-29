import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './home/guards/auth.guard';

const routes: Routes = [
  { path: 'auth', 
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
    // loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  { path: '**', redirectTo: 'auth/register' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
