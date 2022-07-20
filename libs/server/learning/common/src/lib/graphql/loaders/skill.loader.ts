/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';
import { SkillService } from 'libs/server/learning/skill/data-access/services/src';
import { Skill } from '@els/server/learning/skill/data-access/entities';
export const createSkillsLoader = (skillService: SkillService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct sectors
    const skills: Skill[] = await skillService.getSkillsByIds([...ids]);
    const skillsMap = new Map(skills.map(skill => [skill.id, skill]));
    return ids.map((id) => skillsMap.get(id));
  });
};
