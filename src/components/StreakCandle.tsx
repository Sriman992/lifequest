export default function StreakCandle({ streak }: { streak: number }) {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-full border border-[#e8a24b]/20 bg-[#1b2430]/70 px-3 py-1.5"
      aria-label={`${streak} day study streak`}
    >
      <span aria-hidden="true" className="text-lg">🔥</span>
      <div>
        <div className="flex gap-1" aria-hidden="true">
          {Array.from({ length: 7 }, (_, index) => (
            <span
              key={index}
              className={`h-2.5 w-2.5 rounded-full ${index < streak ? "bg-[#e8a24b] shadow-[0_0_10px_rgba(232,162,75,0.5)]" : "bg-[#3a4655]"}`}
            />
          ))}
        </div>
        <span className="mt-1 block text-sm font-semibold text-[#f6ebdc]">
          {streak} day{streak === 1 ? "" : "s"} streak
        </span>
      </div>
    </div>
  );
}
