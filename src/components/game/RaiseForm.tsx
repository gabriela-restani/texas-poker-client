import React from 'react';
import { UiButton } from '@/components/ui/UiButton';

export function RaiseForm({ onSubmit }: { onSubmit: (amount: number) => void }) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = Number(formData.get('raise-amount'));
    onSubmit(amount);
  }
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Raise Amount</h2>
      <form
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label htmlFor="raise-amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount to Raise
          </label>
          <input
            type="number"
            id="raise-amount"
            name="raise-amount"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
          />
        </div>
        <UiButton
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit Raise
        </UiButton>
      </form>
    </div>
  );
}