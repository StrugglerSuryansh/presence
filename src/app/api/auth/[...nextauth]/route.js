import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/config/mongoose";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      async profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email,
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "text" }, // 'login' or 'signup'
      },
      async authorize(credentials) {
        await connectToDatabase();
        const { email, password, action } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (action === 'signup') {
          // Check if user already exists
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            throw new Error("User already exists");
          }

          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 12);

          // Create new user
          const newUser = await User.create({
            name: email.split('@')[0], // You might want to collect name separately
            email,
            password: hashedPassword,
            role: 'employee',
          });

          return {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            image: newUser.image,
            role: newUser.role,
          };
        } else {
          // Login logic
          const user = await User.findOne({ email });
          if (!user) {
            throw new Error("No user found with this email");
          }

          if (!user.password) {
            throw new Error("This account doesn't have a password set. Please use social login or reset your password.");
          }

          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDatabase();

      if (account.provider === "github" || account.provider === "google") {
        const existingUser = await User.findOne({ email: profile.email });

        if (existingUser) {
          // Update the existing user with new information if they log in with GitHub or Google
          await User.updateOne(
            { email: profile.email },
            {
              $set: {
                name: profile.name || existingUser.name,
                image: profile.picture || profile.avatar_url || existingUser.image,
                isOAuth: true,
                role: existingUser.role,
              },
            }
          );
        } else {
          // If the user does not exist, create a new user with default role and image
          await User.create({
            name: profile.name,
            email: profile.email,
            image: profile.picture || profile.avatar_url || "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg",
            role: "employee",
            isOAuth: true,
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.name = token.name;
      session.user.image = token.image || "https://static.vecteezy.com/system/resources/thumbnails/005/545/335/small/user-sign-icon-person-symbol-human-avatar-isolated-on-white-backogrund-vector.jpg";
      session.user.role = token.role || "employee";
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };