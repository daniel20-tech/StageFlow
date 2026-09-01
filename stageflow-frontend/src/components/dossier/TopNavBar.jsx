export default function TopNavBar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 shadow-sm px-6">
      <div className="navbar-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <img 
              src="/images/stageflow-logo.png" 
              alt="StageFlow Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-xl font-bold text-base-content tracking-tight">
            <span className="text-primary">Stage</span>
            <span className="text-cyan-500">Flow</span>
          </div>
        </div>
      </div>

      <div className="navbar-end">
        <button className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge badge-sm badge-primary indicator-item"></span>
          </div>
        </button>
      </div>
    </div>
  );
}
