import {motion} from "motion/react"
import { THEMES } from '../themes.js'

const FILTERS = [
    {label: "All", value: "all"},
    {label: "To do", value: "todo"},
    {label: "In progress", value: "in-progress"},
    {label: "Done", value: "done"},
]

export default function Sidebar({tasks, filter, setFilter, onAdd, sort, setSort, themeKey, onThemeChange}) {
    const count = (val) => val === "all"
        ? tasks.filter(t => t.status !== 'done').length
        : tasks.filter(t => t.status === val).length
    const done = tasks.filter(t => t.status === "done").length
    const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

    return (
        <aside className="w-56 xl:w-64 flex-shrink-0">
            <div className="sticky top-20 flex flex-col gap-3">
                <div className="rounded-2xl p-4 border transition-colors duration-300"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3"
                       style={{ color: 'var(--text-subtle)' }}>Overview</p>
                    <div className="flex flex-col gap-0.5">
                        {FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => setFilter(f.value)}
                                style={filter === f.value
                                    ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                                    : { color: 'var(--text-muted)' }
                                }
                                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer hover:opacity-80"
                            >
                                <span>{f.label}</span>
                                <span className="text-xs font-medium tabular-nums opacity-70">
                                    {count(f.value)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Completion</span>
                            <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                            <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: 'var(--accent)' }}
                                initial={{width: 0}}
                                animate={{width: `${progress}%`}}
                                transition={{duration: 0.6, ease: "easeOut"}}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setSort(prev => prev === 'desc' ? 'asc' : 'desc')}
                    className="flex items-center justify-center gap-2 w-full text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer hover:opacity-80"
                    style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {sort === 'desc' ? 'Newest first' : 'Oldest first'}
                </button>

                <button
                    onClick={onAdd}
                    className="flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2.5 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer"
                    style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Add task
                </button>

                {/* Theme picker */}
                <div className="rounded-2xl p-4 border transition-colors duration-300"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3"
                       style={{ color: 'var(--text-subtle)' }}>Theme</p>
                    <div className="flex items-center gap-2 flex-wrap">
                        {Object.entries(THEMES).map(([key, t]) => (
                            <button
                                key={key}
                                onClick={() => onThemeChange(key)}
                                title={t.name}
                                className="w-7 h-7 rounded-full transition-all duration-150 cursor-pointer"
                                style={{
                                    backgroundColor: t.swatch,
                                    border: `2px solid ${themeKey === key ? 'var(--accent)' : t.swatchBorder}`,
                                    transform: themeKey === key ? 'scale(1.2)' : 'scale(1)',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}