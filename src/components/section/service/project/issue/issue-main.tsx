"use client";

import { useState } from "react";
import { createIssue, updateIssue, deleteIssue } from "@/hooks/fetch/issue";
import type { Issue, CreateIssueData, UpdateIssueData } from "@/@types/service/issue";
import IssueList from "@/components/section/service/project/issue/issue-list";
import IssueForm from "@/components/section/service/project/issue/issue-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function IssuesPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshList, setRefreshList] = useState<(() => void) | null>(null);

  const handleCreateClick = () => {
    setSelectedIssue(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = async (data: CreateIssueData | UpdateIssueData) => {
    setIsSubmitting(true);
    try {
      if (selectedIssue) {
        await updateIssue(selectedIssue.name, data as UpdateIssueData);
      } else {
        await createIssue(data as CreateIssueData);
      }
      refreshList?.();
      setIsFormOpen(false);
    } catch {
      toast(selectedIssue ? "이슈 수정에 실패했습니다." : "이슈 등록에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedIssue) return;

    setIsSubmitting(true);
    try {
      await deleteIssue(selectedIssue.name);
      refreshList?.();
      setIsDeleteDialogOpen(false);
    } catch {
      toast("이슈 삭제에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <IssueList onCreateClick={handleCreateClick} onEditClick={handleEditClick} onDeleteClick={handleDeleteClick} onRefreshReady={setRefreshList} />

      <IssueForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleFormSubmit} issue={selectedIssue} isLoading={isSubmitting} />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>이슈 삭제</DialogTitle>
            <DialogDescription>정말로 이 이슈를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              <strong>제목:</strong> {selectedIssue?.subject}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting} className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-0">
              취소
            </Button>
            <Button onClick={handleDeleteConfirm} disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 text-white border-0">
              {isSubmitting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
