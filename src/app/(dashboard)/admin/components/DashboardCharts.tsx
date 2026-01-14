'use client';

import { useState, useEffect } from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  booksPerGenre: ChartData[];
  monthlyBooks: ChartData[];
  userGrowth: ChartData[];
}

export default function DashboardCharts({ 
  booksPerGenre = [], 
  monthlyBooks = [], 
  userGrowth = [] 
}: DashboardChartsProps) {
  // Calculate total for percentage calculation
  const totalBooks = booksPerGenre.reduce((sum, item) => sum + item.value, 0);

  // Colors for the pie chart segments
  const pieColors = [
    'bg-violet-500',
    'bg-emerald-500', 
    'bg-amber-500',
    'bg-blue-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Books per Genre (Pie Chart) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Books per Genre</h3>
        <div className="flex items-center justify-center h-64">
          <div className="relative w-48 h-48 rounded-full">
            {booksPerGenre.map((item, index) => {
              const percentage = totalBooks > 0 ? (item.value / totalBooks) * 100 : 0;
              const colorIndex = index % pieColors.length;
              
              // Calculate rotation angles for the segments
              let startAngle = 0;
              for (let i = 0; i < index; i++) {
                startAngle += (booksPerGenre[i].value / totalBooks) * 360;
              }
              const endAngle = startAngle + (percentage * 3.6); // Convert percentage to degrees (100% = 360°)
              
              return (
                <div
                  key={item.name}
                  className={`absolute top-0 left-0 w-full h-full rounded-full clip-sector-${index}`}
                  style={{
                    clipPath: `conic-gradient(from ${startAngle}deg, ${pieColors[colorIndex]} 0%, ${pieColors[colorIndex]} ${percentage * 3.6}deg, transparent 0deg)`
                  }}
                />
              );
            })}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{totalBooks}</div>
                <div className="text-xs text-slate-400">Total</div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {booksPerGenre.map((item, index) => {
            const colorIndex = index % pieColors.length;
            const percentage = totalBooks > 0 ? (item.value / totalBooks) * 100 : 0;
            
            return (
              <div key={item.name} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${pieColors[colorIndex]}`}></div>
                <span className="text-sm">{item.name}: {percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Books Added (Line Chart) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Monthly Books Added</h3>
        <div className="flex items-end justify-between h-64 pt-8 pb-4">
          {monthlyBooks.map((item, index) => {
            const maxValue = Math.max(...monthlyBooks.map(d => d.value));
            const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 px-1">
                <div className="text-xs text-slate-400 mb-1">{item.name}</div>
                <div 
                  className="w-full bg-violet-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="text-xs mt-1">{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Growth (Area Chart) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">User Growth</h3>
        <div className="h-64 flex items-end justify-between pt-8 pb-4">
          {userGrowth.map((item, index) => {
            const maxValue = Math.max(...userGrowth.map(d => d.value));
            const heightPercentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center flex-1 px-1">
                <div className="text-xs text-slate-400 mb-1">{item.name}</div>
                <div 
                  className="w-full bg-emerald-500 rounded-t-lg transition-all duration-500 ease-out"
                  style={{ height: `${heightPercentage}%` }}
                ></div>
                <div className="text-xs mt-1">{item.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}