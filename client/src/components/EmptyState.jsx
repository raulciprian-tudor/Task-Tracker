import { motion } from "motion/react"

const MESSAGES = {
    all: { heading: "No tasks yet", sub: "Add your first task to get started." },
    todo: { heading: "Nothing to do", sub: "All caught up — or add something new." },
    "in-progress": { heading: "Nothing in progress", sub: "Start working on a task to see it here." },
    done: { heading: "Nothing done yet", sub: "Completed tasks will appear here." },
}

export default function EmptyState({ filter }) {
    const { heading, sub } = MESSAGES[filter] || MESSAGES.all

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-24 text-center"
        >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                 style={{ backgroundColor: 'var(--border)' }}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <rect x="3" y="5" width="14" height="2" rx="1" fill="var(--text-subtle)" />
                    <rect x="3" y="9" width="10" height="2" rx="1" fill="var(--text-subtle)" />
                    <rect x="3" y="13" width="7" height="2" rx="1" fill="var(--text-subtle)" />
                </svg>
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>{heading}</p>
            <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>{sub}</p>
        </motion.div>
    )
}