import React, { useState } from "react";

interface SearchInputProps {
  term?: string;
  onSubmit: (data: string) => Promise<void>;
}

export default function SearchInput({ term, onSubmit }: SearchInputProps) {
  const [inputData, setInputData] = useState<string>(term || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (inputData.trim() === "") {
        setError("Please enter a search term");
      } else {
        await onSubmit(inputData);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {
        <form onSubmit={handleSubmit} className="search-form">
          <input
            type="text"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="Search..."
            disabled={isSubmitting}
          />
          <button type="submit" disabled={isSubmitting}>
            Search
          </button>
        </form>
      }
    </>
  );
}
