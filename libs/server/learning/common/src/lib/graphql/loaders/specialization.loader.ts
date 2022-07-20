/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';
import {  SpecializationService } from 'libs/server/learning/specialization/data-access/services/src';
import { Specialization  } from '@els/server/learning/specialization/data-access/entities';
export const createSpecializationsLoader = (specializationService: SpecializationService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct sectors

    const specializations: Specialization[] = await specializationService.getSpecializationsByIds([...ids]);
    const specializationsMap = new Map(specializations.map(specialization => [specialization.id, specialization]));
    return ids.map((id) => specializationsMap.get(id));
  });
};
