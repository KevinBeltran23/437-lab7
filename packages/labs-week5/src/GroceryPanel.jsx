import { useState } from "react";
import { Spinner } from "./Spinner.jsx";
import { useGroceryFetch } from "./useGroceryFetch";

export function GroceryPanel({ onAddTask }) {
  const [selectedSource, setSelectedSource] = useState("MDN");
  
  const { groceryData, isLoading, error } = useGroceryFetch(selectedSource);

  function handleDropdownChange(event) {
    setSelectedSource(event.target.value);
  }

  function handleAddTodoClicked(item) {
    const todoName = `Buy ${item.name} (${item.price.toFixed(2)})`;
    onAddTask(todoName);
  }

  return (
    <div>
      <h1 className="text-xl font-bold">Groceries prices today</h1>
      <label className="mb-4 flex gap-4 items-center">
        Get prices from:
        <select
          className="border border-gray-300 p-1 rounded-sm disabled:opacity-50"
          value={selectedSource}
          onChange={handleDropdownChange}
        >
          <option value="MDN">MDN</option>
          <option value="Liquor store">Liquor store</option>
          <option value="Butcher">Butcher</option>
          <option value="whoknows">Who knows?</option>
        </select>
        {isLoading && <Spinner />}
      </label>

      {error && <p className="text-red-500 mt-2">Failed to load data.</p>}

      {groceryData.length > 0 ? (
        <PriceTable items={groceryData} onAddClicked={handleAddTodoClicked} />
      ) : (
        "No data"
      )}
    </div>
  );
}

function PriceTable({ items, onAddClicked }) {
  return (
    <table className="mt-4 p-4">
      <thead>
        <tr>
          <th className="text-left px-4 py-2">Name</th>
          <th className="px-4 py-2">Price</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <PriceTableRow
            key={item.name}
            item={item}
            onAddClicked={() => onAddClicked(item)}
          />
        ))}
      </tbody>
    </table>
  );
}

function PriceTableRow({ item, onAddClicked }) {
  const buttonClasses = `italic px-2 rounded-sm border border-gray-300
        hover:bg-gray-100 active:bg-gray-200 cursor-pointer`;
  return (
    <tr>
      <td className="px-4 py-2">{item.name}</td>
      <td className="px-4 py-2">${item.price.toFixed(2)}</td>
      <td className="px-4 py-2">
        <button className={buttonClasses} onClick={onAddClicked}>
          Add to todos
        </button>
      </td>
    </tr>
  );
}
