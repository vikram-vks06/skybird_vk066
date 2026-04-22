import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Client from '@/models/Client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'admin-login',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const admin = await Admin.findOne({ email: (credentials.email as string).toLowerCase() });
        if (!admin) return null;
        const isValid = await bcrypt.compare(credentials.password as string, admin.password);
        if (!isValid) return null;
        return { id: admin._id.toString(), name: admin.name, email: admin.email, role: admin.role };
      },
    }),
    Credentials({
      id: 'client-login',
      name: 'Client',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const client = await Client.findOne({ email: (credentials.email as string).toLowerCase() });
        if (!client) return null;
        if (!client.isVerified) return null;
        const isValid = await bcrypt.compare(credentials.password as string, client.password);
        if (!isValid) return null;
        return { id: client._id.toString(), name: client.name, email: client.email, role: 'client' };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role: string }).role = token.role as string;
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
});
