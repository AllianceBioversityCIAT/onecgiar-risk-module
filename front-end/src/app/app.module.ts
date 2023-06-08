import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TeamMembersComponent } from './pages/team-members/team-members.component';
import { VersionsDashboardComponent } from './pages/versions-dashboard/versions-dashboard.component';
import {
  LoginDialog,
  NavbarComponent,
} from './components/navbar/navbar.component';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import {
  InitiativeDetailsComponent,
  PublishDialog,
} from './pages/initiative-details/initiative-details.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PublishDialogComponent } from './components/publish-dialog/publish-dialog.component';
import { NewRiskComponent } from './components/new-risk/new-risk.component';
import { NewTeamMemberComponent } from './components/new-team-member/new-team-member.component';
import { NewProposedComponent } from './components/new-proposed/new-proposed.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { VersionDetailsComponent } from './pages/version-details/version-details.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { ToastrModule } from 'ngx-toastr';
import { Safe } from './pipes/safe';
import { MatCardModule } from '@angular/material/card';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { RiskTableComponent } from './components/risk-table/risk-table.component';
import { SearchInitiativesComponent } from './components/search-initiatives/search-initiatives.component';
import { SearchRisksComponent } from './components/search-risks/search-risks.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { GeneralTabelComponent } from './components/general-tabel/general-tabel.component';
import { GeneralFormComponent } from './components/general-form/general-form.component';
import { UserFormComponent } from './pages/admin/users/user-form/user-form.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { CategoryFormComponent } from './pages/admin/categories/category-form/category-form.component';
import { HttpRequestInterceptor } from './services/http-request-interceptor';
import { SearchUsersComponent } from './pages/admin/users/search-users/search-users.component';
import { EmailsComponent } from './pages/admin/emails/emails.component';
import { EmailBodyDialogComponent } from './components/email-body-dialog/email-body-dialog.component';
import { AnnouncementComponent } from './pages/admin/announcement/announcement.component';
import { NgxEditorModule } from 'ngx-editor';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    TeamMembersComponent,
    VersionsDashboardComponent,
    NavbarComponent,
    InitiativesComponent,
    InitiativeDetailsComponent,
    PublishDialogComponent,
    NewRiskComponent,
    NewTeamMemberComponent,
    NewProposedComponent,
    VersionDetailsComponent,
    LoginDialog,
    ConfirmComponent,
    GeneralFormComponent,
    UserFormComponent,
    PublishDialog,
    Safe,
    RiskTableComponent,
    SearchInitiativesComponent,
    SearchRisksComponent,
    AdminComponent,
    UsersComponent,
    GeneralTabelComponent,
    CategoriesComponent,
    CategoryFormComponent,
    SearchUsersComponent,EmailsComponent,
    EmailBodyDialogComponent,
    AnnouncementComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BreadcrumbModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTooltipModule,
    HttpClientModule,
    FormsModule,
    MatCardModule,
    MatDividerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    NgxEditorModule,
    ToastrModule.forRoot(),
  ],
  providers: [BreadcrumbService, 
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
