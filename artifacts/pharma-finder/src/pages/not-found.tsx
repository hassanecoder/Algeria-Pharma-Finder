import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-destructive/10 p-6 rounded-full mb-6 text-destructive">
          <AlertCircle className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-display font-extrabold text-foreground mb-4">404</h1>
        <h2 className="text-2xl font-bold text-foreground mb-6">Page Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
