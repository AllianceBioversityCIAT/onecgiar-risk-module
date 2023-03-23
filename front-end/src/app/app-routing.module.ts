import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitiativeDetailsComponent } from './pages/initiative-details/initiative-details.component';
import { InitiativesComponent } from './pages/initiatives/initiatives.component';
import { RiskDashboardComponent } from './pages/risk-dashboard/risk-dashboard.component';
import { TeamMembersComponent } from './pages/team-members/team-members.component';
import { VersionDetailsComponent } from './pages/version-details/version-details.component';
import { VersionsDashboardComponent } from './pages/versions-dashboard/versions-dashboard.component';

const routes: Routes = [
  
  {
    path: 'risk-dashboard', 
    component: RiskDashboardComponent,
    children: [
      { 
        path: 'initiatives', 
        component: InitiativesComponent ,
        children: [
          {
            path: ':initiativeId',
            component: InitiativeDetailsComponent,
            children: [
              {
                path: 'team-members',
                component: TeamMembersComponent
              },
              {
                path: 'versions',
                component: VersionsDashboardComponent,
                children: [
                  {
                    path: ':versionId',
                    component: VersionDetailsComponent
                  },
                ]
              }
            ]
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
