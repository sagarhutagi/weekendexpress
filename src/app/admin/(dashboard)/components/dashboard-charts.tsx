
'use client';

import { Bar, BarChart, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

interface ChartData {
    name: string;
    total?: number;
    value?: number;
    fill?: string;
}

interface DashboardChartsProps {
  categoryData: ChartData[];
  priceData: ChartData[];
}

const categoryChartConfig = {
  total: {
    label: 'Workshops',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const priceChartConfig = {
  value: {
    label: 'Workshops',
  },
  paid: {
    label: 'Paid',
    color: 'hsl(var(--primary))',
  },
  free: {
    label: 'Free',
    color: 'hsl(var(--muted))',
  }
} satisfies ChartConfig;


export function DashboardCharts({ categoryData, priceData }: DashboardChartsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Workshops per Category</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={categoryChartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Legend />
                <Bar dataKey="total" fill="var(--color-total)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Free vs. Paid Workshops</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={priceChartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Tooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                    <Pie data={priceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                         {priceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                     <Legend />
                </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
