import { LearningTime, NewWord } from '@els/client/app/dashboard/ui';

/* eslint-disable-next-line */
export interface DashboardProps {}

export function Dashboard(
  props: DashboardProps
) {
  return (
    <div>
      <LearningTime></LearningTime>
      <NewWord></NewWord>
      <h1>Welcome to Dashboard!</h1>
    </div>
  );
}

export default Dashboard;
