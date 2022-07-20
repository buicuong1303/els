/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import { EnrollmentService } from '@els/server/learning/enrollment/data-access/services';
export const createEnrollmentsLoader = (enrollmentService: EnrollmentService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct enrollments
    const enrollments: Enrollment[] = await enrollmentService.getEnrollmentByIds([...ids]);

    const enrollmentsMap = new Map(enrollments.map(enrollment => [enrollment.id, enrollment]));
    return ids.map((id) => enrollmentsMap.get(id));
  });
};
