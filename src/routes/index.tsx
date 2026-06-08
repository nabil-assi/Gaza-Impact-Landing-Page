import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Send,
  Calendar,
  Sparkles,
} from "lucide-react";
import { api } from "@/lib/api/api";

// ─── Fallback placeholder images (replace with your actual imports or URLs) ───
const FALLBACK_IMAGES = {
  hero: "https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=1600&q=80",
  food: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=70",
  water: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=800&q=70",
  medical: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&q=70",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=70",
  school: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=70",
  blankets: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800&q=70",
};

export default function IndexPage() {
  const [dynamicInitiatives, setDynamicInitiatives] = useState<any[]>([]);
  const [dynamicPosts, setDynamicPosts] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

 // قم بتحديث جزء الـ useEffect في مكون IndexPage بهذا الشكل
useEffect(() => {
  const loadData = async () => {
    setLoadingData(true);
    try {
      // 1. جلب المبادرات
      const initRes = await api.get("/initiatives");
      if (Array.isArray(initRes.data)) {
        const fallbacks = [FALLBACK_IMAGES.food, FALLBACK_IMAGES.water, FALLBACK_IMAGES.medical];
        const mapped = initRes.data.map((i: any, idx: number) => {
          const raised = parseFloat(i.raisedAmount || "0");
          const goal = parseFloat(i.targetAmount || "1");
          // تأكد هنا أن i.images[0] رابط كامل، إذا كان مجرد اسم ملف، اضف baseURL قبله
          const imageUrl = i.images?.[0] ? i.images[0] : fallbacks[idx % 3];
          
          return {
            id: i.id,
            img: imageUrl,
            title: i.title || "Emergency Campaign",
            titleAr: i.titleAr || "حملة إغاثية",
            desc: i.description || "No description provided.",
            raised,
            goal,
            percent: Math.min(100, Math.round((raised / goal) * 100)),
          };
        });
        setDynamicInitiatives(mapped);
      }

      // 2. جلب المنشورات
      const postsRes = await api.get("/posts");
      if (Array.isArray(postsRes.data)) {
        const fallbacks = [FALLBACK_IMAGES.bread, FALLBACK_IMAGES.school, FALLBACK_IMAGES.medical, FALLBACK_IMAGES.blankets];
        const mapped = postsRes.data.map((p: any, idx: number) => ({
          img: p.images?.[0] ? p.images[0] : fallbacks[idx % 4],
          date: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric" }) : "Today",
          title: p.title || "Field Update",
          titleAr: p.titleAr || "تحديث ميداني",
          desc: p.content || "No details provided.",
        }));
        setDynamicPosts(mapped);
      }
    } catch (err) {
      console.error("Error fetching data from API:", err);
    } finally {
      setLoadingData(false);
    }
  };

  loadData();
}, []);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Initiatives initiatives={dynamicInitiatives} loading={loadingData} />
        <DonateCTA />
        <Impact impactPosts={dynamicPosts} />
      </main>
      <Footer />
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold tracking-tight text-foreground">GAZA IMPACT</span>
            <span className="font-arabic text-xs text-muted-foreground">أثر غزة</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#initiatives" className="text-sm text-foreground/80 transition hover:text-primary">
            Initiatives
          </a>
          <Link to="/donate" className="text-sm text-foreground/80 transition hover:text-primary">
            Donate
          </Link>
          <a href="#about" className="text-sm text-foreground/80 transition hover:text-primary">
            About Us
          </a>
          <a href="#contact" className="text-sm text-foreground/80 transition hover:text-primary">
            Contact
          </a>
        </nav>

        <Link
          to="/donate"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          Donate Now
          <span className="font-arabic">| تبرع الآن</span>
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={FALLBACK_IMAGES.hero}
          alt="Aid worker delivering a food parcel to a smiling family in Gaza"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/20" />
      </div>

      <div className="relative mx-auto flex min-h-[640px] max-w-7xl flex-col justify-center px-6 py-24">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-medium text-moss">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Trusted Humanitarian Initiatives in Gaza
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            We are making a real impact in Gaza
          </h1>
          <p className="font-arabic mt-3 text-3xl font-bold text-moss sm:text-4xl" dir="rtl">
            نصنع أثراً حقيقياً في غزة
          </p>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-foreground/75">
            Every donation is tracked. Every delivery is documented. Your support reaches families
            directly — with full transparency every step of the way.
            <span className="font-arabic mt-1 block text-foreground/65" dir="rtl">
              كل تبرع موثق. كل توصيل مُصوَّر. دعمك يصل مباشرة للعائلات.
            </span>
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/donate"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
            >
              <Heart className="h-4 w-4" />
              Donate Now <span className="font-arabic">| تبرع الآن</span>
            </Link>
            <a
              href="#initiatives"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-6 py-3.5 text-base font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              View campaigns
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <Stat number="12,400+" label="Families helped" />
            <Stat number="38" label="Active campaigns" />
            <Stat number="100%" label="Transparent reporting" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-foreground">{number}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

// ─── Initiatives ──────────────────────────────────────────────────────────────

function Initiatives({ initiatives, loading }: { initiatives: any[]; loading: boolean }) {
  return (
    <section id="initiatives" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Current Initiatives
            </p>
            <h2 className="font-arabic mt-2 text-2xl text-muted-foreground" dir="rtl">
              المبادرات الحالية
            </h2>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
              Where your support is going right now
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Every campaign is fully tracked. Watch progress in real time and follow each delivery
            through to families on the ground.
          </p>
        </div>

        {loading && (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        )}

        {!loading && initiatives.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">
            No active initiatives at the moment. Check back soon.
          </p>
        )}

        {!loading && initiatives.length > 0 && (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {initiatives.map((i, index) => (
              <article
                key={i.id ?? index}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={i.img}
                    alt={i.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-semibold text-foreground">{i.title}</h3>
                  <p className="font-arabic mt-1 text-sm text-muted-foreground" dir="rtl">
                    {i.titleAr}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/70 line-clamp-3">
                    {i.desc}
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs font-medium">
                      <span className="text-foreground">
                        ${i.raised.toLocaleString()}{" "}
                        <span className="text-muted-foreground">of ${i.goal.toLocaleString()}</span>
                      </span>
                      <span className="text-primary">{i.percent}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-primary-soft">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${i.percent}%` }}
                      />
                    </div>
                  </div>

                  {/* ← React Router Link instead of TanStack's <Link to="/initiatives/$id"> */}
                  <Link
                    to={`/initiatives/${i.id}`}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary-soft/40 px-5 py-2.5 text-sm font-semibold text-moss transition hover:bg-primary hover:text-primary-foreground"
                  >
                    View Details <span className="font-arabic">| تفاصيل</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Donate CTA ───────────────────────────────────────────────────────────────

function DonateCTA() {
  return (
    <section id="donate" className="bg-primary-soft/30 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-medium text-moss">
          <Sparkles className="h-3.5 w-3.5" />
          100% reaches the field
        </span>

        <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Ready to make a difference?
        </h2>
        <p className="font-arabic mt-3 text-2xl font-bold text-moss" dir="rtl">
          هل أنت مستعد لصنع فرق؟
        </p>

        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          Choose to support a specific initiative or contribute to our general humanitarian fund.
          Every dollar is tracked and every impact is documented.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/donate"
            className="inline-flex items-center gap-2.5 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90"
          >
            <Heart className="h-5 w-5" />
            General Donation
            <span className="font-arabic">| تبرع عام</span>
          </Link>

          <a
            href="#initiatives"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-4 text-base font-medium text-foreground transition hover:border-primary hover:text-primary"
          >
            Browse Initiatives
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <p className="mt-8 text-sm text-muted-foreground">
          Or pick any initiative above and click{" "}
          <span className="font-semibold text-foreground">"View Details"</span> to donate directly
          to that campaign.
        </p>
      </div>
    </section>
  );
}

// ─── Impact / Field Posts ─────────────────────────────────────────────────────

function Impact({ impactPosts }: { impactPosts: any[] }) {
  return (
    <section id="about" className="py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-primary">
              Latest Initiatives & Impact
            </p>
            <h2 className="font-arabic mt-2 text-2xl text-muted-foreground" dir="rtl">
              آخر المبادرات والأثر
            </h2>
            <h2 className="mt-1 text-4xl font-bold tracking-tight text-foreground">
              Proof of what your donation does
            </h2>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3"
          >
            View all updates <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {impactPosts.length === 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-64 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {impactPosts.map((post, index) => (
              <article
                key={index}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/40 hover:shadow-md"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.img}
                    alt={post.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                    <Calendar className="h-3 w-3 text-primary" />
                    {post.date}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-foreground">{post.title}</h3>
                  <p className="font-arabic mt-1 text-xs text-muted-foreground" dir="rtl">
                    {post.titleAr}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/70">{post.desc}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-cream/60">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Heart className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-bold text-foreground">GAZA IMPACT</span>
                <span className="font-arabic text-xs text-muted-foreground">أثر غزة</span>
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              A grassroots humanitarian initiative delivering food, water, and care to families in
              Gaza — with full transparency.
            </p>

            <div className="mt-6 flex gap-3">
              <Social icon={<Facebook className="h-4 w-4" />} />
              <Social icon={<Twitter className="h-4 w-4" />} />
              <Social icon={<Instagram className="h-4 w-4" />} />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Contact <span className="font-arabic text-muted-foreground">| تواصل</span>
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Coordination office · Cairo, Egypt</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href="#" className="hover:text-primary">
                  WhatsApp: +20 100 000 0000
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href="mailto:hello@gazaimpact.org" className="hover:text-primary">
                  hello@gazaimpact.org
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">
              Stay updated{" "}
              <span className="font-arabic text-muted-foreground">| ابقَ على اطلاع</span>
            </h4>
            <p className="mt-5 text-sm text-muted-foreground">
              Get monthly impact reports straight to your inbox.
            </p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-primary px-4 text-primary-foreground transition hover:bg-primary/90"
                aria-label="Subscribe"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row">
          <p>© 2026 GAZA IMPACT · أثر غزة. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Transparency</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Social({ icon }: { icon: React.ReactNode }) {
  return (
    <a
      href="#"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground/70 transition hover:border-primary hover:text-primary"
    >
      {icon}
    </a>
  );
}
