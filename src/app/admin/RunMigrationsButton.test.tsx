import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { RunMigrationsButton } from "./RunMigrationsButton";

// Keep the test DB-free; the server action is only referenced, never invoked
// in these render assertions.
vi.mock("./actions", () => ({
  runMigrations: vi.fn(),
}));

describe("RunMigrationsButton", () => {
  it("does NOT hide the button and leaves the run action available when status is unknown (null)", () => {
    const html = renderToStaticMarkup(
      <RunMigrationsButton pendingCount={null} />,
    );

    expect(html).toBeTruthy();
    expect(html).toContain("Run");
    expect(html).toContain("button");
  });

  it("does not fabricate a count when the status is unknown", () => {
    const html = renderToStaticMarkup(
      <RunMigrationsButton pendingCount={null} />,
    );

    expect(html).not.toMatch(/Run\s+\d+/);
  });

  it("hides the control on a verified 0 pending migrations", () => {
    const html = renderToStaticMarkup(<RunMigrationsButton pendingCount={0} />);

    expect(html).toBe("");
  });

  it("labels the run action with a real count when the count is known", () => {
    const html = renderToStaticMarkup(<RunMigrationsButton pendingCount={3} />);

    expect(html).toContain("Run 3 migrations");
  });
});
