"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Issue, type CreateIssueData, type UpdateIssueData, CreateIssueSchema } from "@/@types/service/issue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Check, ChevronDownIcon, Loader2 } from "lucide-react";
import { useProjectOverView } from "@/hooks/fetch/project";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Session } from "next-auth";

interface IssueFormProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIssueData | UpdateIssueData) => Promise<void>;
  issue?: Issue | null;
  isLoading?: boolean;
}

export function IssueForm({ session, isOpen, onClose, onSubmit, issue, isLoading = false }: IssueFormProps) {
  const isEdit = !!issue;

  const projectsOverview = useProjectOverView();
  const overviewProjects = projectsOverview?.data?.items || [];

  const form = useForm<CreateIssueData>({
    resolver: zodResolver(CreateIssueSchema),
    defaultValues: {
      subject: issue?.subject || "",
      priority: issue?.priority || "",
      issue_type: issue?.issue_type || undefined,
      description: issue?.description || "",
      project: issue?.project || "",
    },
    mode: "onTouched",
  });

  const handleSubmit = async (data: CreateIssueData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Failed to submit issue:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "이슈 수정" : "새 이슈 등록"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>제목 *</FormLabel>
                    <FormControl>
                      <Input placeholder="이슈 제목을 입력하세요" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="issue_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>타입 *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="타입 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Design">디자인</SelectItem>
                          <SelectItem value="Feature">기능</SelectItem>
                          <SelectItem value="ETC">기타</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>우선순위</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="우선순위 선택" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="High">높음</SelectItem>
                          <SelectItem value="Medium">보통</SelectItem>
                          <SelectItem value="Log">낮음</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="project"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>프로젝트 *</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline" role="combobox" className={cn("w-[200px] justify-between", !field.value && "text-muted-foreground")}>
                              {field.value ? overviewProjects.find((p) => p.project_name === field.value)?.custom_project_title : "프로젝트를 선택하세요"}
                              <ChevronDownIcon className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="프로젝트 검색..." className="h-9" />
                            <CommandList>
                              <CommandEmpty>
                                문의할 프로젝트를
                                <br />
                                찾을 수 없어요
                              </CommandEmpty>
                              <CommandGroup>
                                {overviewProjects
                                  .filter((project) => project.custom_team.filter((member) => member.member == session.sub).some((member) => member.level < 3))
                                  .filter((project) => project.custom_project_status !== "draft")
                                  .map((p) => (
                                    <CommandItem
                                      value={p.project_name}
                                      key={p.project_name}
                                      onSelect={() => {
                                        form.setValue("project", p.project_name);
                                      }}
                                    >
                                      {p.custom_project_title}
                                      <Check className={cn("ml-auto", p.project_name === field.value ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                  ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>설명 *</FormLabel>
                    <FormControl>
                      <Textarea placeholder="이슈에 대한 자세한 설명을 입력하세요" className="min-h-[120px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isEdit ? "수정" : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
