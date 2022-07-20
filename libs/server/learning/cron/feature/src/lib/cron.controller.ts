// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CronService } from '@els/server/learning/cron/data-access/services';
import { Controller, Post } from '@nestjs/common';

@Controller('cron')
export class CronController {
  constructor( private readonly _cronService: CronService ) {}

  @Post('/remind-practice-morning')
  handleRemindPracticeMorning(){
    this._cronService.handleRemindPracticeMorning();
  }

  @Post('/remind-practice-afternoon')
  handleRemindPracticeAfternoon(){
    this._cronService.handleRemindPracticeAfternoon();
  }

  @Post('/remind-practice-evening')
  handleRemindPracticeEvening(){
    this._cronService.handleRemindPracticeEvening();
  }

  @Post('/remind-practice-midnight')
  handleRemindPracticeMidnight(){
    this._cronService.handleRemindPracticeMidnight();
  }

  @Post('/assign-mission')
  handleAssignMission(){
    this._cronService.handleAssignMission();
  }

  @Post('/calc-memory-analysis')
  handleCalcMemoryAnalysis(){
    this._cronService.handleCalcMemoryAnalysis();
  }

  @Post('/inactivate-streak-list')
  handleInactivateStreakList(){
    this._cronService.handleInactivateStreakList();
  }

  @Post('/reset-exp-date')
  handleResetExpDate(){
    this._cronService.handleResetExpDate();
  }

  @Post('/reduce-level-actual-skill')
  handleReduceLevelActualSkill(){
    this._cronService.handleReduceLevelActualSkill();
  }

  @Post('/handle-update-rank')
  handleUpdateRank(){
    this._cronService.handleUpdateRank();
  }
}
