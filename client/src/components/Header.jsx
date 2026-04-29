import { motion } from "motion/react"

const FILTERS = [
    { label: "All", value: "all" },
    { label: "To do", value: "todo" },
    { label: "In progress", value: "in-progress" },
    { label: "Done", value: "done" },
]

export default function Header({ filter, setFilter, taskCount, onAdd }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white border-b border-stone-100 sticky top-0 z-10"
        >
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-3">
            <span className="text-[22px] tracking-tight font-medium text-stone-800" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
              Tasks
            </span>
                        <span className="text-xs font-medium bg-stone-100 text-stone-500 rounded-full px-2 py-0.5 tabular-nums">
              {taskCount}
            </span>
                    </div>

                    <button
                        onClick={onAdd}
                        className="flex items-center gap-1.5 text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-700 active:scale-95 transition-all duration-150 cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        Add task
                    </button>
                </div>

                <nav className="flex gap-0 -mb-px">
                    {FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => setFilter(f.value)}
                            className={`relative text-sm px-4 py-3 transition-colors duration-150 cursor-pointer ${
                                filter === f.value
                                    ? "text-stone-900 font-medium"
                                    : "text-stone-400 hover:text-stone-600"
                            }`}
                        >
                            {f.label}
                            {filter === f.value && (
                                <motion.div
                                    layoutId="active-filter"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                        </button>
                    ))}
                </nav>
            </div>
        </motion.header>
    )
}