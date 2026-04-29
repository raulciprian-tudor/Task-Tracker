import { motion } from "motion/react"
import TaskCard from "./TaskCard"

export default function TaskBoard({ tasks }) {
    return (
        <motion.div
            key="board"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
        >
            {tasks.map((task, i) => (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.3, delay: i * 0.05, ease: "easeOut" }}
                >
                    <TaskCard task={task} />
                </motion.div>
            ))}
        </motion.div>
    )
}