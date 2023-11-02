import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { MyTicketsComponent } from './pages/home/my-tickets/my-tickets.component';
import { TimetableComponent } from './pages/home/timetable/timetable.component';
import { TripPlannerComponent } from './pages/home/trip-planner/trip-planner.component';
import { LoginComponent } from './pages/login/login.component';
import { VerifyMailComponent } from './pages/verify-mail/verify-mail.component';
import { AuthGuard } from './services/user.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/trip-planner', pathMatch: 'full' },
      { path: 'trip-planner', component: TripPlannerComponent },
      { path: 'map', component: TimetableComponent },
      { path: 'my-tickets', component: MyTicketsComponent }
    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'verify-mail', component: VerifyMailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
