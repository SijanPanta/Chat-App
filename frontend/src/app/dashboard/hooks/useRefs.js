import { useRef } from "react";

export function useRefs() {
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  return {
    fileInputRef,
    textareaRef
  };
}