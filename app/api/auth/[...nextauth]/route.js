import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"; // ✅ manual login ke liye
import ConnectDB from "@/components/connectDB"; // ✅ apni DB utility
import loginUser from "@/components/model/Schema"; // ✅ tumhara user model
import bcrypt from "bcrypt"; // ✅ password compare ke liye

export const authOptions = {
  // ✅ list of providers: google + manual credentials
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),

    CredentialsProvider({
      name: "Credentials", // koi bhi naam rakh sakte
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials, req) {
        // ✅ step 1: DB connect
        await ConnectDB();

        // ✅ step 2: check email & password provided
        if (!credentials.email || !credentials.password) {
          throw new Error("Email and password required");
        }

        // ✅ step 3: find user from DB by email
        const user = await loginUser.findOne({ email: credentials.email });
        if (!user) {
          return null;  // user nahi mila → login fail
        }

        // ✅ step 4: bcrypt se password verify
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          return null;  // galat password → login fail
        }

        // ✅ step 5: user mil gaya → NextAuth ko return karo
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        };
      }
    })
  ],

  // ✅ agar custom login page banana hai
  pages: {
    signIn: "/login", // tumhara frontend login page
  },

  // ✅ optional: callback to include extra fields in session
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // user ki id token me add
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id; // session me bhi user ki id add
      }
      return session;
    }
  },

  // ✅ secret env se
  secret: process.env.NEXTAUTH_SECRET
};

// ✅ NextAuth ko handler bana ke export
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
