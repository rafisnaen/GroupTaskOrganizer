"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  UserPlus, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Plus, 
  ChevronRight, 
  User as UserIcon 
} from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: "todo" | "progress" | "done";
  deadline: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const [userForm, setUserForm] = useState({ name: "", email: "", role: "" });
  const [taskForm, setTaskForm] = useState({ title: "", description: "", deadline: "", status: "todo" });

  const API_URL = "http://localhost:8080";

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error("Gagal ambil user", err);
    }
  };

  const selectUser = async (user: User) => {
    setSelectedUser(user);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${user.id}/tasks`);
      const data = await res.json();
      setTasks(data || []);
    } catch (err) {
      console.error("Gagal ambil tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userForm),
    });
    setUserForm({ name: "", email: "", role: "" });
    fetchUsers();
  };

  const handleDeleteUser = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Hapus user ini?")) return;
    
    await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    fetchUsers();
    if (selectedUser?.id === id) {
      setSelectedUser(null);
      setTasks([]);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    await fetch(`${API_URL}/users/${selectedUser.id}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(taskForm),
    });
    setTaskForm({ title: "", description: "", deadline: "", status: "todo" });
    selectUser(selectedUser);
  };

  const handleDeleteTask = async (id: number) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    if (selectedUser) selectUser(selectedUser);
  };

  const handleUpdateStatus = async (task: Task, newStatus: string) => {
    await fetch(`${API_URL}/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: newStatus }),
    });
    if (selectedUser) selectUser(selectedUser);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "done": return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] 
        font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 font-sans"><CheckCircle size={10}/> Done</span>;
      case "progress": return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] 
        font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 font-sans"><Clock size={10}/> Progress</span>;
      default: return <span className="bg-slate-500/10 text-slate-400 border border-slate-500/20 text-[10px] 
        font-bold uppercase tracking-wider px-2 py-1 rounded-full flex items-center gap-1 font-sans"><AlertCircle size={10}/> Todo</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0C15] text-slate-300 p-6 font-(family-name:--font-outfit)">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 pt-4">
          <h1 className="text-4xl md:text-5xl font-bold font-(family-name:--font-space) text-white mb-2 tracking-tight">
            Group Task <span className="text-indigo-500">Organizer</span>.
          </h1>
          <p className="text-slate-500 text-lg font-light">
           GDGOC backend final submission!!!!!!
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#12141F] p-6 rounded-2xl border border-slate-800/60 shadow-xl">
              <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-white font-(family-name:--font-space)">
                <UserPlus size={22} className="text-indigo-500" /> New Member
              </h2>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Name</label>
                    <input required placeholder="e.g. John Doe" className="w-full bg-[#0B0C15] border 
                      border-slate-700/50 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 
                      focus:ring-indigo-500/50 outline-none transition" 
                      value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email</label>
                    <input required placeholder="john@example.com" className="w-full bg-[#0B0C15] border 
                      border-slate-700/50 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 
                      outline-none transition" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Role</label>
                    <input required placeholder="e.g. Backend Dev" className="w-full bg-[#0B0C15] border border-slate-700/50 rounded-xl p-3 text-sm 
                      focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 outline-none transition" 
                      value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl 
                  transition shadow-[0_4px_14px_0_rgba(99,102,241,0.39)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.23)] hover:-translate-y-0.5 transform">
                  Add Member
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest pl-1 font-(family-name:--font-space)">Team Members</h3>
              {users.map((user) => (
                <div 
                  key={user.id}
                  onClick={() => selectUser(user)}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-300 flex justify-between items-center group
                    ${selectedUser?.id === user.id 
                      ? "bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.15)]" 
                      : "bg-[#161826] border-slate-800/50 hover:bg-[#1E2130] hover:border-slate-700"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg font-(family-name:--font-space)
                        ${selectedUser?.id === user.id ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}
                    `}>
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className={`font-semibold ${selectedUser?.id === user.id ? "text-white" : "text-slate-200"}`}>{user.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{user.role}</p>
                    </div>
                  </div>
                  <button onClick={(e) => handleDeleteUser(user.id, e)} className="p-2 text-slate-600 hover:text-red-400 
                      hover:bg-red-500/10 rounded-lg transition opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8">
            {selectedUser ? (
              <div className="bg-[#12141F] min-h-150 rounded-3xl border border-slate-800/60 p-8 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-2 font-(family-name:--font-space)">
                      {selectedUser.name}'s Tasks
                    </h2>
                    <p className="text-slate-500 font-medium">{selectedUser.email}</p>
                  </div>
                  <div className="bg-[#0B0C15] px-4 py-2 rounded-xl text-xs font-mono text-slate-400 border border-slate-800">
                    USER_ID: {selectedUser.id}
                  </div>
                </div>

                <form onSubmit={handleAddTask} className="mb-8 bg-[#0B0C15] p-2 rounded-2xl border 
                  border-slate-800 flex flex-col md:flex-row gap-2 shadow-inner">
                  <div className="flex-1 flex flex-col justify-center px-4 py-2">
                    <input required placeholder="What needs to be done?" className="bg-transparent text-white 
                    placeholder:text-slate-600 outline-none font-medium" 
                      value={taskForm.title} onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })} />
                    <input placeholder="Description..." className="bg-transparent text-sm text-slate-500 placeholder:text-slate-700 outline-none" 
                      value={taskForm.description} onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2 p-2">
                     <input type="date" required className="bg-[#161826] border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-3 outline-none 
                      focus:border-indigo-500" 
                      value={taskForm.deadline} onChange={(e) => setTaskForm({ ...taskForm, deadline: e.target.value })} />
                    <button type="submit" className="bg-white text-black hover:bg-slate-200 px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition">
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </form>

                {loading ? (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-600 animate-pulse">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-indigo-500 animate-spin mb-4"></div>
                      <p>Fetching tasks...</p>
                   </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.length === 0 && (
                       <div className="text-center py-20 border-2 border-dashed border-slate-800/50 rounded-3xl text-slate-600">
                          <p className="font-(family-name:--font-space) text-lg mb-1">No tasks yet.</p>
                          <p className="text-sm">Create one above to get started.</p>
                       </div>
                    )}
                    
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-[#161826] border border-slate-800/50 p-5 rounded-2xl 
                        hover:border-slate-600 transition group flex flex-col sm:flex-row gap-5 justify-between items-start sm:items-center shadow-sm">
                        <div className="flex-1">
                           <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-bold text-slate-200 font-(family-name:--font-space) tracking-tight">{task.title}</h4>
                              {getStatusBadge(task.status)}
                           </div>
                           <p className="text-sm text-slate-400 mb-3 leading-relaxed">{task.description}</p>
                           <p className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">
                             Due: <span className="text-slate-400">{task.deadline}</span>
                           </p>
                        </div>

                        <div className="flex items-center gap-3 bg-[#0B0C15] p-1.5 rounded-xl border border-slate-800">
                           <select 
                                className="bg-transparent text-xs font-semibold text-slate-300 p-2 outline-none cursor-pointer hover:text-white"
                                value={task.status}
                                onChange={(e) => handleUpdateStatus(task, e.target.value)}
                              >
                                <option value="todo" className="text-black bg-white">To Do</option>
                                <option value="progress" className="text-black bg-white">In Progress</option>
                                <option value="done" className="text-black bg-white">Done</option>
                            </select>
                           <div className="w-px h-5 bg-slate-800"></div>
                           <button 
                              onClick={() => handleDeleteTask(task.id)}
                              className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                           >
                              <Trash2 size={16} />
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 border-2 border-dashed 
                border-slate-800/50 rounded-3xl p-10 bg-[#12141F]/50">
                <UserIcon size={64} className="mb-6 opacity-20" />
                <h3 className="text-2xl font-bold text-slate-500 font-(family-name:--font-space)">Select a Team Member</h3>
                <p className="mt-2 text-slate-600">Click on the left panel to manage tasks.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}