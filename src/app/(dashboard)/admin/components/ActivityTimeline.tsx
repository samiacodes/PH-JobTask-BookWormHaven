interface ActivityItem {
  id: number;
  text: string;
  time: string;
  icon: React.ReactNode;
}

interface ActivityTimelineProps {
  title: string;
  activities: ActivityItem[];
}

export default function ActivityTimeline({ title, activities }: ActivityTimelineProps) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="mt-0.5 text-violet-500">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="text-slate-300">{activity.text}</p>
              <p className="text-xs text-slate-500">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}