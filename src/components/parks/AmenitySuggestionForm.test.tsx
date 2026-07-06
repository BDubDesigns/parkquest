import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/parks/[slug]/actions", () => ({
  submitAmenitySuggestion: vi.fn(async () => ({ error: null, success: true })),
}));

import AmenitySuggestionForm from "./AmenitySuggestionForm";

const amenities = [
  { id: "playground", name: "Playground" },
  { id: "restrooms", name: "Restrooms" },
  { id: "picnic", name: "Picnic tables" },
];

let container: HTMLDivElement;
let root: Root;

function renderForm(verifiedAmenityIds = ["playground"]) {
  act(() => {
    root.render(
      <AmenitySuggestionForm
        parkSlug="test-park"
        amenities={amenities}
        verifiedAmenityIds={verifiedAmenityIds}
        userSuggestions={[]}
      />,
    );
  });
}

function optionLabels() {
  const amenitySelect = container.querySelector<HTMLSelectElement>(
    "select[name='amenityId']",
  );
  return Array.from(amenitySelect?.options ?? []).map((option) => option.text);
}

describe("AmenitySuggestionForm", () => {
  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it("renders the correction form collapsed by default", () => {
    renderForm();

    expect(container.textContent).toContain("Add missing amenity");
    expect(container.textContent).toContain("Report incorrect amenity");
    expect(container.querySelector("form")).toBeNull();
    expect(container.querySelector("#amenity-correction-panel")).toBeNull();
  });

  it("expands the form in place from a correction CTA", () => {
    renderForm();
    const addButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Add missing amenity",
    );

    act(() => addButton?.click());

    expect(container.querySelector("#amenity-correction-panel")).not.toBeNull();
    expect(container.querySelector("form")).not.toBeNull();
    expect(container.textContent).toContain(
      "Suggestions only create a pending review",
    );
  });

  it("only offers not-currently-listed amenities in add mode", () => {
    renderForm(["playground"]);
    const addButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Add missing amenity",
    );

    act(() => addButton?.click());

    expect(optionLabels()).toEqual(["Restrooms", "Picnic tables"]);
  });

  it("only offers currently listed amenities in report/remove mode", () => {
    renderForm(["playground", "picnic"]);
    const removeButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Report incorrect amenity",
    );

    act(() => removeButton?.click());

    expect(optionLabels()).toEqual(["Playground", "Picnic tables"]);
  });

  it("shows the user's prior suggestions only after expansion", () => {
    act(() => {
      root.render(
        <AmenitySuggestionForm
          parkSlug="test-park"
          amenities={amenities}
          verifiedAmenityIds={["playground"]}
          userSuggestions={[
            {
              id: "suggestion-1",
              amenityName: "Restrooms",
              suggestionType: "add",
              status: "pending",
              createdAt: "2026-07-06T12:00:00.000Z",
            },
          ]}
        />,
      );
    });

    expect(container.textContent).not.toContain(
      "Your suggestions for this park",
    );
    const addButton = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Add missing amenity",
    );
    act(() => addButton?.click());

    expect(container.textContent).toContain("Your suggestions for this park");
    expect(container.textContent).toContain("Add Restrooms");
    expect(container.textContent).toContain("pending");
  });
});
