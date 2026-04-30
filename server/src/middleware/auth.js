import jwt from 'jsonwebtoken'

const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({success: false, message: 'No token provided'})
        }

        const token = authHeader.split(' ')[1]
        req.user = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (error) {
        res.status(401).json({success: false, message: 'Invalid or expired token'})
    }
}

export default auth