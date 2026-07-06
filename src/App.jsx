import React, { useState, useEffect } from 'react';

const ChecklistApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Save tasks
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Theme toggle
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now(),
        text: newTask.trim(),
        completed: false
      }]);
      setNewTask('');
    }
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editingId !== null && editText.trim()) {
      setTasks(tasks.map(task =>
        task.id === editingId ? { ...task, text: editText.trim() } : task
      ));
    }
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 py-12 px-4 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <span className="text-white text-3xl">✅</span>
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-white">Checklist</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Stay organized, stay productive</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-3 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm hover:shadow transition-all active:scale-95"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Progress Bar */}
        {tasks.length > 0 && (
          <div className="mb-8 bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-xl">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
              <span className="font-medium text-zinc-900 dark:text-white">{completedCount}/{tasks.length}</span>
            </div>
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Add New Task */}
        <form onSubmit={addTask} className="mb-8 flex gap-3">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl focus:outline-none focus:border-purple-500 text-lg placeholder-zinc-400 dark:placeholder-zinc-500 shadow-sm"
          />
          <button
            type="submit"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-3xl flex items-center gap-2 transition-all active:scale-[0.985] shadow-lg shadow-purple-500/30"
          >
            ➕ Add
          </button>
        </form>

        {/* Filters */}
        {tasks.length > 0 && (
          <div className="flex gap-2 mb-6 justify-center">
            {['all', 'active', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-2xl text-sm font-medium transition-all capitalize ${
                  filter === f 
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow' 
                    : 'bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-transparent'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl rounded-3xl p-16 text-center border border-zinc-100 dark:border-zinc-800">
              <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-4xl">
                📋
              </div>
              <p className="text-xl text-zinc-400 dark:text-zinc-500">No tasks here yet</p>
              <p className="text-zinc-400 mt-2">Add some above to get started ✨</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div 
                key={task.id}
                className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleComplete(task.id)}
                  className={`w-7 h-7 rounded-xl border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                    task.completed 
                      ? 'bg-purple-600 border-purple-600' 
                      : 'border-zinc-300 dark:border-zinc-600 hover:border-purple-400'
                  }`}
                >
                  {task.completed && <span className="text-white text-sm">✓</span>}
                </button>

                {editingId === task.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 px-4 py-2 bg-white dark:bg-zinc-800 border border-purple-300 dark:border-purple-700 rounded-2xl focus:outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEdit();
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <button onClick={saveEdit} className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-xl">✓</button>
                    <button onClick={cancelEdit} className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-xl">✕</button>
                  </div>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className={`text-lg transition-all ${task.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                      {task.text}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startEdit(task.id, task.text)}
                    className="p-3 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950 rounded-2xl transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-3 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 rounded-2xl transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {tasks.length > 0 && (
          <div className="mt-10 flex justify-between items-center text-sm text-zinc-500 dark:text-zinc-400">
            <div>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</div>
            {completedCount > 0 && (
              <button 
                onClick={clearCompleted}
                className="hover:text-red-500 transition-colors flex items-center gap-1.5"
              >
                🗑️ Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChecklistApp;