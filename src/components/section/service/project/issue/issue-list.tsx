"use client";

import type { Issue } from "@/@types/service/issue";
import { IssueItem } from "./issue-item";

interface IssueListProps {
  issues: Issue[];
  onEditClick: (issue: Issue) => void;
  onDeleteClick: (issue: Issue) => void;
}

export function IssueList({ issues, onEditClick, onDeleteClick }: IssueListProps) {
  if (issues.length === 0) return null;

  return (
    <div className="divide-y divide-gray-100">
      {issues.map((issue) => (
        <IssueItem key={issue.name} issue={issue} onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
      ))}
    </div>
  );
}
