"use client"

import type { Issue } from "@/@types/service/issue"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface IssueDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  issue: Issue | null
  isLoading: boolean
}

export function IssueDeleteDialog({ isOpen, onClose, onConfirm, issue, isLoading }: IssueDeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이슈 삭제</DialogTitle>
          <DialogDescription>정말로 이 이슈를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-600">
            <strong>제목:</strong> {issue?.subject}
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onClose} disabled={isLoading} variant="outline">
            취소
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} variant="destructive">
            {isLoading ? "삭제 중..." : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
