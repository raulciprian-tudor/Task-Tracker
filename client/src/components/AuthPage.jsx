import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"

export default function AuthPage({ onAuthSuccess }) {
    const [mode, setMode] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${mode}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })
            const data = await response.json()
            if (!data.success) {
                setError(data.message)
                return
            }
            onAuthSuccess(data.token, data.data)
        } catch (err) {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-sm"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-medium mb-2"
                        style={{ fontFamily: "'DM Serif Display', Georgia, serif", color: 'var(--text)' }}>
                        Tasks
                    </h1>
                    <p className="text-sm" style={{ color: 'var(--text-subtle)' }}>
                        {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <div className="rounded-2xl border p-6 flex flex-col gap-4"
                     style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-xs px-3 py-2 rounded-lg text-red-600 bg-red-50 border border-red-100"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                               style={{ color: 'var(--text-muted)' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="you@example.com"
                            className="w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none transition-all"
                            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium mb-1.5"
                               style={{ color: 'var(--text-muted)' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="••••••••"
                            className="w-full text-sm rounded-xl px-4 py-2.5 border focus:outline-none transition-all"
                            style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)', color: 'var(--text)' }}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full text-sm font-medium py-2.5 rounded-xl active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                        style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-text)' }}
                    >
                        {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                    </button>

                    <p className="text-xs text-center" style={{ color: 'var(--text-subtle)' }}>
                        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null) }}
                            className="font-medium cursor-pointer"
                            style={{ color: 'var(--accent)' }}
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}