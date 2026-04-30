import prisma from "../lib/prisma.js"
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

// Helper - validate email
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// POST /api/register
export const register = async (req, res) => {
    try {
        const {email, password} = req.body

        if (!email) {
            return res.status(400).json({success: false, message: "E-mail is required"})
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({success: false, message: "Please enter a valid e-mail"})
        }

        if (!password) {
            return res.status(400).json({success: false, message: "Password is required"})
        }

        const existingUser = await prisma.user.findUnique({where: {email}})

        if (existingUser) {
            return res.status(400).json({success: false, message: "User already exists."})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            }
        })

        const {password: _, ...userWithoutPassword} = newUser

        res.status(201).json({success: true, data: userWithoutPassword})


    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to register'})
    }
}

// POST /api/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email) {
            return res.status(400).json({success: false, message: "E-mail is required"})
        }

        if (!password) {
            return res.status(400).json({success: false, message: "Password is required"})
        }

        const user = await prisma.user.findUnique({ where: { email }})

        if (!user) {
            return res.status(400).json({success: false, message: "Invalid credentials."})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        const { password: _, ...userWithoutPassword } = user

        res.status(200).json({ success: true, token, data: userWithoutPassword })

    } catch (error) {
        res.status(500).json({success: false, message: 'Failed to login'})
    }
}