'use client';

import { useState, useEffect } from 'react';
import { BookOpen, MessageSquare, Users } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'book' | 'review' | 'user';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching recent activities
    const fetchActivities = async () => {
      // In a real app, this would fetch from an API
      const mockActivities: ActivityItem[] = [
        {
          id: '1',
          type: 'book',
          title: 'New book added',
          description: "New book 'Project Hail Mary' added by Alex",
          time: '5 minutes ago',
          icon: <BookOpen className="w-4 h-4 text-violet-500" />
        },
        {
          id: '2',
          type: 'review',
          title: 'New review',
          description: "John reviewed 'Atomic Habits'",
          time: '15 minutes ago',
          icon: <MessageSquare className="w-4 h-4 text-amber-500" />
        },
        {
          id: '3',
          type: 'user',
          title: 'New user registered',
          description: "New user Sarah joined",
          time: '20 minutes ago',
          icon: <Users className="w-4 h-4 text-emerald-500" />
        },
        {
          id: '4',
          type: 'book',
          title: 'New book added',
          description: "New book 'The Midnight Library' added by Sarah",
          time: '20 minutes ago',
          icon: <BookOpen className="w-4 h-4 text-violet-500" />
        },
        {
          id: '5',
          type: 'review',
          title: 'Review approved',
          description: "Admin approved review for 'The Silent Patient'",
          time: '45 minutes ago',
          icon: <MessageSquare className="w-4 h-4 text-amber-500" />
        }
      ];

      // Simulate API delay
      setTimeout(() => {
        setActivities(mockActivities);
        setLoading(false);
      }, 500);
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-3 bg-slate-700/30 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-slate-600 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                <div className="h-3 bg-slate-600 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg">
          <div className="mt-0.5">
            {activity.icon}
          </div>
          <div>
            <p className="text-slate-300">{activity.description}</p>
            <p className="text-xs text-slate-500">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}