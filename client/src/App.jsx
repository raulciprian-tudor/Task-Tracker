import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

const STATUS_CONFIG = {
    todo: { label: "To do", dot: "bg-stone-300", badge: "bg-stone-100 text-stone-500" },
    "in-progress": { label: "In progress", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
    done: { label: "Done", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
}

const MOCK_TASKS = [
    { id: 1, description: "Design the new landing page layout", status: "done", createdAt: "2025-04-20T09:00:00Z", updatedAt: "2025-04-22T14:30:00Z" },
    { id: 2, description: "Set up Express REST API with CRUD endpoints", status: "in-progress", createdAt: "2025-04-23T10:00:00Z", updatedAt: "2025-04-25T11:00:00Z" },
    { id: 3, description: "Write unit tests for task controller", status: "todo", createdAt: "2025-04-24T08:00:00Z", updatedAt: "2025-04-24T08:00:00Z" },
    { id: 4, description: "Integrate Tailwind CSS into the frontend", status: "done", createdAt: "2025-04-21T12:00:00Z", updatedAt: "2025-04-21T16:00:00Z" },
    { id: 5, description: "Connect frontend to backend API", status: "todo", createdAt: "2025-04-25T09:00:00Z", updatedAt: "2025-04-25T09:00:00Z" },
    { id: 6, description: "Configure CORS and environment variables", status: "in-progress", createdAt: "2025-04-26T10:00:00Z", updatedAt: "2025-04-27T15:00:00Z" },
    { id: 7, description: "Add pagination to task list endpoint", status: "todo", createdAt: "2025-04-27T09:00:00Z", updatedAt: "2025-04-27T09:00:00Z" },
    { id: 8, description: "Deploy backend to Railway", status: "todo", createdAt: "2025-04-28T10:00:00Z", updatedAt: "2025-04-28T10:00:00Z" },
]

const FILTERS = [
    { label: "All", value: "all" },
    { label: "To do", value: "todo" },
    { label: "In progress", value: "in-progress" },
    { label: "Done", value: "done" },
]

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function TaskCard({ task }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const config = STATUS_CONFIG[task.status]

    return (
        <div className="relative group bg-white border border-stone-100 rounded-xl px-5 py-4 hover:border-stone-200 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 border-stone-200 hover:border-stone-400 transition-colors duration-150 cursor-pointer flex items-center justify-center">
                        {task.status === "done" && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                    <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${task.status === "done" ? "line-through text-stone-400" : "text-stone-800"}`}>
                            {task.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  {config.label}
              </span>
                            <span className="text-xs text-stone-400">Updated {formatDate(task.updatedAt)}</span>
                        </div>
                    </div>
                </div>

                <div className="relative flex-shrink-0">
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-all duration-150 cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="2.5" r="1" fill="#9ca3af" />
                            <circle cx="7" cy="7" r="1" fill="#9ca3af" />
                            <circle cx="7" cy="11.5" r="1" fill="#9ca3af" />
                        </svg>
                    </button>
                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-8 z-20 bg-white border border-stone-100 rounded-xl shadow-lg py-1 w-40"
                            >
                                {["Mark to do", "Mark in progress", "Mark done"].map((action) => (
                                    <button key={action} onClick={() => setMenuOpen(false)}
                                            className="w-full text-left text-sm text-stone-600 hover:bg-stone-50 px-3 py-2 transition-colors cursor-pointer">
                                        {action}
                                    </button>
                                ))}
                                <div className="h-px bg-stone-100 my-1" />
                                <button onClick={() => setMenuOpen(false)}
                                        className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-3 py-2 transition-colors cursor-pointer">
                                    Delete
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

function Sidebar({ tasks, filter, setFilter, onAdd }) {
    const count = (val) => val === "all" ? tasks.length : tasks.filter(t => t.status === val).length
    const done = tasks.filter(t => t.status === "done").length
    const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

    return (
        <aside className="w-56 xl:w-64 flex-shrink-0">
            <div className="sticky top-20 flex flex-col gap-3">
                <div className="bg-white border border-stone-100 rounded-2xl p-4">
                    <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-3">Overview</p>
                    <div className="flex flex-col gap-0.5">
                        {FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer ${
                                    filter === f.value
                                        ? "bg-stone-900 text-white"
                                        : "text-stone-600 hover:bg-stone-50"
                                }`}
                            >
                                <span>{f.label}</span>
                                <span className={`text-xs font-medium tabular-nums ${filter === f.value ? "text-stone-300" : "text-stone-400"}`}>
                  {count(f.value)}
                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-stone-400">Completion</span>
                            <span className="text-xs font-medium text-stone-600 tabular-nums">{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-stone-900 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAdd}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-stone-900 text-white px-4 py-2.5 rounded-xl hover:bg-stone-700 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Add task
                </button>
            </div>
        </aside>
    )
}

function AddTaskModal({ onClose }) {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            >
                <div className="bg-white rounded-2xl border border-stone-100 shadow-xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-50">
                        <h2 className="text-base font-medium text-stone-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>New task</h2>
                        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer text-stone-400">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1.5">Description</label>
                            <textarea placeholder="What needs to be done?" rows={3}
                                      className="w-full text-sm text-stone-800 placeholder:text-stone-300 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-stone-300 focus:bg-white transition-all duration-150" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1.5">Status</label>
                            <select className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-stone-300 transition-all cursor-pointer">
                                <option value="todo">To do</option>
                                <option value="in-progress">In progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                    </div>
                    <div className="px-6 pb-5 flex gap-2 justify-end">
                        <button onClick={onClose} className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2 rounded-xl hover:bg-stone-50 transition-all cursor-pointer">Cancel</button>
                        <button className="text-sm font-medium bg-stone-900 text-white px-5 py-2 rounded-xl hover:bg-stone-700 active:scale-95 transition-all cursor-pointer">Add task</button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}

function EmptyState({ filter }) {
    const msgs = {
        all: { heading: "No tasks yet", sub: "Add your first task to get started." },
        todo: { heading: "Nothing to do", sub: "All caught up — or add something new." },
        "in-progress": { heading: "Nothing in progress", sub: "Start working on a task to see it here." },
        done: { heading: "Nothing done yet", sub: "Completed tasks will appear here." },
    }
    const { heading, sub } = msgs[filter] || msgs.all
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="5" width="14" height="2" rx="1" fill="#d6d3d1" />
                    <rect x="3" y="9" width="10" height="2" rx="1" fill="#d6d3d1" />
                    <rect x="3" y="13" width="7" height="2" rx="1" fill="#d6d3d1" />
                </svg>
            </div>
            <p className="text-sm font-medium text-stone-700 mb-1">{heading}</p>
            <p className="text-sm text-stone-400">{sub}</p>
        </motion.div>
    )
}

export default function App() {
    const [tasks] = useState(MOCK_TASKS)
    const [filter, setFilter] = useState("all")
    const [isModalOpen, setIsModalOpen] = useState(false)

    const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter)

    return (
        <div className="min-h-screen bg-[#FAFAF8]">

            <motion.header
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white border-b border-stone-100 sticky top-0 z-10"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <div className="flex items-center gap-3">
              <span className="text-xl sm:text-[22px] tracking-tight font-medium text-stone-800" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                Tasks
              </span>
                            <span className="text-xs font-medium bg-stone-100 text-stone-500 rounded-full px-2 py-0.5 tabular-nums">
                {tasks.length}
              </span>
                        </div>

                        {/* Add button — mobile/tablet only, sidebar has it on desktop */}
                        <button onClick={() => setIsModalOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 text-sm font-medium bg-stone-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-stone-700 active:scale-95 transition-all duration-150 cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                            <span className="hidden sm:inline">Add task</span>
                        </button>
                    </div>

                    {/* Filter tabs — mobile/tablet only */}
                    <nav className="flex gap-0 -mb-px lg:hidden overflow-x-auto">
                        {FILTERS.map((f) => (
                            <button key={f.value} onClick={() => setFilter(f.value)}
                                    className={`relative flex-shrink-0 text-sm px-4 py-3 transition-colors duration-150 cursor-pointer ${filter === f.value ? "text-stone-900 font-medium" : "text-stone-400 hover:text-stone-600"}`}>
                                {f.label}
                                {filter === f.value && (
                                    <motion.div layoutId="active-filter"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </motion.header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
                <div className="flex gap-8 xl:gap-12 items-start">

                    {/* Sidebar — desktop only */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="hidden lg:block"
                    >
                        <Sidebar tasks={tasks} filter={filter} setFilter={setFilter} onAdd={() => setIsModalOpen(true)} />
                    </motion.div>

                    {/* Task list */}
                    <div className="flex-1 min-w-0">
                        <div className="hidden lg:flex items-center justify-between mb-5">
                            <h2 className="text-sm font-medium text-stone-500">
                                {filter === "all" ? "All tasks" : FILTERS.find(f => f.value === filter)?.label}
                                <span className="ml-2 tabular-nums text-stone-300">{filtered.length}</span>
                            </h2>
                        </div>

                        <AnimatePresence mode="wait">
                            {filtered.length === 0 ? (
                                <EmptyState key="empty" filter={filter} />
                            ) : (
                                <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-2">
                                    {filtered.map((task, i) => (
                                        <motion.div key={task.id}
                                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                                    transition={{ duration: 0.3, delay: i * 0.05 }}>
                                            <TaskCard task={task} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>
        </div>
    )
}