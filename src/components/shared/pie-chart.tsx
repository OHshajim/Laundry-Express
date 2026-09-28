"use client";

import * as React from "react";

export interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface PieChartProps {
  slices: PieSlice[];
  size?: number;
  innerRadius?: number;
  centerText?: string;
  centerSubtext?: string;
}

export function PieChart({
  slices,
  size = 200,
  innerRadius = 60,
  centerText,
  centerSubtext,
}: PieChartProps) {
  const total = React.useMemo(
    () => slices.reduce((acc, s) => acc + (s.value > 0 ? s.value : 0), 0),
    [slices]
  );

  const radius = size / 2;
  const strokeWidth = radius - innerRadius;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;

  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          <circle
            cx={radius}
            cy={radius}
            r={normalizedRadius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {total > 0 &&
            slices.map((slice, idx) => {
              if (slice.value <= 0) return null;
              const percent = slice.value / total;
              const strokeDasharray = `${percent * circumference} ${circumference}`;
              const strokeDashoffset = -accumulatedPercent * circumference;
              accumulatedPercent += percent;

              return (
                <circle
                  key={idx}
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-85"
                />
              );
            })}
        </svg>

        {centerText && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center p-2">
            <span className="text-base font-black text-slate-900 leading-tight">{centerText}</span>
            {centerSubtext && (
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{centerSubtext}</span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2 flex-1 w-full text-xs">
        {slices.map((slice, idx) => {
          const percent = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <div key={idx} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
                <span className="font-bold text-slate-700 truncate">{slice.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-black text-slate-900">{slice.value}</span>
                <span className="text-[10px] font-bold text-slate-400">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
