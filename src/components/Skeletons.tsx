export function TaskSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 bg-panelSoft/60 rounded-lg px-4 py-3">
      <div className="h-5 w-5 rounded-full bg-parchmentDim/20" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-2/3 bg-parchmentDim/20 rounded" />
        <div className="h-2 w-1/3 bg-parchmentDim/10 rounded" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen p-6 md:p-10 grid md:grid-cols-[1fr_1.1fr] gap-6" aria-busy="true" aria-label="Loading your room">
      <div className="animate-pulse bg-panel rounded-cozy h-64 md:h-full" />
      <div className="space-y-3">
        <div className="animate-pulse h-8 w-1/2 bg-panel rounded" />
        <TaskSkeleton />
        <TaskSkeleton />
        <TaskSkeleton />
      </div>
    </div>
  );
}
