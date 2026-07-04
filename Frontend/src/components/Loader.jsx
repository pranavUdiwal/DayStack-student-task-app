import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loader({ fullScreen = true, inline = false }) {
  if (inline) {
    return <Loader2 className="w-5 h-5 animate-spin" />;
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 z-50 flex items-center justify-center'
    : 'w-full h-full min-h-[200px] flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <Loader2 className="w-10 h-10 animate-spin text-slate-800" />
    </div>
  );
}
