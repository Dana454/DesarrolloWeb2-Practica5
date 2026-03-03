import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskById, updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { formatDateTime, getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskForm from '../../components/tasks/TaskForm';
import toast from 'react-hot-toast';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const loadTask = async () => {
    setLoading(true);
    const result = await getTaskById(taskId);

    if (result.success) {
      setTask(result.task);
    } else {
      toast.error('Error al cargar la tarea');
      navigate('/dashboard');
    }

    setLoading(false);
  };

  const handleToggleComplete = async () => {
    const result = await updateTask(taskId, {
      completed: !task.completed
    });

    if (result.success) {
      const updatedTask = { ...task, completed: !task.completed };
      setTask(updatedTask);

      toast.success(
        updatedTask.completed
          ? 'Tarea marcada como completada'
          : 'Tarea marcada como pendiente'
      );
    } else {
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      const result = await deleteTask(taskId);

      if (result.success) {
        toast.success('Tarea eliminada correctamente');
        navigate('/dashboard');
      } else {
        toast.error('Error al eliminar la tarea');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!task) {
    return null;
  }

  if (editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TaskForm
          taskToEdit={task}
          onClose={() => {
            setEditing(false);
            loadTask();
          }}
        />
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === task.category);
  const priority = PRIORITIES.find(p => p.id === task.priority);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          Volver al Dashboard
        </Link>
      </div>

      <div className="card">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {task.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${priority?.color}-100 text-${priority?.color}-800`}>
                {category?.label}
              </span>

              <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${priority?.color}-100 text-${priority?.color}-800`}>
                {priority?.label}
              </span>

              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                task.completed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.completed ? 'Completada' : 'Pendiente'}
              </span>

              {task.dueDate && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isOverdue(task.dueDate, task.completed)
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  Vence: {getDueDateLabel(task.dueDate)}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="btn-secondary"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Eliminar
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Descripción
          </h2>
          <p className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
            {task.description || 'Sin descripción'}
          </p>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Información adicional
          </h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Creada
              </dt>
              <dd className="text-gray-900 dark:text-gray-100">
                {formatDateTime(task.createdAt)}
              </dd>
            </div>

            {task.dueDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Fecha de vencimiento
                </dt>
                <dd className="text-gray-900 dark:text-gray-100">
                  {formatDateTime(task.dueDate)}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <div className="border-t pt-6 mt-6">
          <button
            onClick={handleToggleComplete}
            className={task.completed ? 'btn-secondary w-full' : 'btn-primary w-full'}
          >
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          </button>
        </div>
      </div>
    </div>
  );
}