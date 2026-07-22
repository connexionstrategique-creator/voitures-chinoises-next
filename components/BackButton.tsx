"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        textDecoration: "none", fontSize: 15, color: "rgba(255,255,255,0.6)",
        display: "inline-block", letterSpacing: "0.06em",
      }}
    >
      ← retour
    </button>
  );
}
