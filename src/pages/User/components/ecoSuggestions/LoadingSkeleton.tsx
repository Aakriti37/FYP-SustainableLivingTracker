// pages/User/components/EcoSuggestions/LoadingSkeleton.tsx

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4"
        >
          {/* Icon placeholder */}
          <div className="shrink-0 w-12 h-12 rounded-xl bg-emerald-50" />

          {/* Text placeholders */}
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-gray-100 rounded-full w-2/5" />
            <div className="h-3 bg-gray-100 rounded-full w-3/4" />
            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-24 bg-emerald-50 rounded-full" />
              <div className="h-5 w-20 bg-gray-100 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
