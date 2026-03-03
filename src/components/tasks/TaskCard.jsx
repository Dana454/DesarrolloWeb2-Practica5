import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';

export default function TaskCard({ task }) {
  const category = CATEGORIES.find(c => c.id === task.category);

  const handleToggleComplete = async (e) => {
    e.preventDefault(); // Evita que navegue al hacer click

    await updateTask(task.id, {
      ...task,
      completed: !task.completed
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault(); // Evita navegación

    const confirmDelete = window.confirm('¿Estás seguro de eliminar esta tarea?');
    if (!confirmDelete) return;

    await deleteTask(task.id);
  };

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div
        className={`card hover:shadow-lg transition-shadow
          ${task.completed ? 'opacity-60' : ''}
          ${!task.completed && isOverdue(task.dueDate) ? 'border border-red-500' : ''}
        `}
      >
        {/* Header: título y estado */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {task.title}
          </h3>

          <span className={`text-sm font-medium ${task.completed ? 'text-green-600' : 'text-yellow-600'}`}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </span>
        </div>

        {/* Descripción (si existe) */}
        {task.description && (
          <p className="text-gray-800 mb-3 dark:text-gray-200">
            {task.description}
          </p>
        )}

        {/* Categoría y fecha */}
        <div className="flex justify-between items-center mb-4">
          {category && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium
                bg-${category.color}-100 text-${category.color}-800`}
            >
              {category.label}
            </span>
          )}

          {task.dueDate && (
            <span
              className={`text-sm ${
                !task.completed && isOverdue(task.dueDate)
                  ? 'text-red-600 font-medium'
                  : 'text-gray-500'
              }`}
            >
              {getDueDateLabel(task.dueDate)}
            </span>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <button
            onClick={handleToggleComplete}
            className={`px-3 py-1 rounded-lg text-sm font-medium ${
              task.completed
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {task.completed ? 'Marcar pendiente' : 'Marcar completada'}
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </Link>
  );
}