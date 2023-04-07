import { Issue as LinearIssue, Project } from "@linear/sdk"

const UNASSIGNED = "Unassigned"

const assigneeMap = new Map()

export const getIssueAssignee = async (issue: LinearIssue): Promise<string> => {

  // @ts-ignore
  if (!issue._assignee) {
    return UNASSIGNED
  }

  // @ts-ignore
  if (assigneeMap.has(issue._assignee.id)) {
    // @ts-ignore
    return assigneeMap.get(issue._assignee.id)
  }

  const assignee = await issue.assignee

  const assignedTo = assignee?.name

  // @ts-ignore
  assigneeMap.set(issue._assignee.id, assignedTo)

  return assignedTo || ""

}

export const fetchIssuesForProjects = async (projects: Project[]) => {
  const projectsWithIssues = [];

  for (let project of projects) {

    const projectWithResolvedDeps = {
      ...project,
      issues: <any>[]
    }
    
    const issues = (await project.issues()).nodes
    
    for (let issue of issues) {
      projectWithResolvedDeps.issues.push({
        ... issue,
        assignedTo: await getIssueAssignee(issue)
      })
    }

    projectsWithIssues.push(projectWithResolvedDeps);
  }

  return projectsWithIssues;
};

export interface Issue {
  id: string,
  title: string,
  startedAt: string,
  completedAt: string,
  canceledAt: string,
  createdAt: string,
  daysFromStartToCompletion: number,
  daysFromCreationToStart: number,
  assignedTo: string,
  description: string,
  status: string,
  daysFromCreation: number
}