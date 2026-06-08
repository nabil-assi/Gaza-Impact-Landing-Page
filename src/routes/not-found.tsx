import { Link } from "react-router-dom";
import { Heart, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-soft">
        <Heart className="h-8 w-8 text-primary" />
      </span>

      <h1 className="mt-8 text-6xl font-bold text-foreground">404</h1>
      <h2 className="mt-3 text-2xl font-semibold text-foreground">Page not found</h2>
      <p className="font-arabic mt-2 text-lg text-muted-foreground" dir="rtl">
        الصفحة غير موجودة
      </p>

      <p className="mt-6 max-w-sm text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
