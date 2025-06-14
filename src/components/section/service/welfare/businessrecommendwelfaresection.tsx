"use client";

import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import DragScrollContainer from "../../../ui/dragscrollcontainer";
import Link from "next/link";
import useThrottle from "@/lib/useThrottle";
import ComboBoxResponsive from "@/components/ui/comboboxresponsive";
import BreathingSparkles from "@/components/resource/breathingsparkles";
import { useState } from "react";
import { Welfare, WelfareResponseSchema } from "@/@types/openApi/welfare";
import { formatNumber } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Compass, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface getKeyFactoryProps {
  tag?: string;
  keyword?: string;
  order_by?: string;
}

const splitO = (input: string) =>
  input
    .split("○")
    .map((str) => str.trim())
    .filter((str) => str.length > 0)
    .map((str) => `○ ${str}`)
    .join("\n\n");

const extractNameAndPhones = (data: string) => {
  const phoneRegex = /\d{2,4}[-)]?\d{3,4}[-]?\d{4}|\b\d{4}\b|\b\d{7,8}\b/g;
  const results: Array<{ name: string; phone: string }> = [];

  const segments = data.split("||");
  segments.forEach((segment) => {
    const [name, numberPart] = segment.split("/");
    const phones = numberPart.match(phoneRegex);
    if (phones) {
      phones.forEach((phone) => {
        results.push({
          name: name?.trim() ?? "",
          phone: phone.replace(/[^\d\-]/g, ""),
        });
      });
    }
  });

  return results;
};

function callPhoneNumber(number: string) {
  const sanitized = number.replace(/[^0-9]/g, "");
  window.location.href = `tel:${sanitized}`;
}

const getKeyFactory = ({ tag, keyword, order_by }: getKeyFactoryProps): SWRInfiniteKeyLoader => {
  return (index, previousPageData) => {
    if (previousPageData && !previousPageData.length) return null;

    const params = new URLSearchParams();
    params.append("page", `${index}`);

    if (tag) params.append("tag", tag);
    if (keyword) params.append("keyword", keyword);
    if (order_by) params.append("order_by", order_by);

    return `/api/welfare/business?${params.toString()}`;
  };
};

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to load data");
  const data = await res.json();
  return WelfareResponseSchema.parse(data);
};

const tags = [
  { name: "전체", value: "" },
  { name: "현금", value: "현금" },
  { name: "현물", value: "현물" },
  { name: "이용권", value: "이용권" },
  { name: "시설이용", value: "시설이용" },
  { name: "문화·여가", value: "문화" },
  { name: "서비스", value: "서비스" },
  { name: "의료지원", value: "의료지원" },
  { name: "기술지원", value: "기술지원" },
  { name: "기타", value: "기타" },
] as const;

const orders = [
  { label: "인기순", value: "views" },
  { label: "최신순", value: "created_at" },
  { label: "최근 업데이트순", value: "updated_at" },
  { label: "카테고리순", value: "service_category" },
];

