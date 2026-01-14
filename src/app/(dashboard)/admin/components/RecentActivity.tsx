'use client';

import { useState, useEffect } from 'react';
import { BookOpen, MessageSquare, Users } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItem {
  id: string;
  type: 'book' | 'review' | 'user';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface RecentActivityProps {
  type: 'books' | 'reviews';
  data?: any[];
}

export default function RecentActivity({ type, data }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedActivities = data.map((item: any, index: number) => {
        let activity: ActivityItem;
        
        if (type === 'books') {
          activity = {
            id: item._id || `book-${index}`,
            type: 'book',
            title: 'New book added',
            description: `New book '${item.title}' added by ${item.author}`,
            time: formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
            icon: <BookOpen className="w-4 h-4 text-violet-500" />
          };
        } else { // reviews
          activity = {
            id: item._id || `review-${index}`,
            type: 'review',
            title: 'New review',
            description: `${item.user?.name} reviewed '${item.book?.title}'`,
            time: formatDistanceToNow(new Date(item.createdAt), { addSuffix: true }),
            icon: <MessageSquare className="w-4 h-4 text-amber-500" />
          };
        }
        
        return activity;
      });
      
      setActivities(formattedActivities);
      setLoading(false);
    } else {
      // Fallback to loading state
      setLoading(false);
    }
  }, [data, type]);

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

  if (activities.length === 0) {
    return (
      <div className="text-center text-slate-400 py-4">
        No recent {type}
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