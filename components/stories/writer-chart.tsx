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

const readsData = [
  { month: "Mar", reads: 21400, votes: 1980 },
  { month: "Apr", reads: 38200, votes: 3620 },
  { month: "May", reads: 64800, votes: 6100 },
  { month: "Jun", reads: 92300, votes: 8940 },
  { month: "Jul", reads: 131500, votes: 12700 },
  { month: "Aug", reads: 148900, votes: 14300 },
];

const config = {
  reads: { label: "Reads", color: "var(--chart-1)" },
  votes: { label: "Votes", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function WriterReadsChart() {
  return (
    <ChartContainer config={config} className="h-64 w-full">
      <AreaChart data={readsData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={52} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="reads"
          type="monotone"
          fill="var(--color-reads)"
          fillOpacity={0.15}
          stroke="var(--color-reads)"
          strokeWidth={2}
        />
        <Area
          dataKey="votes"
          type="monotone"
          fill="var(--color-votes)"
          fillOpacity={0.15}
          stroke="var(--color-votes)"
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  );
}
