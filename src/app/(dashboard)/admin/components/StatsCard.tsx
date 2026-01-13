

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export default function StatsCard({ title, value, icon, color = 'text-violet-500' }: StatsCardProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        <div className={`${color} p-2 rounded-lg bg-slate-700/50`}>
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}