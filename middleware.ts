import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
    signIn: "auth/login", 
    },
});

export const config = {
  // Folder apa saja yang mau dikunci?
    matcher: ["/admin/:path*"], 
};