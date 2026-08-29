"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  users: { label: "Users", color: "var(--chart-1)" },
  barks: { label: "Reactions", color: "var(--chart-2)" },
  cases: { label: "Cases", color: "var(--chart-3)" },
  stories: { label: "Stories", color: "var(--chart-4)" },
} satisfies ChartConfig;

export function GrowthChart({
  data,
}: {
  data: {
    month: string;
    users: number;
    barks: number;
    cases: number;
    stories: number;
  }[];
}) {
  return (
    <ChartContainer config={config} className="h-72 min-w-0 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 11 }}
        />
        <YAxis tickLine={false} axisLine={false} width={36} tick={{ fontSize: 11 }} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent className="flex-wrap justify-start gap-x-4 gap-y-2" />}
        />
        <Area
          dataKey="users"
          type="monotone"
          fill="var(--color-users)"
          fillOpacity={0.15}
          stroke="var(--color-users)"
          strokeWidth={2}
        />
        <Area
          dataKey="barks"
          type="monotone"
          fill="var(--color-barks)"
          fillOpacity={0.15}
          stroke="var(--color-barks)"
          strokeWidth={2}
        />
        <Area
          dataKey="cases"
          type="monotone"
          fill="var(--color-cases)"
          fillOpacity={0.15}
          stroke="var(--color-cases)"
          strokeWidth={2}
        />
        <Area
          dataKey="stories"
          type="monotone"
          fill="var(--color-stories)"
          fillOpacity={0.15}
          stroke="var(--color-stories)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
