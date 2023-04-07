import { today, dateDiff, daysUntil, yyyyMMDD, dateAdd } from "./date-utils.js";

import { IN_PROGRESS, FINISHED, NOT_STARTED } from "./statuses.ts";
import { getCurrentUserTeamByName } from "./user.ts";
import { getOngoingProjectsFromTeam } from "./project.ts";
import { fetchIssuesForProjects } from "./issue.ts";

export const getProjectProgress = async (teamName: string) => {

  const currentUserTeam = await getCurrentUserTeamByName(teamName);

  const ongoingProjects = await getOngoingProjectsFromTeam(currentUserTeam);
  const ongoingProjectsWithIssues = await fetchIssuesForProjects(ongoingProjects);

  const progress = ongoingProjectsWithIssues.map(
    ({ id, name, startedAt, updatedAt, targetDate, issues }) => {
      const issuesProgress = issues.map(
        ({
          id,
          startedAt,
          assignedTo,
          completedAt,
          canceledAt,
          createdAt,
          description,
          title,
        }) => ({
          id,
          title,
          startedAt: yyyyMMDD(startedAt) || null,
          completedAt: yyyyMMDD(completedAt) || null,
          canceledAt: yyyyMMDD(canceledAt) || null,
          createdAt: yyyyMMDD(createdAt),
          daysFromStartToCompletion: completedAt ? dateDiff(startedAt, completedAt) : dateDiff(startedAt, today()) || null,
          daysFromCreationToStart: dateDiff(createdAt, startedAt) || null,
          assignedTo,
          description: description || "",
          status: completedAt ? FINISHED : startedAt ? IN_PROGRESS : NOT_STARTED,
          daysFromCreation: dateDiff(createdAt, today())
        })
      );

      const finishedIssues = issuesProgress.filter(issue => issue.completedAt).reduce((finishedIssueCount) => (
        finishedIssueCount + 1
      ), 0)

      const remainingIssues = issuesProgress.filter(issue => !issue.completedAt).reduce((remainingIssueCount) => (
        remainingIssueCount + 1
      ), 0)

      const completionPercentage = Math.round(finishedIssues / (finishedIssues + remainingIssues) * 100)

      const daysToFinishATask = finishedIssues / dateDiff(startedAt, today())

      const progress = {
        id,
        name,
        startedAt: yyyyMMDD(startedAt),
        updatedAt: yyyyMMDD(updatedAt),
        targetDate: yyyyMMDD(targetDate),
        issues: issuesProgress,
        businessDaysRemaining: daysUntil(targetDate),
        finishedIssues,
        remainingIssues,
        completionPercentage,
        daysToFinishATask,
        expectedFinishDate: dateAdd(today(), remainingIssues / daysToFinishATask)
      };

      return progress;
    }
  );

  return progress

}

export interface Project {
  id: string,
  name: string,
  startedAt: string,
  updatedAt: string,
  targetDate: string,
  // issues: issuesProgress,
  businessDaysRemaining: number,
  finishedIssues: number,
  remainingIssues: number,
  completionPercentage: number,
  daysToFinishATask: number,
  expectedFinishDate: string
}