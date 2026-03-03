import { useTaskStore } from '../../store/taskStore';
import { isOverdue } from '../../utils/dateHelpers';

export default function TaskStats() {
  const { tasks } = useTaskStore();

  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const pending = tasks.filter((task) => !task.completed).length;
  const overdue = tasks.filter(
    (task) => task.dueDate && isOverdue(task.dueDate, task.completed)
  ).length;

  const completionPercentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
      <div className="card text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Total de tareas
        </p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {total}
        </p>
      </div>

      <div className="card text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Completadas
        </p>
        <p className="text-2xl font-bold text-green-600">
          {completed}
        </p>
      </div>

      <div className="card text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pendientes
        </p>
        <p className="text-2xl font-bold text-yellow-600">
          {pending}
        </p>
      </div>

      <div className="card text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Vencidas
        </p>
        <p className="text-2xl font-bold text-red-600">
          {overdue}
        </p>
      </div>

      <div className="card text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          % Completado
        </p>
        <p className="text-2xl font-bold text-blue-600">
          {completionPercentage}%
        </p>
      </div>
    </div>
  );
}