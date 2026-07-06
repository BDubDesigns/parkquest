"use client";

import { useActionState, useRef, useState } from "react";
import { setNickname, type NicknameState } from "@/app/parks/[slug]/actions";
import {
  actionGhost,
  actionPrimary,
  actionSecondary,
  fieldInput,
  fieldLabel,
  mutedTextDaylight,
} from "@/components/ui/styles";

const initialState: NicknameState = { error: null, success: false };

interface Props {
  parkSlug: string;
  parkName: string;
  currentNickname: string | null;
}

export default function NicknameForm(props: Props) {
  return (
    <NicknameFormInner
      key={`${props.parkSlug}-${props.currentNickname ?? ""}`}
      {...props}
    />
  );
}

function NicknameFormInner({ parkSlug, parkName, currentNickname }: Props) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nicknameAction = setNickname.bind(null, parkSlug);
  const [state, formAction] = useActionState(nicknameAction, initialState);

  if (!editing || state.success) {
    return (
      <section className="mt-6">
        <button
          onClick={() => setEditing(true)}
          className={currentNickname ? actionGhost : actionSecondary}
        >
          {currentNickname ? "Edit nickname" : "Add a family nickname"}
        </button>
      </section>
    );
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
      <form action={formAction} className="space-y-3">
        {state.error && (
          <p
            role="alert"
            className="rounded-control bg-danger/8 px-3 py-2 text-sm font-medium text-danger"
          >
            {state.error}
          </p>
        )}
        <label className="flex flex-col gap-1 text-sm">
          <span className={fieldLabel}>Family nickname for {parkName}</span>
          <input
            ref={inputRef}
            type="text"
            name="nickname"
            defaultValue={currentNickname ?? ""}
            maxLength={255}
            placeholder="e.g. Duck Bridge Park"
            className={`w-full ${fieldInput}`}
            autoFocus
          />
          <span className={`text-xs ${mutedTextDaylight}`}>
            Private to your family. Other families won&apos;t see it.
          </span>
        </label>
        <div className="flex flex-wrap gap-3">
          <button type="submit" className={actionPrimary}>
            {currentNickname ? "Save" : "Add nickname"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={actionGhost}
          >
            Cancel
          </button>
          {currentNickname && (
            <button
              type="button"
              onClick={handleRemove}
              className={`${actionGhost} text-danger hover:bg-danger/8`}
            >
              Remove nickname
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
