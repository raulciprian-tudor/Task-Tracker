import {motion} from "motion/react"
import { THEMES } from '../themes.js'

const FILTERS = [
    {label: "All", value: "all"},
    {label: "To do", value: "todo"},
    {label: "In progress", value: "in-progress"},
    {label: "Done", value: "done"},
]

export default function Sidebar({tasks, filter, setFilter, onAdd, sort, setSort, themeKey, onThemeChange, user, onLogout, projects, selectedProject, onSelectProject, onAddProject, onDeleteProject, token, search, setSearch}) {
    const count = (val) => val === "all"
        ? tasks.filter(t => t.status !== 'done').length
        : tasks.filter(t => t.status === val).length
    const done = tasks.filter(t => t.status === "done").length
    const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0

    const handleDeleteProject = async (e, id) => {
        e.stopPropagation()
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await response.json()
            if (data.success) onDeleteProject(id)
        } catch (error) {
            console.error('Failed to delete project', error)
        }
    }

    return (
        <aside className="w-56 xl:w-64 flex-shrink-0">
            <div className="sticky top-20 flex flex-col gap-3">

                {/* User card */}
                <div className="rounded-2xl p-4 border transition-colors duration-300"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0"
                                 style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
                                {user?.email?.[0].toUpperCase()}
                            </div>
                            <span className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
                                {user?.email}
                            </span>
                        </div>
                        <button onClick={onLogout}
                                className="text-xs px-2 py-1 rounded-lg cursor-pointer transition-all flex-shrink-0 ml-2"
                                style={{ color: 'var(--text-subtle)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Overview */}
                <div className="rounded-2xl p-4 border transition-colors duration-300"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <p className="text-xs font-medium uppercase tracking-wider mb-3"
                       style={{ color: 'var(--text-subtle)' }}>Overview</p>
                    <div className="flex flex-col gap-0.5">
                        {FILTERS.map(f => (
                            <button key={f.value} onClick={() => { setFilter(f.value); onSelectProject(null) }}
                                    style={filter === f.value && !selectedProject
                                        ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                                        : { color: 'var(--text-muted)' }
                                    }
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer hover:opacity-80"
                            >
                                <span>{f.label}</span>
                                <span className="text-xs font-medium tabular-nums opacity-70">{count(f.value)}</span>
                            </button>
                        ))}
                    </div>

                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>Completion</span>
                            <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-muted)' }}>{progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--border)' }}>
                            <motion.div className="h-full rounded-full" style={{ backgroundColor: 'var(--accent)' }}
                                        initial={{width: 0}} animate={{width: `${progress}%`}}
                                        transition={{duration: 0.6, ease: "easeOut"}} />
                        </div>
                    </div>
                </div>

                {/* Projects */}
                <div className="rounded-2xl p-4 border transition-colors duration-300"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium uppercase tracking-wider"
                           style={{ color: 'var(--text-subtle)' }}>Projects</p>
                        <button onClick={onAddProject}
                                className="w-5 h-5 rounded-md flex items-center justify-center cursor-pointer transition-all"
                                style={{ color: 'var(--text-subtle)' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--border)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    {projects.length === 0 ? (
                        <p className="text-xs" style={{ color: 'var(--text-subtle)' }}>No projects yet</p>
                    ) : (
                        <div className="flex flex-col gap-0.5">
                            {projects.map(p => (
                                <div key={p.id}
                                     className="group flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer"
                                     style={selectedProject?.id === p.id
                                         ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                                         : { color: 'var(--text-muted)' }
                                     }
                                     onClick={() => onSelectProject(p)}
                                     onMouseEnter={e => { if (selectedProject?.id !== p.id) e.currentTarget.style.opacity = '0.8' }}
                                     onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    <div className="flex items-center gap-2 min-w-0">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="flex-shrink-0">
                                            <rect x="1" y="1" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                                            <path d="M3 4h6M3 6h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                                        </svg>
                                        <span className="truncate text-xs">{p.name}</span>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteProject(e, p.id)}
                                        className="opacity-0 group-hover:opacity-100 flex-shrink-0 cursor-pointer transition-all"
                                        style={{ color: selectedProject?.id === p.id ? 'var(--accent-text)' : 'var(--text-subtle)' }}
                                    >
                                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={() => setSort(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="flex items-center justify-center gap-2 w-full text-sm px-4 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {sort === 'desc' ? 'Newest first' : 'Oldest first'}
                </button>

                <div className="relative">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                         className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                         style={{ color: 'var(--text-subtle)' }}>
                        <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search tasks..."
                        className="w-full text-sm pl-8 pr-4 py-2.5 rounded-xl border focus:outline-none transition-all"
                        style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                    />
                </div>

                <button onClick={onAdd}
                        className="flex items-center justify-center gap-2 w-full text-sm font-medium px-4 py-2.5 rounded-xl active:scale-95 transition-all duration-150 cursor-pointer"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}>
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
                            <button key={key} onClick={() => onThemeChange(key)} title={t.name}
                                    className="w-7 h-7 rounded-full transition-all duration-150 cursor-pointer"
                                    style={{
                                        backgroundColor: t.swatch,
                                        border: `2px solid ${themeKey === key ? 'var(--accent)' : t.swatchBorder}`,
                                        transform: themeKey === key ? 'scale(1.2)' : 'scale(1)',
                                    }}/>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    )
}