"use client";

import { useTheme } from "./ThemeProvider";

type ThemeOption = {
  value: "light" | "system" | "dark";
  label: string;
  icon: React.ReactNode;
};

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const options: ThemeOption[] = [
  { value: "light", label: "Light", icon: <SunIcon /> },
  { value: "system", label: "System", icon: <MonitorIcon /> },
  { value: "dark", label: "Dark", icon: <MoonIcon /> },
];

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleKeyDown = (e: React.KeyboardEvent, currentIndex: number) => {
    let nextIndex: number | null = null;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % options.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + options.length) % options.length;
    }

    if (nextIndex !== null) {
      setTheme(options[nextIndex].value);
      // Focus the newly selected option
      const container = (e.currentTarget as HTMLElement).parentElement;
      if (container) {
        const buttons = container.querySelectorAll<HTMLButtonElement>('[role="radio"]');
        buttons[nextIndex]?.focus();
      }
    }
  };

  return (
    <div
      className="theme-toggle"
      role="radiogroup"
      aria-label="Theme preference"
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          role="radio"
          aria-checked={theme === option.value}
          aria-label={`${option.label} theme`}
          className={`theme-toggle__option ${
            theme === option.value ? "theme-toggle__option--active" : ""
          }`}
          onClick={() => setTheme(option.value)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          tabIndex={theme === option.value ? 0 : -1}
        >
          <span className="theme-toggle__icon">{option.icon}</span>
          <span className="theme-toggle__label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
