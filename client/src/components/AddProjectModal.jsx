import { useState } from "react"
import { motion } from "motion/react"

export default function AddProjectModal({ onClose, onProjectCreated, onError, token }) {
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCreate = async () => {
        if (!name.trim()) return onError('Project name is required')
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name })
            })
            const data = await response.json()
            if (!data.success) return onError(data.message)
            onProjectCreated(data.data)
            onClose()
        } catch (error) {
            onError('Failed to create project')
        } finally {
            setLoading(false)
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
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="rounded-2xl border shadow-xl overflow-hidden"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b"
                         style={{ borderColor: 'var(--border)' }}>
                        <h2 className="text-base font-medium"
                            style={{ color: 'var(--text)', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                            New project
                        </h2>
                        <button onClick={onClose}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors cursor-pointer"
                                style={{ color: 'var(--text-subtle)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="px-6 py-5">
                        <label className="block text-xs font-medium mb-1.5"
                               style={{ color: 'var(--text-muted)' }}>Project name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                            placeholder="e.g. Task Tracker"
                            autoFocus
                            className="w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none transition-all"
                            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        />
                    </div>
                    <div className="px-6 pb-5 flex gap-2 justify-end">
                        <button onClick={onClose}
                                className="text-sm px-4 py-2 rounded-xl transition-all cursor-pointer"
                                style={{ color: 'var(--text-muted)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Cancel
                        </button>
                        <button onClick={handleCreate} disabled={loading}
                                className="text-sm font-medium px-5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                                style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}