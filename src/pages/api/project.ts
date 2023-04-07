import { Team } from "@linear/sdk";
import { Issue } from "./issue";

export const getOngoingProjectsFromTeam = async (team: Team | undefined) => {
  if (!team) {
    return [];
  }
  const projects = await team.projects();
  return projects.nodes.filter(({ state }) => state === "started");
};

export interface Project {
  id: string,
  name: string,
  startedAt: string,
  updatedAt: string,
  targetDate: string,
  issues: Issue[],
  businessDaysRemaining: number,
  finishedIssues: number,
  remainingIssues: number,
  completionPercentage: number,
  daysToFinishATask: number,
  expectedFinishDate: string
}