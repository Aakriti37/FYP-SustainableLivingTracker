// pages/User/components/EcoSuggestions/LoadingSkeleton.tsx

const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 gap-4 animate-pulse">
    {[1, 2, 3, 4].map(i => (
      <div
        key={i}
        className="rounded-2xl p-5 border flex items-start gap-4"
        style={{ background: 'white', borderColor: '#c5e3a0' }}
      >
        <div className="shrink-0 w-12 h-12 rounded-xl" style={{ background: '#f0f7e6' }} />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 rounded-full w-2/5" style={{ background: '#e8f5d0' }} />
          <div className="h-3 rounded-full w-3/4" style={{ background: '#e8f5d0' }} />
          <div className="h-3 rounded-full w-1/2" style={{ background: '#e8f5d0' }} />
          <div className="flex gap-2 pt-1">
            <div className="h-5 w-24 rounded-full" style={{ background: '#f0f7e6' }} />
            <div className="h-5 w-20 rounded-full" style={{ background: '#e8f5d0' }} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
