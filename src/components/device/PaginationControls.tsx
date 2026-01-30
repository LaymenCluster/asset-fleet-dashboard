type Props = {
  showNext: boolean;
  showPrev: boolean;
  loading: boolean;
  onNext: () => void;
  onPrevious: () => void;
};

export function PaginationControls({
  showNext,
  showPrev,
  loading,
  onNext,
  onPrevious,
}: Props) {
  if (!showNext && !showPrev) return null;

  return (
    <div className="mt-4 flex justify-center gap-2">
      {showPrev && (
        <button
          onClick={onPrevious}
          disabled={loading}
          className="px-4 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-sm disabled:opacity-50"
        >
          Previous
        </button>
      )}

      {showNext && (
        <button
          onClick={onNext}
          disabled={loading}
          className="px-4 py-2 rounded bg-[#374151] hover:bg-[#4b5563] text-sm disabled:opacity-50"
        >
          Next
        </button>
      )}
    </div>
  );
}
