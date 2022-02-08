import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],

  // If you want to use the basic Next Auth page that is provided:
  //   theme: {
  //       logo: "https://url.to.logo",
  //       brandColor: "#EEEEEE",
  //       colorScheme: "auto",
  //   },

  //For a custom page entirely:
  pages: {
    signIn: "/auth/signin",
  },

  callbacks: {
    async session({ session, token, user }) {
      session.user.username = session.user.name
        .split(" ")
        .join("")
        .toLowerCase();

      session.user.uid = token.sub;
      return session;
    },
  },
});
