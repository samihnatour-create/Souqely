import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import ProblemSolution from "@/components/landing/ProblemSolution";
import Features from "@/components/landing/Features";
import Workflow from "@/components/landing/workflow";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <section id="features"><ProblemSolution /></section>
      <Features />
      <section id="workflow"><Workflow /></section>
      <Footer />
    </main>
  );
}