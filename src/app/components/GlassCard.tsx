interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function GlassCard({ children, className = '' }: GlassCardProps) {
  return (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl ${className}`}>
      {children}
    </div>
  );
}