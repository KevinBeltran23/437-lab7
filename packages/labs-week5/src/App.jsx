import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

function AddTaskForm() {
  return (
    <div>
      <input
        className="flex-1 p-2 mr-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="New task name"
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
        Add task
      </button>
    </div>
  );
}

function Todo(props) {
  const trashIcon = <FontAwesomeIcon icon={faTrash} />;

  return (
    <li className="flex justify-start">
      <label>
        <input type="checkbox" /> {props.name}
      </label>
      <div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700"
          title="delete item"
        >
          {trashIcon}
        </button>
      </div>
    </li>
  );
}

Todo.propTypes = {
  name: PropTypes.string.isRequired, // name should be a required string
};

function App() {
  return (
    <main className="m-8">
      {/* Tailwind: margin level 4 on all sides */}
      <AddTaskForm />
      <section>
        <h1 className="text-xl font-bold">To do</h1>
        <ul className="mt-4 space-y-4">
          <Todo name="Eat"></Todo>
          <Todo name="Sleep"></Todo>
          <Todo name="Repeat"></Todo>
        </ul>
      </section>
    </main>
  );
}

export default App;
