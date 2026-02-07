import dynamic from "next/dynamic";
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";

// ⚡️ SPEED OPTIMIZATION: Lazy load components below the fold.
// This ensures the browser prioritizes the Hero section first, drastically improving LCP (Largest Contentful Paint).
const ProblemSolution = dynamic(() => import("@/components/landing/ProblemSolution"));
const Features = dynamic(() => import("@/components/landing/Features"));
const Workflow = dynamic(() => import("@/components/landing/workflow"));
const Footer = dynamic(() => import("@/components/landing/footer"));

export default function Home() {
  return (
    // 🟢 MOBILE FIX: 'overflow-x-hidden' prevents the annoying side-scroll on small phones
    // 🟢 LAYOUT: 'flex-col' ensures elements stack correctly without gaps
    <main className="min-h-screen w-full flex flex-col overflow-x-hidden bg-white">

      {/* Critical: Loaded Immediately */}
      <Navbar />
      <Hero />

      {/* Non-Critical: Hydrated later */}
      <section id="features" className="w-full">
        <ProblemSolution />
      </section>

      <div className="w-full">
        <Features />
      </div>

      <section id="workflow" className="w-full">
        <Workflow />
      </section>

      <Footer />
    </main>
  );
}