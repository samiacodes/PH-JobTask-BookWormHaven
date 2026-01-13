import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GitHubProvider from "next-auth/providers/github"
import connectDb from "./db"
import User from "@/model/user.model"
import bcrypt from "bcryptjs"

const authOptions: NextAuthOptions = {  
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                const email = credentials?.email
                const password = credentials?.password
                
                if (!email || !password) {
                    throw new Error("Email or password is not found")
                }
                
                await connectDb()
                const user = await User.findOne({ email })
                
                if (!user) {
                    throw new Error("User not found")
                }
                
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    throw new Error("Incorrect password")
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role // Added role
                }
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),

        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!
        }),

        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        })
    ],

    callbacks: {
        async signIn({ account, user }) {
            if (account?.provider !== "credentials") {
                await connectDb()
                
                // Ensure user has a name for OAuth providers
                if (!user.name && user.email) {
                    user.name = user.email.split('@')[0]
                }
                
                // Check if user exists
                let existingUser = await User.findOne({ email: user.email })
                
                if (!existingUser) {
                    // Create new user for OAuth providers
                    existingUser = await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        provider: account?.provider,
                        role: 'user' // Default role for new users
                    })
                }
                
                // Add user ID and role to user object
                user.id = existingUser._id.toString()
                user.role = existingUser.role // Add role to user object
            }
            return true
        },

        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                token.id = user.id
                token.name = user.name
                token.email = user.email
                token.image = user.image
                token.role = user.role // Add role to token
            }
            return token
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },

        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.image as string
                session.user.role = token.role as string // Add role to session
            }
            return session
        }
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    },

    pages: {
        signIn: '/login',
        error: '/login'
    },

    secret: process.env.NEXTAUTH_SECRET
}

export default authOptions