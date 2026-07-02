"use client";

import { useActionState, useRef, useState } from "react";
import { setNickname, type NicknameState } from "@/app/parks/[slug]/actions";
import {
  ctaGhost,
  ctaPrimary,
  ctaSecondary,
  formInput,
  formLabel,
  mutedText,
} from "@/components/ui/styles";

const initialState: NicknameState = { error: null, success: false };

interface Props {
  parkSlug: string;
  parkName: string;
  currentNickname: string | null;
}

export default function NicknameForm({
  parkSlug,
  parkName,
  currentNickname,
}: Props) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nicknameAction = setNickname.bind(null, parkSlug);
  const [state, formAction] = useActionState(nicknameAction, initialState);

  if (state.success && editing) {
    setEditing(false);
  }

  function handleRemove() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    const form = inputRef.current?.closest("form");
    form?.requestSubmit();
  }

  return (
    <section className="mt-6">
      {!editing ? (
        <div>
          <button
            onClick={() => setEditing(true)}
            className={`min-h-11 text-sm ${currentNickname ? ctaGhost : ctaSecondary}`}
          >
            {currentNickname ? "Edit nickname" : "Add a family nickname"}
          </button>
        </div>
      ) : (
        <form action={formAction} className="space-y-3">
          {state.error && (
            <p className="rounded-md bg-red-900/30 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}
          <label className="flex flex-col gap-1 text-sm">
            <span className={formLabel}>Family nickname for {parkName}</span>
            <input
              ref={inputRef}
              type="text"
              name="nickname"
              defaultValue={currentNickname ?? ""}
              maxLength={255}
              placeholder="e.g. Duck Bridge Park"
              className={`min-h-11 w-full ${formInput}`}
              autoFocus
            />
            <span className={`text-xs ${mutedText}`}>
              Private to your family. Other families won&apos;t see it.
            </span>
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className={`min-h-11 ${ctaPrimary}`}>
              {currentNickname ? "Save" : "Add nickname"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className={`min-h-11 ${ctaGhost}`}
            >
              Cancel
            </button>
            {currentNickname && (
              <button
                type="button"
                onClick={handleRemove}
                className={`min-h-11 text-sm ${ctaGhost}`}
              >
                Remove nickname
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  );
}
