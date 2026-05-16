'use client';

export default function PrintButton({ label, className }: { label: string; className?: string }) {
  return (
    <button onClick={() => window.print()} className={className}>
      {label}
    </button>
  );
}
