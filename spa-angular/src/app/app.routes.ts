import { Routes } from '@angular/router';
import { FakultasComponent } from './components/fakultas/fakultas.component';
import { ProdiComponent } from './components/prodi/prodi.component';
import { MahasiswaComponent } from './components/mahasiswa/mahasiswa.component';
import { HomeComponent } from './components/home/home.component';
import { AuthComponent } from './components/auth/auth.component';
import { AuthGuard } from './auth.guard'; // Import AuthGuard

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fakultas', component: FakultasComponent, canActivate: [AuthGuard] }, // Lindungi route dengan AuthGuard
  { path: 'prodi', component: ProdiComponent, canActivate: [AuthGuard] }, // Lindungi route dengan AuthGuard
  {
    path: 'mahasiswa',
    component: MahasiswaComponent,
    canActivate: [AuthGuard],
  }, // Lindungi route dengan AuthGuard
  { path: 'auth', component: AuthComponent },
  { path: '**', redirectTo: 'auth' }, // Redirect jika route tidak ditemukan
];
