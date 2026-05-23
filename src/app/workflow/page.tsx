"use client";

import { useState, useEffect } from "react";
import WorkflowBoard from "@/components/workflow/WorkflowBoard";

interface WorkflowRun {
  id: string;
  title: string;
  date: string;
  status: "completed" | "running" | "failed" | "queued";
}

const MOCK_WORKFLOW_RUNS: WorkflowRun[] = [
  { id: "run-1", title: "User Onboarding Flow", date: "2026-05-23T14:30:00Z", status: "running" },
  { id: "run-2", title: "Profile Matching Pipeline", date: "2026-05-22T09:15:00Z", status: "completed" },
  { id: "run-3", title: "Notification Dispatch", date: "2026-05-21T16:45:00Z", status: "completed" },
  { id: "run-4", title: "Image Processing Queue", date: "2026-05-20T11:00:00Z", status: "failed" },
  { id: "run-5", title: "Recommendation Engine", date: "2026-05-19T08:30:00Z", status: "completed" },
  { id: "run-6", title: "Chat Sync Pipeline", date: "2026-05-18T13:20:00Z", status: "completed" },
  { id: "run-7", title: "Analytics Aggregation", date: "2026-05-17T10:00:00Z", status: "completed" },
  { id: "run-8", title: "Location Index Rebuild", date: "2026-05-16T22:00:00Z", status: "completed" },
  { id: "run-9", title: "A/B Test Evaluation", date: "2026-05-15T07:45:00Z", status: "queued" },
  { id: "run-10", title: "Data Export Job", date: "2026-05-14T15:10:00Z", status: "completed" },
];

const STATUS_STYLES: Record<WorkflowRun["status"], string> = {
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  running: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  failed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  queued: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
};

const STORAGE_KEY = "workflow-sidebar-collapsed";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function WorkflowPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeRunId, setActiveRunId] = useState<string>("run-1");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, String(collapsed));
    }
  }, [collapsed, mounted]);

  const toggleSidebar = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside
        className={`flex-shrink-0 border-r border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 transition-[width] duration-200 ease-in-out motion-reduce:transition-none overflow-hidden ${
          collapsed ? "w-12" : "w-72"
        }`}
        aria-label="Workflow history sidebar"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-2 border-b border-zinc-200 dark:border-zinc-700">
            {!collapsed && (
              <h2 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-2">
                History
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              aria-expanded={!collapsed}
              aria-controls="sidebar-content"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 transition-transform duration-200 motion-reduce:transition-none ${
                  collapsed ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <nav
            id="sidebar-content"
            className="flex-1 overflow-y-auto"
            aria-label="Workflow run history"
          >
            {collapsed ? (
              <div className="flex flex-col items-center gap-1 py-2">
                {MOCK_WORKFLOW_RUNS.map((run) => (
                  <button
                    key={run.id}
                    onClick={() => setActiveRunId(run.id)}
                    aria-label={`${run.title} - ${run.status}`}
                    className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium ${
                      activeRunId === run.id
                        ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950"
                        : "hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        run.status === "completed"
                          ? "bg-green-500"
                          : run.status === "running"
                            ? "bg-blue-500"
                            : run.status === "failed"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                      }`}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <ul className="py-1">
                {MOCK_WORKFLOW_RUNS.map((run) => (
                  <li key={run.id}>
                    <button
                      onClick={() => setActiveRunId(run.id)}
                      aria-current={activeRunId === run.id ? "true" : undefined}
                      className={`w-full text-left px-4 py-3 transition-colors duration-150 motion-reduce:transition-none ${
                        activeRunId === run.id
                          ? "bg-blue-50 border-l-2 border-blue-500 dark:bg-blue-950 dark:border-blue-400"
                          : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border-l-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                          {run.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">
                          {formatDate(run.date)}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${STATUS_STYLES[run.status]}`}
                        >
                          {run.status}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
          Workflow
        </h1>
        <WorkflowBoard activeRunId={activeRunId} />
      </main>
    </div>
  );
}
