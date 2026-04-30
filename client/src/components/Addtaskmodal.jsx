import { useState } from "react"
import { motion } from "motion/react"

export default function AddTaskModal({ onClose, onTaskCreated, onError }) {
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')
    const [dueDate, setDueDate] = useState('')

    const handleCreate = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    description,
                    priority,
                    dueDate: dueDate ? new Date(dueDate).toISOString() : null
                })
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onTaskCreated(data.data)
            onClose()
        } catch (error) {
            onError('Failed to create task')
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClose}
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-2xl border shadow-xl overflow-hidden transition-colors duration-300"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b"
                         style={{ borderColor: 'var(--border)' }}>
                        <h2 className="text-base font-medium"
                            style={{ color: 'var(--text)', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            New task
                        </h2>
                        <button onClick={onClose}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                style={{ color: 'var(--text-subtle)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium mb-1.5"
                                   style={{ color: 'var(--text-muted)' }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What needs to be done?"
                                rows={3}
                                className="w-full text-sm rounded-xl px-4 py-3 resize-none focus:outline-none transition-all duration-150 border"
                                style={{
                                    backgroundColor: 'var(--bg)',
                                    borderColor: 'var(--border)',
                                    color: 'var(--text)',
                                }}
                            />
                        </div>
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-medium mb-1.5"
                                       style={{ color: 'var(--text-muted)' }}>Priority</label>
                                <select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    className="w-full text-sm rounded-xl px-4 py-2.5 focus:outline-none transition-all cursor-pointer border"
                                    style={{
                                        backgroundColor: 'var(--bg)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text)',
                                    }}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs font-medium mb-1.5"
                                       style={{ color: 'var(--text-muted)' }}>Due date</label>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    className="w-full text-sm rounded-xl px-4 py-2.5 focus:outline-none transition-all cursor-pointer border"
                                    style={{
                                        backgroundColor: 'var(--bg)',
                                        borderColor: 'var(--border)',
                                        color: 'var(--text)',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-6 pb-5 flex gap-2 justify-end">
                        <button onClick={onClose}
                                className="text-sm px-4 py-2 rounded-xl transition-all cursor-pointer"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Cancel
                        </button>
                        <button onClick={handleCreate}
                                className="text-sm font-medium px-5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
                                style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                            Add task
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}