function WelfareSheet({ selected, onClose }: { selected: Welfare | null; onClose: () => void }) {
  if (!selected) return null;

  return (
    <Sheet open={!!selected} onOpenChange={onClose}>
      <SheetContent className="py-6 px-3 min-w-full md:min-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex flex-col space-y-1">
            <div className="text-muted-foreground text-xs font-medium">{selected.apply_period}</div>
            <div className="text-2xl font-bold">{selected.service_name}</div>
            <div className="text-muted-foreground font-medium text-base mt-1">{selected.service_summary}</div>
          </SheetTitle>

          <SheetDescription asChild>
            <div className="flex flex-col space-y-5 items-center">
              <div className="flex flex-col space-y-3 items-center w-full py-5 px-4 rounded-xl bg-neutral-400/10 outline-1 outline-neutral-300/50 mt-6 hover:bg-neutral-300/10 transition-colors duration-200">
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">연락처</span>
                  <span className="text-sm w-1/2 truncate text-foreground text-right">{selected.contact}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">관련기관</span>
                  <span className="text-sm w-1/2 truncate text-foreground text-right">{selected.dept_name}</span>
                </div>
                <div className="flex justify-between items-center w-full">
                  <span className="text-sm text-muted-foreground">부서이름</span>
                  <span className="text-sm w-1/2 truncate text-foreground text-right">{selected.offc_name}</span>
                </div>
              </div>

              <div className="flex flex-col space-y-3 items-center w-full py-5 px-4 rounded-xl outline-1 outline-neutral-200">
                <div className="flex items-center w-full space-x-2">
                  <BreathingSparkles />
                  <span className="text-sm font-bold text-foreground">정책을 요약했어요</span>
                </div>
                <div className="w-full">{selected.service_description}</div>
              </div>

              <div className="flex space-x-3 items-center w-full">
                <Button
                  variant={"outline"}
                  className="flex-1 h-10"
                  onClick={() => window.open(selected.apply_url ?? selected.detail_url ?? "", "_blank")}
                  disabled={!(selected.apply_url ?? selected.detail_url)}
                >
                  <Compass />웹 사이트로 이동
                </Button>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={"outline"} className="flex-1 h-10">
                      <Phone />
                      전화하기
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-2.5 w-56" side={"left"}>
                    {extractNameAndPhones(selected.contact ?? "").map((val, idx) => (
                      <button
                        key={idx}
                        className="flex flex-col w-full space-x-2 rounded-md hover:bg-neutral-100 p-3"
                        onClick={() => callPhoneNumber(val.phone)}
                      >
                        <span className="text-sm font-semibold text-foreground text-left">{val.name}</span>
                        <span className="text-xs font-medium text-muted-foreground text-left">{val.phone}</span>
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col w-full space-y-10">
                {selected.support_details && (
                  <div className="flex flex-col w-full space-y-2">
                    <div className="text-lg font-bold text-foreground">지원 내용</div>
                    <div className="whitespace-pre-wrap leading-relaxed">{splitO(selected.support_details)}</div>
                  </div>
                )}
                {selected.support_targets && (
                  <div className="flex flex-col w-full space-y-2">
                    <div className="text-lg font-bold text-foreground">지원 대상</div>
                    <div className="whitespace-pre-wrap leading-relaxed">{splitO(selected.support_targets)}</div>
                  </div>
                )}
                {selected.document && (
                  <div className="flex flex-col w-full space-y-2">
                    <div className="text-lg font-bold text-foreground">구비 서류</div>
                    <div className="whitespace-pre-wrap leading-relaxed">{splitO(selected.document)}</div>
                  </div>
                )}
              </div>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default function BusinessRecommendWelfareSection() {
  const [tag, setTag] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [orderBy, setOrderBy] = useState<string>("");
  const [selected, setSelected] = useState<Welfare | null>(null);
  const keyword = useThrottle(inputText, 1000);
  const getKey = getKeyFactory({ tag, keyword: keyword, order_by: orderBy });
  const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher);

  if (error) return "error";

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="relative h-9">
        <DragScrollContainer className="absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap flex space-x-2 w-[45%]">
          {tags.map((value) => (
            <Button
              key={value.value}
              size="sm"
              variant={tag === value.value ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setTag(value.value)}
            >
              {value.name}
            </Button>
          ))}
        </DragScrollContainer>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex w-[42%] space-x-2 items-center">
          <Input placeholder="검색어를 입력해주세요..." onChange={(e) => setInputText(e.target.value)} />
        </div>
      </div>

      <div className="flex w-full justify-between mt-6">
        <ComboBoxResponsive statuses={orders} initial="views" callback={setOrderBy} />
      </div>

      <div className="flex flex-col w-full space-x-0.5 space-y-4">
        <Table className="table-fixed w-full">
          <TableCaption className="text-center whitespace-pre-line">
            {
              "Fellows에서 제공하는 정보는 정확성이나 완전성을 보장할 수 없으며, 시간이 경과함에 따라 변경될 수 있습니다.\n따라서 정보의 오류, 누락에 대하여 Fellows는 그 결과에 대해 법적인 책임을 지지 않습니다."
            }
          </TableCaption>
          <TableHeader className="bg-neutral-200 h-14">
            <TableRow>
              <TableHead className="w-[4%] truncate break-all text-center">링크</TableHead>
              <TableHead className="w-[7%] truncate break-all text-center">조회수</TableHead>
              <TableHead className="w-[9%] truncate break-all text-center">분류</TableHead>
              <TableHead className="w-[20%] truncate break-all text-center">사업명</TableHead>
              <TableHead className="w-[33%] truncate break-all text-center">지원 요약</TableHead>
              <TableHead className="w-[18%] truncate break-all text-center">지원 시기</TableHead>
              <TableHead className="w-[9%] truncate break-all text-center">대상</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((pages) => {
              return pages.map((val, idx) => (
                <TableRow key={idx} className="h-14" onClick={() => setSelected(val)}>
                  <TableCell className="text-center">
                    {val.apply_url ?? val.detail_url ? (
                      <Link href={val.apply_url ?? val.detail_url ?? ""} className="">
                        🔗
                      </Link>
                    ) : (
                      <>❌</>
                    )}
                  </TableCell>
                  <TableCell className="truncate break-all text-center">{formatNumber(val.views)}</TableCell>
                  <TableCell className="truncate break-all text-center font-semibold">{val.service_category}</TableCell>
                  <TableCell className="truncate break-all">{val.service_name}</TableCell>
                  <TableCell className="truncate break-all">{val.service_summary}</TableCell>
                  <TableCell className="truncate break-all">{val.apply_period}</TableCell>
                  <TableCell className="truncate break-all text-center font-semibold">{val.dept_type === "시군구" ? val.dept_name : "전국"}</TableCell>
                </TableRow>
              ));
            })}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>Total</TableCell>
              <TableCell className="text-right">$2,500.00</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      <div className="flex flex-col w-full items-center my-4">
        <Button variant="outline" onClick={() => setSize(size + 1)}>
          더보기
        </Button>
      </div>

      <WelfareSheet selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
