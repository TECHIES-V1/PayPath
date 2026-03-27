import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

export const register = async (
    name: string,
    email: string,
    password: string
) => {
    // Checks if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) { 
        throw new Error('User already exists')
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save user to database
    const user = await prisma.user.create({
        data: {
            name, 
            email,
            password: hashedPassword
        }
    })

    // Generate token
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d'}
    )

    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
}

export const login = async (
    email: string,
    password: string
) => {
    // Find user by email
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        throw new Error('Invalid credentials')
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) { 
        throw new Error('Invalid credentials')
    }

    // Generate token 
    const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword, token }
}

export const getMe = async ( userId: string ) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

export const updateProfile = async (userId: string, name: string) => {
    const user = await prisma.user.update({
        where: { id: userId },
        data: { name },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true
        }
    })

    return user
}
