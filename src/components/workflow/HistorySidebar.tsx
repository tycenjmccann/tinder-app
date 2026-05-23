"use client";

import { useState } from "react";

const MOCK_RUNS = [
  { id: "wf-1", title: "User Auth Flow", date: "2024-01-15T10:30:00Z", status: "completed" },
  { id: "wf-2", title: "Dashboard Redesign", date: "2024-01-14T14:20:00Z", status: "completed" },
  { id: "wf-3", title: "API Integration", date: "2024-01-13T09:15:00Z", status: "in-progress" },
  { id: "wf-4", title: "Profile Card Update", date: "2024-01-12T16:45:00Z", status: "failed" },
  { id: "wf-5", title: "Match Algorithm v2", date: "2024-01-11T11:00:00Z", status: "completed" },
  { id: "wf-6", title: "Chat Feature", date: "2024-01-10T13:30:00Z", status: "completed" },
  { id: "wf-7", title: "Notification System", date: "2024-01-09T08:45:00Z", status: "in-progress" },
  { id: "wf-8", title: "Settings Page", date: "2024-01-08T15:20:00Z", status: "completed" },
  { id: "wf-9", title: "Onboarding Flow", date: "2024-01-07T10:10:00Z", status: "failed" },
  { id: "wf-10", title: "Image Upload", date: "2024-01-06T12:00:00Z", status: "completed" },
];

const statusStyles: Record<string, string> = {
  "completed": "bg-green-100 text-green-800",
  "in-progress": "bg-yellow-100 text-yellow-800",
  "failed": "bg-red-100 text-red-800",
};

const ACTIVE_ID = "wf-3";
const STORAGE_KEY = "workflow-sidebar-collapsed";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function HistorySidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return true;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "true";
    return window.innerWidth < 768;
  });

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <aside
      aria-label="Workflow history"
      className={`flex flex-col bg-white border-r border-gray-200 transition-[width] duration-200 ease-in-out overflow-hidden motion-reduce:transition-none ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        {!collapsed && (
          <h2 className="text-sm font-semibold text-gray-700 truncate">
            History
          </h2>
        )}
        <button
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls="sidebar-content"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors ml-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 motion-reduce:transition-none ${
              collapsed ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <nav
        id="sidebar-content"
        aria-label="Recent workflow runs"
        className="flex-1 overflow-y-auto"
      >
        <ul className="py-1">
          {MOCK_RUNS.map((run) => {
            const isActive = run.id === ACTIVE_ID;
            return (
              <li key={run.id}>
                <button
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full p-3 text-left cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ${
                    isActive
                      ? "border-l-4 border-blue-500 bg-blue-50"
                      : "border-l-4 border-transparent"
                  }`}
                >
                  {collapsed ? (
                    <div
                      className={`w-2 h-2 rounded-full mx-auto ${
                        run.status === "completed"
                          ? "bg-green-500"
                          : run.status === "in-progress"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                      title={run.title}
                    />
                  ) : (
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {run.title}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {formatDate(run.date)}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full ${statusStyles[run.status] || ""}`}
                        >
                          {run.status}
                        </span>
                      </div>
                    </div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
