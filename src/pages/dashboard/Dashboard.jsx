import { useAuthStore } from '../../store/authStore';
import { useTaskStore } from '../../store/taskStore';
import { useTasks } from '../../hooks/useTasks';
import TaskFilters from '../../components/tasks/TaskFilters';
import TaskList from '../../components/tasks/TaskList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import TaskStats from '../../components/tasks/TaskStats';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const {
    tasks,
    currentFilter,
    currentCategory,
    searchQuery,
    loading
  } = useTaskStore();

  useTasks();

  const filteredTasks = tasks.filter((task) => {
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(query);
      const descriptionMatch = task.description?.toLowerCase().includes(query);
      if (!titleMatch && !descriptionMatch) return false;
    }

    if (currentFilter === 'completed' && !task.completed) return false;
    if (currentFilter === 'pending' && task.completed) return false;

    if (currentCategory !== 'all' && task.category !== currentCategory)
      return false;

    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Bienvenido, {user?.displayName || 'Usuario'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Tienes {tasks.filter((t) => !t.completed).length} tareas pendientes
        </p>
      </div>

      <TaskStats/>
      <TaskFilters />

      <TaskList tasks={filteredTasks} />
    </div>
  );
}