"use client";

import { useState } from "react";

interface Source {
  label: string;
  url: string;
}

interface WorkflowState {
  input: {
    epicTitle: string;
    userActions: {
      id: string;
      label: string;
      sources: Source[];
    }[];
    sources: Source[];
  };
}

const MOCK_STATE: WorkflowState = {
  input: {
    epicTitle: "User Engagement & Matching Experience",
    userActions: [
      {
        id: "action-1",
        label: "Swipe right to like a profile",
        sources: [
          { label: "Product Spec", url: "https://example.com/specs/swipe-like" },
          { label: "Design Doc", url: "https://example.com/design/swipe-interaction" },
        ],
      },
      {
        id: "action-2",
        label: "Send a message after matching",
        sources: [
          { label: "API Reference", url: "https://example.com/api/messaging" },
        ],
      },
      {
        id: "action-3",
        label: "Update profile preferences",
        sources: [
          { label: "Requirements", url: "https://example.com/requirements/preferences" },
          { label: "UX Research", url: "https://example.com/research/preferences" },
          { label: "Technical RFC", url: "https://example.com/rfc/preference-engine" },
        ],
      },
    ],
    sources: [
      { label: "Epic Overview", url: "https://example.com/epics/engagement" },
      { label: "Sprint Board", url: "https://example.com/board/sprint-42" },
    ],
  },
};

interface WorkflowBoardProps {
  activeRunId: string;
}

export default function WorkflowBoard({ activeRunId }: WorkflowBoardProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleItem(id);
    }
  };

  const state = MOCK_STATE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Phase 1: Intake */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Phase 1: Intake
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
            {state.input.epicTitle}
          </p>
        </div>

        <div className="space-y-1">
          <h4 className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-2">
            User Actions
          </h4>
          {state.input.userActions.map((action) => {
            const isExpanded = expandedItems.has(action.id);
            const contentId = `content-${action.id}`;

            return (
              <div key={action.id} className="border border-zinc-100 dark:border-zinc-700 rounded">
                <button
                  onClick={() => toggleItem(action.id)}
                  onKeyDown={(e) => handleKeyDown(e, action.id)}
                  aria-expanded={isExpanded}
                  aria-controls={contentId}
                  aria-label={`${action.label} - ${isExpanded ? "collapse" : "expand"} sources`}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-zinc-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-750 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 motion-reduce:transition-none ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">{action.label}</span>
                </button>

                {isExpanded && (
                  <div
                    id={contentId}
                    role="region"
                    aria-label={`Sources for ${action.label}`}
                    className="px-3 pb-2 pl-9"
                  >
                    <ul className="space-y-1">
                      {action.sources.map((source, idx) => (
                        <li key={idx}>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="w-3 h-3"
                            >
                              <path d="M8.914 6.025a.75.75 0 0 1 1.06 0 3.5 3.5 0 0 1 0 4.95l-2 2a3.5 3.5 0 0 1-5.396-4.402.75.75 0 0 1 1.251.827 2 2 0 0 0 3.085 2.514l2-2a2 2 0 0 0 0-2.828.75.75 0 0 1 0-1.06Z" />
                              <path d="M7.086 9.975a.75.75 0 0 1-1.06 0 3.5 3.5 0 0 1 0-4.95l2-2a3.5 3.5 0 0 1 5.396 4.402.75.75 0 0 1-1.251-.827 2 2 0 0 0-3.085-2.514l-2 2a2 2 0 0 0 0 2.828.75.75 0 0 1 0 1.06Z" />
                            </svg>
                            {source.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase 2: Processing */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Phase 2: Processing
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Active run: {activeRunId}
        </p>
      </div>

      {/* Phase 3: Output */}
      <div className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Phase 3: Output
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Results will appear here.
        </p>
      </div>
    </div>
  );
}
