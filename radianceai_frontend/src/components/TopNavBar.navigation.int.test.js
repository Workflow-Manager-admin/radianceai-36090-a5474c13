import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Major TopNavBar routes/labels/paths for test
const NAV_TEST_CONFIG = [
  { label: "Home", path: "/", contentMatch: /get your personalized skincare/i },
  { label: "Quiz", path: "/quiz", contentMatch: /skin goals/i },
  { label: "Discover", path: "/recommendations", contentMatch: /recommended|discover/i },
  { label: "Routine", path: "/routine", contentMatch: /your skin routine|routine builder/i },
  { label: "Progress", path: "/progress", contentMatch: /progress|tracked days|weekly/i },
  { label: "Weather", path: "/weather", contentMatch: /weather|suggestions/i },
  { label: "AI Chat", path: "/chat", contentMatch: /chatbot|ai chat/i },
  { label: "Email", path: "/email", contentMatch: /send email|email reminders|summary/i },
];

// Attempt to get nav link by label
function getNavBtn(label) {
  // Will query for nav link based on text, but may need alternative strategies if display is toggled/hidden on small screens.
  // Looks for visible link with exact label.
  return screen.getByRole("link", { name: label });
}

describe("TopNavBar Navigation Integration", () => {
  NAV_TEST_CONFIG.forEach(({ label, path, contentMatch }) => {
    test(`Clicking '${label}' in TopNavBar updates view and URL`, async () => {
      render(<App />, { wrapper: MemoryRouter });
      // For Home, no click — already there
      if (label !== "Home") {
        // Click navbar button
        // Retry loose on visibility if needed (responsive nav could hide some)
        let navBtn;
        try {
          navBtn = getNavBtn(label);
        } catch (e) {
          // Try to find by text or partial label in links (last resort, fails if not found)
          navBtn = screen.getAllByRole("link").find(l => l.textContent.includes(label));
        }
        expect(navBtn).toBeTruthy();
        fireEvent.click(navBtn);
      }
      // Wait for path and content to update
      await waitFor(() => {
        // Check the address bar (window.location)
        expect(window.location.pathname).toBe(path);
        // Check for visible main content indication
        const main = screen.getByRole("main");
        expect(main).toBeTruthy();
        expect(main.textContent).toMatch(contentMatch);
      });
    });
  });

  test("URL and visible view stay in sync for multiple rapid navigations", async () => {
    render(<App />, { wrapper: MemoryRouter });

    // Rapidly click nav links in succession
    for (const { label, path, contentMatch } of NAV_TEST_CONFIG) {
      let navBtn;
      try {
        navBtn = getNavBtn(label);
      } catch {
        navBtn = screen.getAllByRole("link").find(l => l.textContent.includes(label));
      }
      expect(navBtn).toBeTruthy();
      fireEvent.click(navBtn);
      // Confirm sync after each click
      await waitFor(() => {
        expect(window.location.pathname).toBe(path);
        const main = screen.getByRole("main");
        expect(main.textContent).toMatch(contentMatch);
      });
    }
  });
});
