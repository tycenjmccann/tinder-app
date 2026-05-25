"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/components/ThemeProvider";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { resolvedTheme } = useTheme();

  return (
    <main className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">Settings</h1>

        <section className="settings-section">
          <div className="settings-section__header">
            <h2 className="settings-section__title">Appearance</h2>
            <p className="settings-section__description">
              Customize how the app looks. Choose between light and dark themes,
              or let it follow your system preference.
            </p>
          </div>

          <div className="settings-section__content">
            <div className="settings-field">
              <label className="settings-field__label">Theme</label>
              <ThemeToggle />
              <p className="settings-field__hint">
                Currently using{" "}
                <span className="settings-field__hint-value">
                  {resolvedTheme}
                </span>{" "}
                mode
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
