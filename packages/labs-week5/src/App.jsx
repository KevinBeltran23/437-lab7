import { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";

// Initial task list as objects
const INITIAL_TASK_LIST = [
  { id: nanoid(), name: "Eat", completed: false },
  { id: nanoid(), name: "Sleep", completed: false },
  { id: nanoid(), name: "Repeat", completed: false },
];

Todo.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

AddTaskForm.propTypes = {
  onNewTask: PropTypes.func.isRequired,
};

function AddTaskForm({ onNewTask }) {
  const [taskName, setTaskName] = useState("");

  function handleSubmit() {
    if (!taskName.trim()) return;
    onNewTask(taskName);
    setTaskName("");
  }

  return (
    <div>
      <input
        className="flex-1 p-2 mr-2 mb-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="New task name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        onClick={handleSubmit}
      >
        Add task
      </button>
    </div>
  );
}

function Todo({ id, name, completed, onToggle, onDelete }) {
  return (
    <li className="flex justify-start">
      <label>
        <input
          type="checkbox"
          className="mr-2"
          checked={completed}
          onChange={() => onToggle(id)}
        />
        {name}
      </label>
      <div>
        <button
          className="ml-4 text-gray-500 hover:text-gray-700"
          title="Delete item"
          onClick={() => onDelete(id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </li>
  );
}

function Modal({ isOpen, headerLabel, onCloseRequested, children }) {
  const modalRef = useRef(null);

  if (!isOpen) return null;

  function handleOverlayClick(event) {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onCloseRequested();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex justify-center items-center"
      onClick={handleOverlayClick}
    >
      <div ref={modalRef} className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">{headerLabel}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
            onClick={onCloseRequested}
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  headerLabel: PropTypes.string.isRequired,
  onCloseRequested: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

function App() {
  const [taskList, setTaskList] = useState(INITIAL_TASK_LIST);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function addTask(name) {
    const newTask = { id: nanoid(), name, completed: false };
    setTaskList([...taskList, newTask]);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = taskList.map((task) =>
      id === task.id ? { ...task, completed: !task.completed } : task
    );
    setTaskList(updatedTasks);
  }

  function deleteTask(id) {
    const updatedTasks = taskList.filter((task) => task.id !== id);
    setTaskList(updatedTasks);
  }

  return (
    <main className="m-8">
      <AddTaskForm onNewTask={addTask} />
      <section className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">To do</h1>
        <ul className="mt-4 space-y-4">
          {taskList.map((task) => (
            <Todo
              key={task.id}
              id={task.id}
              name={task.name}
              completed={task.completed}
              onToggle={toggleTaskCompleted}
              onDelete={deleteTask}
            />
          ))}
        </ul>
        <button
          className="self-start bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={openModal}
        >
          Modal Add Task
        </button>
        <Modal
          headerLabel="New Task"
          isOpen={isModalOpen}
          onCloseRequested={closeModal}
        >
          <AddTaskForm onNewTask={addTask} />
        </Modal>
      </section>
    </main>
  );
}

export default App;
