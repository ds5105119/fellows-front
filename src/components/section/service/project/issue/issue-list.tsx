"use client"

import type { Issue } from "@/@types/service/issue"
import { IssueItem } from "./issue-item"

interface IssueListProps {
  issues: Issue[]
  onEditClick: (issue: Issue) => void
  onDeleteClick: (issue: Issue) => void
  isValidating: boolean
}

export function IssueList({ issues, onEditClick, onDeleteClick, isValidating }: IssueListProps) {
  if (issues.length === 0) return null

  return (
    <div className="divide-y divide-gray-100">
      {issues.map((issue) => (
        <IssueItem key={issue.name} issue={issue} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
      ))}

      {isValidating && <div className="absolute inset-0 bg-white/50 pointer-events-none" />}
    </div>
  )
}
