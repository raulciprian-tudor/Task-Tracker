import {useState, useEffect} from "react"
import {motion, AnimatePresence} from "motion/react"
import TaskCard from './components/TaskCard.jsx'
import Sidebar from './components/Sidebar.jsx'
import AddTaskModal from './components/AddTaskModal.jsx'
import EmptyState from './components/EmptyState.jsx'

const FILTERS = [
    {label: "All", value: "all"},
    {label: "To do", value: "todo"},
    {label: "In progress", value: "in-progress"},
    {label: "Done", value: "done"},
]

export default function App() {
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState("all")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sort, setSort] = useState('desc')

    const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter)

    const handleTaskCreated = (newTask) => {
        setTasks(prev => [...prev, newTask])
    }

    const handleTaskDeleted = (id) => {
        setTasks(prev => prev.filter(task => task.id !== id))
    }

    const handleStatusUpdated = (updatedTask) => {
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
    }

    const handleTaskUpdated = (updatedTask) => {
        setTasks(prev => prev.map(task => task.id === updatedTask.id ? updatedTask : task))
    }

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tasks?sort=${sort}`)
            const data = await response.json()
            setTasks(data.data)
        }

        fetchTasks()
    }, [sort])

    return (
        <div className="min-h-screen bg-[#FAFAF8]">

            <motion.header
                initial={{opacity: 0, y: -12}} animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, ease: "easeOut"}}
                className="bg-white border-b border-stone-100 sticky top-0 z-10"
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-14 sm:h-16">
                        <div className="flex items-center gap-3">
              <span className="text-xl sm:text-[22px] tracking-tight font-medium text-stone-800"
                    style={{fontFamily: "'DM Serif Display', Georgia, serif"}}>
                Tasks
              </span>
                            <span
                                className="text-xs font-medium bg-stone-100 text-stone-500 rounded-full px-2 py-0.5 tabular-nums">
                {tasks.length}
              </span>
                        </div>
                        {/* Add button — mobile/tablet only, sidebar has it on desktop */}
                        <button onClick={() => setIsModalOpen(true)}
                                className="lg:hidden flex items-center gap-1.5 text-sm font-medium bg-stone-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full hover:bg-stone-700 active:scale-95 transition-all duration-150 cursor-pointer">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                            <span className="hidden sm:inline">Add task</span>
                        </button>
                    </div>

                    {/* Filter tabs — mobile/tablet only */}
                    <nav className="flex gap-0 -mb-px lg:hidden overflow-x-auto">
                        {FILTERS.map((f) => (
                            <button key={f.value} onClick={() => setFilter(f.value)}
                                    className={`relative flex-shrink-0 text-sm px-4 py-3 transition-colors duration-150 cursor-pointer ${filter === f.value ? "text-stone-900 font-medium" : "text-stone-400 hover:text-stone-600"}`}>
                                {f.label}
                                {filter === f.value && (
                                    <motion.div layoutId="active-filter"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full"
                                                transition={{type: "spring", stiffness: 400, damping: 30}}/>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>
            </motion.header>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-10">
                <div className="flex gap-8 xl:gap-12 items-start">

                    {/* Sidebar — desktop only */}
                    <motion.div
                        initial={{opacity: 0, x: -16}} animate={{opacity: 1, x: 0}}
                        transition={{duration: 0.4, ease: "easeOut"}}
                        className="hidden lg:block"
                    >
                        <Sidebar tasks={tasks} filter={filter} setFilter={setFilter} onAdd={() => setIsModalOpen(true)}
                                 sort={sort} setSort={setSort}/>
                    </motion.div>

                    {/* Task list */}
                    <div className="flex-1 min-w-0">
                        <div className="hidden lg:flex items-center justify-between mb-5">
                            <h2 className="text-sm font-medium text-stone-500">
                                {filter === "all" ? "All tasks" : FILTERS.find(f => f.value === filter)?.label}
                                <span className="ml-2 tabular-nums text-stone-300">{filtered.length}</span>
                            </h2>
                        </div>

                        <AnimatePresence mode="wait">
                            {filtered.length === 0 ? (
                                <EmptyState key="empty" filter={filter}/>
                            ) : (
                                <motion.div key="board" initial={{opacity: 0}} animate={{opacity: 1}}
                                            exit={{opacity: 0}} className="flex flex-col gap-2">
                                    {filtered.map((task, i) => (
                                        <motion.div key={task.id}
                                                    initial={{opacity: 0, y: 16}} animate={{opacity: 1, y: 0}}
                                                    exit={{opacity: 0, y: -8}}
                                                    transition={{duration: 0.3, delay: i * 0.05}}>
                                            <TaskCard task={task} onTaskDeleted={handleTaskDeleted}
                                                      onStatusUpdated={handleStatusUpdated}
                                                      onTaskUpdated={handleTaskUpdated}/>
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
                />}
            </AnimatePresence>
        </div>
    )
}