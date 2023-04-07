import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

import { getCurrentUser } from './api/user'
import { getProjectProgress } from './api'
import { Issue } from './api/issue'
import { Project } from './api/project'

export default function Home({ currentUserName, projects }: { currentUserName: string, projects: Project[] }) {
  return (
    <>
      <Head>
        <title>Project Assistant</title>
        <meta name="description" content="Linear project assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
            {currentUserName}
        </div>
        {projects.map(project => (
          <div key={project.id}>
            <h2>{project.name}</h2>
            <ul>
              <li>Started at: {project.startedAt}</li>
              <li>Updated at: {project.updatedAt}</li>
              <li>Target date: {project.targetDate}</li>
              <li>Days Remaining: {project.businessDaysRemaining}</li>
              <li>Finished Issues: {project.finishedIssues}</li>
              <li>Remaining Issues: {project.remainingIssues}</li>
              <li>Completion: {project.completionPercentage}%</li>
              <li>Avg. Days Spent On A Task: {project.daysToFinishATask}</li>
              <li>Expected Finish Date: {project.expectedFinishDate}</li>
            </ul>
            <table className={styles.home}>
              <tr key="table-header">
                <th>Title</th>
                <th>Start date</th>
                <th>Completion date</th>
                <th>Days effort</th>
                <th>Assignee</th>
                <th>Status</th>
                <th>Creation date</th>
                <th>Elapsed days</th>
              </tr>
              {project.issues.sort((a: Issue, b: Issue) => a.status.localeCompare(b.status)).map(({
                id,
                title,
                startedAt,
                completedAt,
                createdAt,
                daysFromStartToCompletion,
                daysFromCreationToStart,
                assignedTo,
                description,
                status,
                daysFromCreation
              }: Issue) => <tr key={id} data-test-id={id}>
                  <td>{title}</td>
                  <td>{startedAt}</td>
                  <td>{completedAt}</td>
                  <td>{daysFromStartToCompletion}</td>
                  <td>{assignedTo}</td>
                  <td>{status}</td>
                  <td>{createdAt}</td>
                  <td>{daysFromCreation}</td>
                </tr>
              )}
            </table>
          </div>
        ))}
      </main>
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      currentUserName: (await getCurrentUser()).name,
      projects: await getProjectProgress("Ngage")
    }
  }

}