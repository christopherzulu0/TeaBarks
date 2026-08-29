"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

export type ActivityPoint = {
  month: string;
  barks: number;
  cases: number;
  evidence: number;
};

const config = {
  barks: { label: "Reactions", color: "var(--chart-1)" },
  cases: { label: "Cases", color: "var(--chart-3)" },
  evidence: { label: "Evidence items", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ActivityChart({ data }: { data: ActivityPoint[] }) {
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="barks" fill="var(--color-barks)" radius={4} />
        <Bar dataKey="cases" fill="var(--color-cases)" radius={4} />
        <Bar dataKey="evidence" fill="var(--color-evidence)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
