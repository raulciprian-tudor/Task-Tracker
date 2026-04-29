import {motion} from "motion/react"

const FILTERS = [
    {label: "All", value: "all"},
    {label: "To do", value: "todo"},
    {label: "In progress", value: "in-progress"},
    {label: "Done", value: "done"},
]

export default function Sidebar({tasks, filter, setFilter, onAdd}) {
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
                                <span
                                    className={`text-xs font-medium tabular-nums ${filter === f.value ? "text-stone-300" : "text-stone-400"}`}>
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
                                initial={{width: 0}}
                                animate={{width: `${progress}%`}}
                                transition={{duration: 0.6, ease: "easeOut"}}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={onAdd}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium bg-stone-900 text-white px-4 py-2.5 rounded-xl hover:bg-stone-700 active:scale-95 transition-all duration-150 cursor-pointer"
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Add task
                </button>
            </div>
        </aside>
    )
}