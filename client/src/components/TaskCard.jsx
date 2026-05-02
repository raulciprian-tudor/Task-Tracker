import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "motion/react"

const STATUS_CONFIG = {
    todo: { label: "To do", dot: "bg-stone-300", badge: "bg-stone-100 text-stone-500" },
    "in-progress": { label: "In progress", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
    done: { label: "Done", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
}

const PRIORITY_CONFIG = {
    low: { label: "Low", badge: "bg-sky-50 text-sky-600" },
    medium: { label: "Medium", badge: "bg-yellow-50 text-yellow-600" },
    high: { label: "High", badge: "bg-red-50 text-red-600" },
}

function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
    })
}

export default function TaskCard({task, onTaskDeleted, onStatusUpdated, onTaskUpdated, onError, token}) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editDescription, setEditDescription] = useState(task.description)
    const [isEditingDueDate, setIsEditingDueDate] = useState(false)
    const [editDueDate, setEditDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '')
    const config = STATUS_CONFIG[task.status]
    const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium

    const authHeaders = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }

    const handleDelete = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onTaskDeleted(task.id)
            setMenuOpen(false)
        } catch (error) {
            onError('Failed to delete task')
        }
    }

    const handleStatusUpdate = async (newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}/status`, {
                method: 'PATCH',
                headers: authHeaders,
                body: JSON.stringify({status: newStatus})
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onStatusUpdated(data.data)
            setMenuOpen(false)
        } catch (error) {
            onError('Failed to update task status')
        }
    }

    const handlePriorityUpdate = async (newPriority) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}/priority`, {
                method: 'PATCH',
                headers: authHeaders,
                body: JSON.stringify({priority: newPriority})
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onTaskUpdated(data.data)
            setMenuOpen(false)
        } catch (error) {
            onError('Failed to update task priority')
        }
    }

    const handleDueDateUpdate = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}/due-date`, {
                method: 'PATCH',
                headers: authHeaders,
                body: JSON.stringify({dueDate: editDueDate ? new Date(editDueDate).toISOString() : null})
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onTaskUpdated(data.data)
            setIsEditingDueDate(false)
            setMenuOpen(false)
        } catch (error) {
            onError('Failed to update due date')
        }
    }

    const handleEdit = () => {
        setIsEditing(true)
        setMenuOpen(false)
    }

    const handleSave = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: authHeaders,
                body: JSON.stringify({description: editDescription})
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onTaskUpdated(data.data)
            setIsEditing(false)
        } catch (error) {
            onError('Failed to update task')
        }
    }

    const handleCancel = () => {
        setEditDescription(task.description)
        setIsEditing(false)
    }

    useEffect(() => {
        const handleClickOutside = () => setMenuOpen(false)
        if (menuOpen) document.addEventListener('click', handleClickOutside)
        return () => document.removeEventListener('click', handleClickOutside)
    }, [menuOpen])

    return (
        <div
            className="relative group rounded-xl px-5 py-4 border transition-all duration-200"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                        onClick={() => handleStatusUpdate(task.status === 'done' ? 'todo' : 'done')}
                        className="mt-0.5 shrink-0 w-5 h-5 rounded-full border-2 transition-all duration-150 cursor-pointer flex items-center justify-center group/check"
                        style={{ borderColor: task.status === 'done' ? 'var(--accent)' : 'var(--border)' }}
                    >
                        {task.status === 'done' ? (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                <path d="M1 4l3 3 5-6" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        ) : (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" className="opacity-0 group-hover/check:opacity-40 transition-opacity duration-150">
                                <path d="M1 4l3 3 5-6" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        )}
                    </button>
                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="relative">
                                <input
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full text-sm rounded-lg px-3 py-1.5 pr-24 focus:outline-none transition-all duration-150 border"
                                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                    autoFocus
                                />
                                <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1">
                                    <button onClick={handleSave}
                                            className="text-xs font-medium px-2 py-0.5 rounded-md cursor-pointer transition-all"
                                            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                                        Save
                                    </button>
                                    <button onClick={handleCancel}
                                            className="text-xs px-2 py-0.5 rounded-md cursor-pointer transition-all"
                                            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--border)' }}>
                                        ✕
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm leading-relaxed"
                               style={{ color: task.status === "done" ? 'var(--text-subtle)' : 'var(--text)',
                                   textDecoration: task.status === "done" ? 'line-through' : 'none' }}>
                                {task.description}
                            </p>
                        )}

                        {isEditingDueDate && (
                            <div className="flex items-center gap-2 mt-2">
                                <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="text-sm rounded-lg px-3 py-1 focus:outline-none transition-all border"
                                    style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                                />
                                <button onClick={handleDueDateUpdate}
                                        className="text-xs font-medium px-3 py-1 rounded-lg cursor-pointer transition-all"
                                        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                                    Save
                                </button>
                                <button onClick={() => setIsEditingDueDate(false)}
                                        className="text-xs px-3 py-1 rounded-lg cursor-pointer transition-all"
                                        style={{ color: 'var(--text-muted)', backgroundColor: 'var(--border)' }}>
                                    Cancel
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}/>
                                {config.label}
                            </span>
                            <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig.badge}`}>
                                {priorityConfig.label}
                            </span>
                            {task.dueDate && (
                                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                                      style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                        <rect x="1" y="2" width="8" height="7" rx="1" stroke="currentColor" strokeWidth="1.2"/>
                                        <path d="M3 1v2M7 1v2M1 5h8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                    </svg>
                                    {new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                </span>
                            )}
                            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                                Updated {formatDate(task.updatedAt)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="relative shrink-0">
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(o => !o) }}
                        className="opacity-50 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer"
                        style={{ color: 'var(--text-subtle)' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="7" cy="2.5" r="1" fill="currentColor"/>
                            <circle cx="7" cy="7" r="1" fill="currentColor"/>
                            <circle cx="7" cy="11.5" r="1" fill="currentColor"/>
                        </svg>
                    </button>

                    <AnimatePresence>
                        {menuOpen && (
                            <motion.div
                                initial={{opacity: 0, scale: 0.95, y: -4}}
                                animate={{opacity: 1, scale: 1, y: 0}}
                                exit={{opacity: 0, scale: 0.95, y: -4}}
                                transition={{duration: 0.15, ease: "easeOut"}}
                                className="absolute right-0 top-8 z-20 rounded-xl shadow-lg py-1 w-44 overflow-hidden border"
                                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
                            >
                                {['Edit', 'Set due date'].map((label) => (
                                    <button key={label}
                                            onClick={label === 'Edit' ? handleEdit : () => { setIsEditingDueDate(true); setMenuOpen(false) }}
                                            className="w-full text-left text-sm px-3 py-2 transition-colors duration-100 cursor-pointer"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {label}
                                    </button>
                                ))}
                                <div className="h-px my-1" style={{ backgroundColor: 'var(--border)' }}/>
                                {[
                                    {label: "Mark to do", status: "todo"},
                                    {label: "Mark in progress", status: "in-progress"},
                                    {label: "Mark done", status: "done"}
                                ].map((action) => (
                                    <button key={action.status}
                                            onClick={() => handleStatusUpdate(action.status)}
                                            className="w-full text-left text-sm px-3 py-2 transition-colors duration-100 cursor-pointer"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                                <div className="h-px my-1" style={{ backgroundColor: 'var(--border)' }}/>
                                {[
                                    {label: "Low priority", priority: "low"},
                                    {label: "Medium priority", priority: "medium"},
                                    {label: "High priority", priority: "high"}
                                ].map((action) => (
                                    <button key={action.priority}
                                            onClick={() => handlePriorityUpdate(action.priority)}
                                            className="w-full text-left text-sm px-3 py-2 transition-colors duration-100 cursor-pointer"
                                            style={{ color: 'var(--text-muted)' }}
                                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                                <div className="h-px my-1" style={{ backgroundColor: 'var(--border)' }}/>
                                <button onClick={handleDelete}
                                        className="w-full text-left text-sm px-3 py-2 transition-colors duration-100 cursor-pointer text-red-500"
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
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