import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { User } from './app/lib/definitions';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import { SignInSchema } from './app/lib/zod';
import { Provider } from 'next-auth/providers';
import GitHub from 'next-auth/providers/github';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

const providers: Provider[] = [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = SignInSchema.safeParse(credentials)

            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await getUser(email);
                if (!user) return null;
                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    return user;
                }
            }

            return null;
        }
    }),
    GitHub,
];

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers
});

export const providerMap = providers
    .map((provider) => {
        if (typeof provider === "function") {
            const providerData = provider()
            return { id: providerData.id, name: providerData.name }
        } else {
            return { id: provider.id, name: provider.name }
        }
    })
    .filter((provider) => provider.id !== "credentials");