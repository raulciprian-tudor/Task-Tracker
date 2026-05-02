import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "motion/react"
import TaskCard from './components/TaskCard.jsx'
import Sidebar from './components/Sidebar.jsx'
import AddTaskModal from './components/AddTaskModal.jsx'
import AddProjectModal from './components/AddProjectModal.jsx'
import EmptyState from './components/EmptyState.jsx'
import AuthPage from './components/AuthPage.jsx'
import {THEMES} from './themes.js'

const FILTERS = [
    { label: "All", value: "all" },
    { label: "To do", value: "todo" },
    { label: "In progress", value: "in-progress" },
    { label: "Done", value: "done" },
]

function Toast ({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000)
        return () => clearTimeout(timer)
    }, [onClose])

    const isError = type === 'error'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 text-sm px-4 py-3 rounded-xl shadow-lg whitespace-nowrap"
        >
            {isError ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#f87171" strokeWidth="1.5"/>
                    <path d="M8 5v4M8 11v.5" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7" stroke="#4ade80" strokeWidth="1.5"/>
                    <path d="M5 8l2.5 2.5L11 5.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round"
                          strokeLinejoin="round"/>
                </svg>
            )}
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
            </button>
        </motion.div>
    )
}

export default function App () {
    const [tasks, setTasks] = useState([])
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState(null)
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false)
    const [sort, setSort] = useState('desc')
    const [toast, setToast] = useState(null)
    const [themeKey, setThemeKey] = useState(() => localStorage.getItem('theme') || 'light')
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user')
        return saved ? JSON.parse(saved) : null
    })

    const theme = THEMES[themeKey]
    const isAuthenticated = !!token

    const handleThemeChange = (key) => {
        setThemeKey(key)
        localStorage.setItem('theme', key)
    }

    const handleAuthSuccess = (token, user) => {
        setToken(token)
        setUser(user)
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
    }

    const handleLogout = () => {
        setToken(null)
        setUser(null)
        setTasks([])
        setProjects([])
        setSelectedProject(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    const showError = (message) => setToast({ message, type: 'error' })
    const showSuccess = (message) => setToast({ message, type: 'success' })

    // Filter tasks based on selected project and status filter
    const visibleTasks = selectedProject
        ? tasks.filter(t => t.projectId === selectedProject.id)
        : tasks

    const filtered = filter === "all"
        ? visibleTasks.filter(t => t.status !== "done" && t.description.toLowerCase().includes(search.toLowerCase()))
        : visibleTasks.filter(t => t.status === filter && t.description.toLowerCase().includes(search.toLowerCase()))

    const handleTaskCreated = (newTask) => {
        setTasks(prev => [...prev, newTask])
        showSuccess('Task created successfully')
    }

    const handleTaskDeleted = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id))
        showSuccess('Task deleted')
    }

    const handleStatusUpdated = (updatedTask) => {
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
        showSuccess('Status updated')
    }

    const handleTaskUpdated = (updatedTask) => {
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
        showSuccess('Task updated')
    }

    const handleProjectCreated = (newProject) => {
        setProjects(prev => [...prev, newProject])
        showSuccess('Project created')
    }

    const handleProjectDeleted = (id) => {
        setProjects(prev => prev.filter(p => p.id !== id))
        setTasks(prev => prev.filter(t => t.projectId !== id))
        if (selectedProject?.id === id) setSelectedProject(null)
        showSuccess('Project deleted')
    }

    useEffect(() => {
        if (!token) return
        const fetchTasks = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?sort=${sort}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.status === 401) {
                handleLogout();
                return
            }
            const data = await response.json()
            setTasks(data.data)
        }
        fetchTasks()
    }, [sort, token])

    useEffect(() => {
        if (!token) return
        const fetchProjects = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (response.status === 401) {
                handleLogout();
                return
            }
            const data = await response.json()
            setProjects(data.data)
        }
        fetchProjects()
    }, [token])

    const cssVars = {
        '--bg': theme.bg,
        '--header': theme.header,
        '--card': theme.card,
        '--border': theme.border,
        '--text': theme.text,
        '--text-muted': theme.textMuted,
        '--text-subtle': theme.textSubtle,
        '--accent': theme.accent,
        '--accent-text': theme.accentText,
    }

    if (!isAuthenticated) {
        return (
            <div style={{ ...cssVars, backgroundColor: 'var(--bg)', color: 'var(--text)' }}
                 className="min-h-screen transition-colors duration-300">
                <AuthPage onAuthSuccess={handleAuthSuccess}/>
                <AnimatePresence>
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
                </AnimatePresence>
            </div>
        )
    }

    return (
        <div style={{ ...cssVars, backgroundColor: 'var(--bg)', color: 'var(--text)' }}
             className="min-h-screen transition-colors duration-300">

            <motion.header
                initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)' }}
                className="border-b sticky top-0 z-10 transition-colors duration-300"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="text-xl sm:text-[22px] tracking-tight font-medium transition-opacity hover:opacity-70 cursor-pointer"
                                style={{ color: 'var(--text)', fontFamily: "'DM Serif Display', Georgia, serif" }}>
                                Tasks
                            </button>
                            {selectedProject && (
                                <>
                                    <span style={{ color: 'var(--text-subtle)' }}>/</span>
                                    <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                                {selectedProject.name}
                            </span>
                                </>
                            )}
                            <span className="text-xs font-medium rounded-full px-2 py-0.5 tabular-nums"
                                  style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}>
                        {visibleTasks.filter(t => t.status !== 'done').length}
                    </span>
                        </div>
                        <div className="flex items-center gap-3">
                    <span className="hidden sm:block text-xs" style={{ color: 'var(--text-subtle)' }}>
                        {user?.email}
                    </span>
                            <button onClick={handleLogout}
                                    className="hidden sm:flex text-xs px-3 py-1.5 rounded-lg cursor-pointer transition-all"
                                    style={{ color: 'var(--text-muted)', backgroundColor: 'var(--border)' }}>
                                Sign out
                            </button>
                            <button onClick={() => setIsModalOpen(true)}
                                    style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
                                    className="lg:hidden flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-full active:scale-95 transition-all duration-150 cursor-pointer">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                <span className="hidden sm:inline">Add task</span>
                            </button>
                        </div>
                    </div>

                    <nav className="flex gap-0 -mb-px lg:hidden overflow-x-auto">
                        {FILTERS.map((f) => (
                            <button key={f.value} onClick={() => setFilter(f.value)}
                                    style={{ color: filter === f.value ? 'var(--text)' : 'var(--text-subtle)' }}
                                    className="relative flex-shrink-0 text-sm px-4 py-3 transition-colors duration-150 cursor-pointer font-medium">
                                {f.label}
                                {filter === f.value && (
                                    <motion.div layoutId="active-filter"
                                                style={{ backgroundColor: 'var(--accent)' }}
                                                className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                                                transition={{ type: "spring", stiffness: 400, damping: 30 }}/>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="lg:hidden flex items-center justify-between py-2 border-t"
                         style={{ borderColor: 'var(--border)' }}>
                        <button
                            onClick={() => setSort(prev => prev === 'desc' ? 'asc' : 'desc')}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            style={{ color: 'var(--text-muted)', backgroundColor: 'var(--border)' }}
                        >
                            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            {sort === 'desc' ? 'Newest first' : 'Oldest first'}
                        </button>
                        <div className="flex items-center gap-1.5">
                            {Object.entries(THEMES).map(([key, t]) => (
                                <button key={key} onClick={() => handleThemeChange(key)} title={t.name}
                                        className="w-6 h-6 rounded-full transition-all duration-150 cursor-pointer"
                                        style={{
                                            backgroundColor: t.swatch,
                                            border: `2px solid ${themeKey === key ? 'var(--accent)' : t.swatchBorder}`,
                                            transform: themeKey === key ? 'scale(1.2)' : 'scale(1)',
                                        }}/>
                            ))}
                        </div>
                    </div>

                    <div className="lg:hidden flex items-center gap-2 py-2 border-t overflow-x-auto"
                         style={{ borderColor: 'var(--border)' }}>
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            style={!selectedProject
                                ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                                : { backgroundColor: 'var(--border)', color: 'var(--text-muted)' }
                            }
                        >
                            All
                        </button>
                        {projects.map(p => (
                            <button key={p.id} onClick={() => setSelectedProject(p)}
                                    className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                                    style={selectedProject?.id === p.id
                                        ? { backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }
                                        : { backgroundColor: 'var(--border)', color: 'var(--text-muted)' }
                                    }>
                                {p.name}
                            </button>
                        ))}
                        <button onClick={() => setIsProjectModalOpen(true)}
                                className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                style={{ backgroundColor: 'var(--border)', color: 'var(--text-muted)' }}>
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            New
                        </button>
                    </div>

                    {/* Mobile search */}
                    <div className="lg:hidden py-2 border-t" style={{ borderColor: 'var(--border)' }}>
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
                                className="w-full text-base pl-8 pr-4 py-1.5 rounded-lg border focus:outline-none transition-all"
                                style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                            />
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
                <div className="flex gap-8 xl:gap-12 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="hidden lg:block"
                    >
                        <Sidebar
                            tasks={tasks}
                            filter={filter}
                            setFilter={setFilter}
                            onAdd={() => setIsModalOpen(true)}
                            sort={sort}
                            setSort={setSort}
                            themeKey={themeKey}
                            onThemeChange={handleThemeChange}
                            user={user}
                            onLogout={handleLogout}
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelectProject={setSelectedProject}
                            onAddProject={() => setIsProjectModalOpen(true)}
                            onDeleteProject={handleProjectDeleted}
                            token={token}
                            search={search}
                            setSearch={setSearch}
                        />
                    </motion.div>

                    <div className="flex-1 min-w-0">
                        <div className="hidden lg:flex items-center justify-between mb-5">
                            <h2 className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                                {selectedProject
                                    ? selectedProject.name
                                    : filter === "all" ? "All tasks" : FILTERS.find(f => f.value === filter)?.label}
                                <span className="ml-2 tabular-nums" style={{ color: 'var(--text-subtle)' }}>{filtered.length}</span>
                            </h2>
                        </div>

                        <AnimatePresence mode="wait">
                            {filtered.length === 0 ? (
                                <EmptyState key="empty" filter={filter}/>
                            ) : (
                                <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }} className="flex flex-col gap-2">
                                    {filtered.map((task, i) => (
                                        <motion.div key={task.id}
                                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    transition={{ duration: 0.3, delay: i * 0.05 }}>
                                            <TaskCard
                                                task={task}
                                                onTaskDeleted={handleTaskDeleted}
                                                onStatusUpdated={handleStatusUpdated}
                                                onTaskUpdated={handleTaskUpdated}
                                                onError={showError}
                                                token={token}
                                            />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && <AddTaskModal
                    onClose={() => setIsModalOpen(false)}
                    onTaskCreated={handleTaskCreated}
                    onError={showError}
                    token={token}
                    projectId={selectedProject?.id || null}
                />}
            </AnimatePresence>

            <AnimatePresence>
                {isProjectModalOpen && <AddProjectModal
                    onClose={() => setIsProjectModalOpen(false)}
                    onProjectCreated={handleProjectCreated}
                    onError={showError}
                    token={token}
                />}
            </AnimatePresence>

            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)}/>}
            </AnimatePresence>
        </div>
    )
}