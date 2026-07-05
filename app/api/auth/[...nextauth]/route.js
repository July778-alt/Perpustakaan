import { getUserByEmail } from "@/lib/action"
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOption = {
    providers: [
    CredentialsProvider({
    name: "credentials",
    credentials: {
        email: {label: "Email", type: "email"},
        password: {label: "Password", type: "password"},
    },
    async authorize(credentials) {
        // 1. unboxing(membuka) data email dan password
        if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password required");
        }

        // 2. cari user berdasarkan email
        const user = await getUserByEmail(credentials.email);

        if (!user || !user.password) {
            throw new Error("Invalid email or password");
        }

        // if (!user) return null

        // 3. mengcompare password
        const isValid = bcrypt.compareSync(credentials.password, user.password);

        if (!isValid) {
            throw new Error("Invalid email or password");
        }

        // if (!isValid) return null

        // 4. return user ke session
        return {
            id: user.id_users,
            email: user.email,
            name: user.username,
            role: user.role,
            image: user.image
        }
        },
     })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session}) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.image = user.image;
            }

            if (trigger === "update" && session) {
                token.name = session.user.name;
                token.image = session.user.image;
            }

            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.image = token.image;
                session.user.name = token.name;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOption)

export { handler as GET, handler as POST }