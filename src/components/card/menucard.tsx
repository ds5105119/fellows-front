/**
 * Copyright (c) 2025, IIH. All rights reserved.
 * 바닥에 위치하는 세로 방향 Mobile 환경의 NavBar 안의 Item 컴포넌트입니다.
 */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MenucardProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  text: string;
  children?: React.ReactNode;
}

export default function MenuCardItem({ text, children }: MenucardProps) {
  return (
    <Card className="gap-2 pt-4 pb-2">
      <CardHeader className="px-2">
        <CardTitle className="text-sm px-2">{text}</CardTitle>
      </CardHeader>
      <CardContent className="px-2">{children}</CardContent>
    </Card>
  );
}
