import { ErrorHandler, NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { authInterceptorProviders } from './auth/token.interceptor';
import { ConfirmDeleteDialogComponent } from './components/dialog/confirm-delete-dialog/confirm-delete-dialog.component';
import { NeotopiaMapComponent } from './components/neotopia-map/neotopia-map.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { HomeComponent } from './pages/home/home.component';
import { MyTicketsComponent } from './pages/home/my-tickets/my-tickets.component';
import { TimetableComponent } from './pages/home/timetable/timetable.component';
import { TripPlannerComponent } from './pages/home/trip-planner/trip-planner.component';
import { LoginComponent } from './pages/login/login.component';
import { VerifyMailComponent } from './pages/verify-mail/verify-mail.component';
import { AuthErrorHandlerService } from './services/auth-error-handler.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UserProfileComponent,
    ConfirmDeleteDialogComponent,
    NeotopiaMapComponent,
    VerifyMailComponent,
    TripPlannerComponent,
    TimetableComponent,
    MyTicketsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [
    authInterceptorProviders,
    {
      provide: ErrorHandler,
      useClass: AuthErrorHandlerService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
