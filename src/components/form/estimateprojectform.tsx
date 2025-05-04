"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

const ReadinessLevel = {
  idea: "아이디어 단계",
  requirements: "요구사항 정의 단계",
  wireframe: "와이어프레임 단계",
} as const;

const DesignComplexity = {
  basic: "기본 디자인",
  custom: "커스텀 디자인",
} as const;

const Platform = {
  web: "웹",
  android: "안드로이드",
  ios: "iOS",
} as const;

const formSchema = z.object({
  project_name: z.string().min(1, "프로젝트명을 입력해주세요"),
  project_summary: z.string().min(1, "한 줄 설명을 입력해주세요"),
  platforms: z.array(z.enum(["web", "android", "ios"])).min(1, "최소 하나의 플랫폼을 선택해주세요"),
  readiness_level: z.enum(["idea", "requirements", "wireframe"]),
  feature_list: z
    .string()
    .optional()
    .transform((val) =>
      val
        ? val
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : []
    ),
  design_complexity: z.enum(["basic", "custom"]).optional(),
  desired_deadline: z.date().optional(),
});

export function EstimateForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string>("");
  const [streamingState, setStreamingState] = useState<{ status: "idle" | "streaming" | "complete" | "error" }>({
    status: "idle",
  });

  useEffect(() => console.log(data), [data]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      project_name: "",
      project_summary: "",
      platforms: ["web"],
      readiness_level: "idea",
      feature_list: [],
      design_complexity: "basic",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setStreamingState({ status: "streaming" });
    setData("");

    try {
      const queryParams = new URLSearchParams();

      for (const [key, value] of Object.entries(values)) {
        if (value === undefined || value === null) {
          continue;
        } else if (Array.isArray(value)) {
          value.forEach((item) => queryParams.append(key, item));
        } else if (value instanceof Date) {
          queryParams.append(key, value.toISOString());
        } else {
          queryParams.append(key, value.toString());
        }
      }

      const eventSource = new EventSource(`/api/service/estimate?${queryParams.toString()}`);

      eventSource.onmessage = (event) => {
        setData((prev) => prev + event.data);
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        setIsLoading(false);
        setStreamingState({ status: "error" });
        eventSource.close();
      };

      setTimeout(() => {
        setStreamingState({ status: "complete" });
        setIsLoading(false);
        eventSource.close();
      }, 15000);
    } catch (error) {
      setStreamingState({ status: "error" });
      setIsLoading(false);
    }
  }

  const platformOptions = [
    { id: "web", label: "웹" },
    { id: "android", label: "안드로이드" },
    { id: "ios", label: "iOS" },
  ];

  // 애니메이션 변수
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div className="flex flex-col md:flex-row w-full min-h-[calc(100vh-8rem)] gap-6">
      <AnimatePresence mode="wait">
        {streamingState.status === "idle" ? (
          <motion.div
            key="form"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            variants={containerVariants}
            className="w-full md:w-2/3 mx-auto"
          >
            <h1 className="text-6xl font-bold mb-10">가격</h1>
            <motion.div variants={itemVariants}>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-6">
                  <h2 className="text-3xl font-bold">
                    <span className="text-shadow-teal-500">·</span>프로젝트
                  </h2>
                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="project_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">프로젝트명</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="프로젝트 이름을 입력하세요"
                              className="rounded-xl h-11 bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="project_summary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">프로젝트 설명</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="프로젝트에 대한 간략한 설명을 입력하세요"
                              className="resize-none rounded-xl bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="platforms"
                        render={() => (
                          <FormItem>
                            <FormLabel className="text-base">지원 플랫폼</FormLabel>
                            <div className="flex flex-wrap gap-4 mt-2">
                              {platformOptions.map((platform) => (
                                <FormField
                                  key={platform.id}
                                  control={form.control}
                                  name="platforms"
                                  render={({ field }) => {
                                    return (
                                      <FormItem key={platform.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(platform.id as any)}
                                            onCheckedChange={(checked) => {
                                              const currentValue = [...(field.value || [])];
                                              if (checked) {
                                                field.onChange([...currentValue, platform.id]);
                                              } else {
                                                field.onChange(currentValue.filter((value) => value !== platform.id));
                                              }
                                            }}
                                            className="rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                                          />
                                        </FormControl>
                                        <FormLabel className="font-normal">{platform.label}</FormLabel>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="readiness_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">사전 준비도</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-xl h-11 bg-background/50 backdrop-blur-sm border-border/60">
                                  <SelectValue placeholder="준비 단계를 선택하세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-border/60 bg-card/95 backdrop-blur-xl">
                                {Object.entries(ReadinessLevel).map(([value, label]) => (
                                  <SelectItem key={value} value={value} className="focus:bg-primary/10">
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="feature_list"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">주요 기능</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="주요 기능을 쉼표로 구분하여 입력하세요"
                                className="resize-none rounded-xl bg-background/50 backdrop-blur-sm border-border/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/50"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>쉼표(,)로 구분하여 입력하세요</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <FormField
                        control={form.control}
                        name="design_complexity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">디자인 난이도</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="rounded-xl h-11 bg-background/50 backdrop-blur-sm border-border/60">
                                  <SelectValue placeholder="디자인 난이도를 선택하세요" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl border-border/60 bg-card/95 backdrop-blur-xl">
                                {Object.entries(DesignComplexity).map(([value, label]) => (
                                  <SelectItem key={value} value={value} className="focus:bg-primary/10">
                                    {label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>

                  <motion.div variants={itemVariants}>
                    <FormField
                      control={form.control}
                      name="desired_deadline"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-base">희망 완료일</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal rounded-xl h-11 bg-background/50 backdrop-blur-sm border-border/60",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP", { locale: ko }) : "날짜 선택"}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl border-border/60 bg-card/95 backdrop-blur-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                                className="rounded-xl"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:opacity-90 transition-all shadow-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          견적 계산 중...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          AI 견적 받기
                        </>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form-collapsed"
            initial={{ opacity: 0, width: "50%" }}
            animate={{ opacity: 1, width: "30%" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="hidden md:block border-r border-border/30 pr-6"
          >
            <div className="sticky top-24">
              <h3 className="text-xl font-medium mb-4">프로젝트 정보</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">프로젝트명</p>
                  <p className="font-medium">{form.getValues().project_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">플랫폼</p>
                  <p className="font-medium">
                    {form
                      .getValues()
                      .platforms.map((p) => Platform[p as keyof typeof Platform])
                      .join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">준비 단계</p>
                  <p className="font-medium">{ReadinessLevel[form.getValues().readiness_level as keyof typeof ReadinessLevel]}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">디자인 난이도</p>
                  <p className="font-medium">{DesignComplexity[form.getValues().design_complexity as keyof typeof DesignComplexity]}</p>
                </div>
                {form.getValues().desired_deadline && (
                  <div>
                    <p className="text-muted-foreground">희망 완료일</p>
                    <p className="font-medium">{format(form.getValues().desired_deadline ?? new Date(), "PPP", { locale: ko })}</p>
                  </div>
                )}
              </div>

              <Button
                onClick={() => {
                  setStreamingState({ status: "idle" });
                  setData("");
                }}
                variant="outline"
                className="mt-6 w-full rounded-xl"
              >
                새 견적 작성
              </Button>
            </div>
          </motion.div>
        )}

        {streamingState.status !== "idle" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="flex-1 md:pl-6 overflow-hidden"
          >
            <div className="relative h-full">
              <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-background to-transparent z-10"></div>

              <div className="h-full overflow-y-auto pb-16 pr-1 markdown-body">
                <div className="min-h-[calc(100vh-10rem)] rounded-2xl bg-card/80 backdrop-blur-xl border border-border/40 p-6 shadow-sm">
                  {streamingState.status === "streaming" && (
                    <div className="absolute top-2 right-4 flex items-center">
                      <span className="text-xs text-muted-foreground mr-2">AI가 견적 생성 중...</span>
                      <div className="flex space-x-1">
                        <motion.div
                          animate={{ scale: [0.5, 1, 0.5] }}
                          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5, ease: "easeInOut" }}
                          className="h-2 w-2 rounded-full bg-primary"
                        ></motion.div>
                        <motion.div
                          animate={{ scale: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.2,
                          }}
                          className="h-2 w-2 rounded-full bg-primary"
                        ></motion.div>
                        <motion.div
                          animate={{ scale: [0.5, 1, 0.5] }}
                          transition={{
                            repeat: Number.POSITIVE_INFINITY,
                            duration: 1.5,
                            ease: "easeInOut",
                            delay: 0.4,
                          }}
                          className="h-2 w-2 rounded-full bg-primary"
                        ></motion.div>
                      </div>
                    </div>
                  )}

                  <div className="prose prose-sm md:prose-base max-w-none prose-headings:font-medium prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-primary prose-img:rounded-md prose-pre:bg-muted/50 prose-pre:backdrop-blur prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{data || "AI가 견적을 생성하고 있습니다..."}</ReactMarkdown>
                  </div>

                  {streamingState.status === "streaming" && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="h-5 w-3 ml-1 mt-1 inline-block">
                      <motion.div
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1, ease: "easeInOut" }}
                        className="h-5 w-[2px] bg-primary"
                      ></motion.div>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-background to-transparent z-10"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
