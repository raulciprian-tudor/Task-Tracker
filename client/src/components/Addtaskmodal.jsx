import { useState } from "react"
import { motion } from "motion/react"

export default function AddTaskModal({ onClose, onTaskCreated }) {
    const [description, setDescription] = useState('')
    const [priority, setPriority] = useState('medium')

    const handleCreate = async () => {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, priority })
        })
        const data = await response.json()
        onTaskCreated(data.data)
        onClose()
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-white rounded-2xl border border-stone-100 shadow-xl shadow-stone-200/60 overflow-hidden">
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-50">
                        <h2 className="text-base font-medium text-stone-900" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            New task
                        </h2>
                        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-stone-100 transition-colors cursor-pointer text-stone-400 hover:text-stone-600">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                    <div className="px-6 py-5 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1.5">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="What needs to be done?"
                                rows={3}
                                className="w-full text-sm text-stone-800 placeholder:text-stone-300 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-stone-300 focus:bg-white transition-all duration-150"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-stone-500 mb-1.5">Priority</label>
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                                className="w-full text-sm text-stone-700 bg-stone-50 border border-stone-100 rounded-xl px-4 py-2.5 focus:outline-none focus:border-stone-300 transition-all cursor-pointer"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="px-6 pb-5 flex gap-2 justify-end">
                        <button onClick={onClose} className="text-sm text-stone-500 hover:text-stone-700 px-4 py-2 rounded-xl hover:bg-stone-50 transition-all cursor-pointer">Cancel</button>
                        <button onClick={handleCreate} className="text-sm font-medium bg-stone-900 text-white px-5 py-2 rounded-xl hover:bg-stone-700 active:scale-95 transition-all cursor-pointer">Add task</button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}