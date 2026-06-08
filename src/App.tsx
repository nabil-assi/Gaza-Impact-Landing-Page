import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Loader2 } from "lucide-react";

// Lazy-loaded route components
const IndexPage = lazy(() => import("./routes/index"));
const DonatePage = lazy(() => import("./routes/donate"));
const InitiativeDetailPage = lazy(() => import("./routes/initiatives.$id"));
const NotFoundPage = lazy(() => import("./routes/not-found"));

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/initiatives/:id" element={<InitiativeDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
