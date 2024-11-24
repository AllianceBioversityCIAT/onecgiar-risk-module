import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { ROLES_KEY } from './roles.decorator';
import { InitiativeService } from 'src/initiative/initiative.service';
import { RiskService } from 'src/risk/risk.service';

@Injectable()
export class RolesGuard implements CanActivate {
  dataSource: any;
  constructor(private reflector: Reflector,
     private initService: InitiativeService,
     private riskService: RiskService
     ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }
    const request  = context.switchToHttp().getRequest();
 

    const user: any =  request.user;

    if(user.role == Role.Admin) {
      return  true;
    }
    else if(user.role == Role.User){

      // 1) if the user have permission on this initiative

      const initiative_id: any = request.params.initiative_id || request.body.initiative_id || request.query.initiative_id;
      const risk_id: any = request.params.risk_id || request.body.risk_id;

      // console.log('params ==> ',request.params)
      // console.log('query ==> ',request.query)
      // console.log('body ==> ',request.body)


      const user_init_role: any = await this.initService.programRolesRepository.find({
        where : {
          user_id: user.id,
          program_id: initiative_id,
        }
      });

      // 1) if the user is risk owner
      const user_risk_role = await this.riskService.riskRepository.find({
        where : {
          id: risk_id,
          risk_owner: {
            user_id: user.id
          }
        }
      });

      if(user_init_role.length > 0) {
        if(user_init_role[0].role == 'Team Member' && (request.route.methods.put == true || request.route.methods.patch == true) && user_risk_role.length > 0) {
          // user is risk owner
          return true;
        }
        else if(user_init_role[0].role == 'Team Member' ) {
          return false;
        }
        return true;
      }
      else {
        return false;
      }
    }
}
}