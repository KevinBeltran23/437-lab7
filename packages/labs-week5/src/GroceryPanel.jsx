import { useState } from "react";
import { Spinner } from "./Spinner.jsx";

const MDN_URL =
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json";

function delayMs(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function GroceryPanel({ onAddTask }) {
  const [groceryData, setGroceryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function fetchData(url) {
    try {
      setIsLoading(true);
      setGroceryData([]);
      console.log("Fetching data from " + url);

      await delayMs(2000);

      if (!url) {
        setError(null);
        return;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      setGroceryData(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(true);
    } finally {
      setIsLoading(false);
    }
  }

  function handleDropdownChange(event) {
    const selectedUrl = event.target.value;
    setGroceryData([]);
    if (selectedUrl) {
      fetchData(selectedUrl !== "invalid" ? selectedUrl : "invalid-url");
    } else {
      setError(null);
    }
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
          disabled={isLoading}
          onChange={handleDropdownChange}
        >
          <option value="">(None selected)</option>
          <option value={MDN_URL}>MDN</option>
          <option value="invalid">Who knows?</option>
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
