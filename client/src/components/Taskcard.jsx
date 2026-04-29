import {useState} from "react"
import {motion, AnimatePresence} from "motion/react"

const STATUS_CONFIG = {
    todo: {
        label: "To do",
        dot: "bg-stone-300",
        badge: "bg-stone-100 text-stone-500",
    },
    "in-progress": {
        label: "In progress",
        dot: "bg-amber-400",
        badge: "bg-amber-50 text-amber-700",
    },
    done: {
        label: "Done",
        dot: "bg-emerald-400",
        badge: "bg-emerald-50 text-emerald-700",
    },
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    })
}

export default function TaskCard({task, onTaskDeleted, onStatusUpdated}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const config = STATUS_CONFIG[task.status]

    const handleDelete = async () => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}`, {
                method: 'DELETE'
            })

            onTaskDeleted(task.id)
            setMenuOpen(false)
        } catch (error) {
            console.error('Failed to delete task', error)
        }
    }

    const handleStatusUpdate = async (newStatus) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}/status`, {
                method: 'PATCH',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: newStatus})
            })

            const data = await response.json()
            onStatusUpdated(data.data)
            setMenuOpen(false)
        } catch (error) {
            console.error('Failed to update task status', error)
        }
    }

    return (
        <div
            className="relative group bg-white border border-stone-100 rounded-xl px-5 py-4 hover:border-stone-200 hover:shadow-sm transition-all duration-200">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                        className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 border-stone-200 hover:border-stone-400 transition-colors duration-150 cursor-pointer flex items-center justify-center">
                        {task.status === "done" && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>

                    <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-relaxed ${task.status === "done" ? "line-through text-stone-400" : "text-stone-800"}`}>
                            {task.description}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
              <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}/>
                  {config.label}
              </span>
                            <span className="text-xs text-stone-400">
                Updated {formatDate(task.updatedAt)}
              </span>
                        </div>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <button
                        onClick={() => setMenuOpen(o => !o)}
                        className="opacity-0 group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-all duration-150 cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="2.5" r="1" fill="#9ca3af"/>
                            <circle cx="7" cy="7" r="1" fill="#9ca3af"/>
                            <circle cx="7" cy="11.5" r="1" fill="#9ca3af"/>
                        </svg>
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{opacity: 0, scale: 0.95, y: -4}}
                                animate={{opacity: 1, scale: 1, y: 0}}
                                exit={{opacity: 0, scale: 0.95, y: -4}}
                                transition={{duration: 0.15, ease: "easeOut"}}
                                className="absolute right-0 top-8 z-20 bg-white border border-stone-100 rounded-xl shadow-lg shadow-stone-100 py-1 w-40 overflow-hidden"
                            >
                                {[
                                    {label: "Mark to do", status: "todo"},
                                    {label: "Mark in progress", status: "in-progress"},
                                    {label: "Mark done", status: "done"}
                                ].map((action) => (
                                    <button
                                        key={action.status}
                                        onClick={() => handleStatusUpdate(action.status)}
                                        className="w-full text-left text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900 px-3 py-2 transition-colors duration-100 cursor-pointer"
                                    >
                                        {action.label}
                                    </button>
                                ))}
                                <div className="h-px bg-stone-100 my-1"/>
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left text-sm text-red-500 hover:bg-red-50 px-3 py-2 transition-colors duration-100 cursor-pointer"
                                >
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