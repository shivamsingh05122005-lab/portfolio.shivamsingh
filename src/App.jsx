import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import Hero3D from './components/Hero3D'
import InteractiveCursor3D from './components/InteractiveCursor3D'

const highlights = [
  { label: 'Projects Built', value: '5+ Full Stack & ML Projects' },
  { label: 'DSA Practice', value: '300+ Problems Solved (LeetCode & Codeforces)' },
  { label: 'Tech Stack', value: 'MERN, Python, Machine Learning' },
  { label: 'Currently Learning', value: 'Advanced DSA & ML Deployment' },
]

const caseStudies = [
  {
    title: 'StylosGuard - AI-Powered Writing Assistant',
    role: 'Full Stack Developer & ML Engineer',
    problem:
      'Many users struggle with grammar mistakes, unclear writing, and lack of real-time feedback. Existing tools are often slow, limited, or not customizable for learning and improvement.',
    approach:
      'Built an intelligent writing assistant that analyzes user text and provides corrections and suggestions. Implemented NLP-based techniques for grammar checking and text improvement, integrated backend APIs for processing, and designed a responsive frontend for real-time feedback.',
    outcome:
      'Delivered a functional web application that helps users improve writing quality with instant feedback, demonstrating end-to-end integration of ML concepts with a scalable full stack system.',
    stack: ['MERN', 'Python', 'NLP', 'REST APIs'],
    github: 'https://github.com/shivambegins/StylosGuard.git',
    demo: '#',
  },
  {
    title: 'MERN E-commerce',
    role: 'Full-Stack Developer (backend + frontend, payments, admin features)',
    problem:
      'Build a production-ready e-commerce application with product management, shopping cart, coupons, Stripe checkout, image uploads, email notifications, caching, admin analytics, and an AI chat helper.',
    approach:
      'Implemented an Express + MongoDB REST API with Mongoose models, JWT auth, coupon and order logic, Stripe payment integration, Cloudinary image uploads, Redis caching, and modular controllers/routes; built a responsive React SPA with Vite, Tailwind CSS, Zustand stores, reusable components, and admin analytics UI.',
    outcome:
      'A full-featured MERN e-commerce app that supports product CRUD, user auth, cart and coupon workflows, secure Stripe payments, admin analytics, image hosting, and responsive frontend flows ready for deployment.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Mongoose', 'Redis', 'Stripe', 'Cloudinary', 'Nodemailer', 'React', 'Vite', 'Tailwind CSS', 'Zustand', 'Axios'],
    github: 'https://github.com/shivambegins/Mern--E-commerce',
    demo: '#',
  },
  {
    title: 'LeafGuard AI - Plant Disease Detector',
    role: 'Full-stack developer / ML engineer',
    problem:
      'Farmers and growers need a fast way to identify plant diseases from leaf images and get suggested remedies.',
    approach:
      'Built a Flask web app that loads a trained TensorFlow/Keras model, preprocesses uploaded images, predicts the disease class, and shows Grad-CAM visualizations plus language-based remedy data and simple weather-risk guidance.',
    outcome:
      'Users can upload a leaf image, receive a disease prediction with confidence, see an attention heatmap, and view suggested treatments and prevention steps in the browser.',
    stack: ['Python', 'Flask', 'TensorFlow', 'Keras', 'NumPy', 'OpenCV', 'HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/shivambegins/Plant_disease_detection.git',
    demo: 'http://127.0.0.1:5000/',
  },
]

const codingProfiles = [
  {
    platform: 'LeetCode',
    handle: 'NetWeIOcsdre',
    problemsSolved: '356',
    rating: '1604',
    badge: '⭐',
    color: { bg: 'bg-amber-100 dark:bg-amber-500/15', border: 'border-amber-300 dark:border-amber-400/25', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-400', glow: 'rgba(251,191,36,0.2)', accent: '#fbbf24' },
    href: 'https://leetcode.com/u/NetWeIOcsdre/',
  },
  {
    platform: 'Codeforces',
    handle: 'Shivam_7080',
    problemsSolved: '8',
    rating: 'Newbie (637)',
    badge: '🟢',
    color: { bg: 'bg-blue-100 dark:bg-blue-500/15', border: 'border-blue-300 dark:border-blue-400/25', text: 'text-blue-300', dot: 'bg-blue-400', glow: 'rgba(96,165,250,0.2)', accent: '#60a5fa' },
    href: 'https://codeforces.com/profile/Shivam_7080',
  },
  {
    platform: 'CodeChef',
    handle: 'goofy_noble_71',
    problemsSolved: '10+',
    rating: '1★ (742)',
    badge: '⭐',
    color: { bg: 'bg-orange-100 dark:bg-orange-500/15', border: 'border-orange-300 dark:border-orange-400/25', text: 'text-orange-300', dot: 'bg-orange-400', glow: 'rgba(251,146,60,0.2)', accent: '#fb923c' },
    href: 'https://www.codechef.com/users/goofy_noble_71',
  },
  {
    platform: 'GeeksforGeeks',
    handle: 'enggshivam70rd',
    problemsSolved: '200+',
    rating: 'Active Contributor',
    badge: '🏆',
    color: { bg: 'bg-emerald-100 dark:bg-emerald-500/15', border: 'border-emerald-300 dark:border-emerald-300 dark:border-emerald-400/25', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-400', glow: 'rgba(52,211,153,0.2)', accent: '#34d399' },
    href: 'https://www.geeksforgeeks.org/profile/enggshivam70rd',
  },
]

const technicalDepth = [
  {
    title: 'DSA & Problem Solving',
    desc: '350+ problems solved across LeetCode, Codeforces, CodeChef, and GeeksforGeeks. Strong grasp of arrays, trees, graphs, DP, and greedy algorithms.',
    icon: 'code',
    accent: '#22d3ee',
  },
  {
    title: 'Full Stack (MERN)',
    desc: 'Building scalable RESTful APIs with Node/Express and responsive frontends with React. JWT auth, MongoDB aggregation, and deployment pipelines.',
    icon: 'layers',
    accent: '#fbbf24',
  },
  {
    title: 'Machine Learning',
    desc: 'Data preprocessing, feature engineering, and model evaluation using scikit-learn, Pandas, and NumPy. Experience with classification and regression tasks.',
    icon: 'brain',
    accent: '#a78bfa',
  },
  {
    title: 'Databases & APIs',
    desc: 'Solid understanding of relational and NoSQL database design, REST/GraphQL API patterns, and third-party API integration for end-to-end applications.',
    icon: 'database',
    accent: '#34d399',
  },
]

const leadership = [
  {
    title: 'Deadline-Driven Delivery',
    desc: 'Collaborated in student teams to deliver projects on deadlines with clear task ownership and version-controlled workflows.',
    icon: 'rocket',
    accent: '#22d3ee',
  },
  {
    title: 'Technical Demos',
    desc: 'Presented end-to-end project walkthroughs during college evaluations, hackathons, and technical events with live demos.',
    icon: 'presentation',
    accent: '#fbbf24',
  },
  {
    title: 'Peer Mentoring',
    desc: 'Helped juniors with React basics, debugging strategies, and interview preparation — building a habit of teaching to learn.',
    icon: 'users',
    accent: '#a78bfa',
  },
  {
    title: 'Competitive Coding',
    desc: 'Active participation in coding contests and hackathons to sharpen teamwork, time management, and problem-solving under pressure.',
    icon: 'trophy',
    accent: '#fb923c',
  },
]

const writingAndTalks = []

const certifications = [
  {
    title: 'Advanced Python',
    issuer: 'Cisco Networking Academy',
    icon: '🐍',
    href: '/certificates/advanced-python.pdf',
  },
  {
    title: 'Introduction to Data Science',
    issuer: 'Cisco Networking Academy',
    icon: '📊',
    href: '/certificates/data-science.pdf',
  },
  {
    title: 'Introduction to Modern AI',
    issuer: 'Cisco Networking Academy',
    icon: '🤖',
    href: '/certificates/modern-ai.pdf',
  },
  {
    title: 'Computer Networking',
    issuer: 'Cisco Networking Academy',
    icon: '🌐',
    href: '/certificates/computer-networking.pdf',
  },
  {
    title: 'Introduction to CyberSecurity',
    issuer: 'Cisco Networking Academy',
    icon: '🛡️',
    href: '/certificates/cybersecurity.pdf',
  },
]

const contactLinks = [
  {
    label: 'Email',
    value: 'engg.shivamsingh7080@gmail.com',
    href: 'mailto:engg.shivamsingh7080@gmail.com',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    color: 'cyan',
  },
  {
    label: 'GitHub',
    value: 'github.com/shivambegins',
    href: 'https://github.com/shivambegins',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    color: 'slate',
  },
  {
    label: 'LinkedIn',
    value: 'linkedin.com/in/shivam-singh',
    href: 'https://www.linkedin.com/in/shivam-singh-ab68682a1?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    color: 'blue',
  },
]

const sectionAnim = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
}

const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}

function CodingCarousel() {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState(0)
  const total = codingProfiles.length

  const next = useCallback(() => {
    setDirection(1)
    setActive((prev) => (prev + 1) % total)
  }, [total])

  const prev = useCallback(() => {
    setDirection(-1)
    setActive((prev) => (prev - 1 + total) % total)
  }, [total])

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [next])

  const getIndex = (offset) => (active + offset + total) % total

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.85 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.85 }),
  }

  const renderCard = (index, position) => {
    const profile = codingProfiles[index]
    const isCenter = position === 'center'

    return (
      <a
        href={profile.href}
        target="_blank"
        rel="noreferrer"
        className={`block rounded-2xl border bg-gradient-to-br from-white to-slate-50 dark:from-[#10161f]/90 dark:to-[#1a1012]/90 p-6 transition-all duration-300 ${isCenter
            ? `${profile.color.border} shadow-[0_0_40px_${profile.color.glow}]`
            : 'border-slate-700/30 opacity-40 blur-[1px]'
          }`}
        onClick={(e) => {
          if (!isCenter) {
            e.preventDefault()
            setDirection(position === 'left' ? -1 : 1)
            setActive(index)
          }
        }}
        style={{ cursor: isCenter ? 'pointer' : 'pointer' }}
      >
        {/* Background glow */}
        {isCenter && (
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-[0.08] blur-3xl"
            style={{ background: profile.color.accent }}
          />
        )}

        {/* Platform header */}
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl border ${profile.color.border} ${profile.color.bg} text-2xl`}>
              {profile.badge}
            </div>
            <div>
              <h3 className="text-xl font-bold text-amber-700 dark:text-amber-100">{profile.platform}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">@{profile.handle}</p>
            </div>
          </div>
          {isCenter && (
            <div className="text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="relative mt-5 grid grid-cols-2 gap-4">
          <div className={`rounded-lg border ${profile.color.border} ${profile.color.bg} p-4`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">Problems Solved</p>
            <p className={`mt-1 text-2xl font-bold ${profile.color.text}`}>{profile.problemsSolved}</p>
          </div>
          <div className={`rounded-lg border ${profile.color.border} ${profile.color.bg} p-4`}>
            <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">Rating / Rank</p>
            <p className={`mt-1 text-2xl font-bold ${profile.color.text}`}>{profile.rating}</p>
          </div>
        </div>

        {/* Progress bar */}
        {isCenter && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mt-5 h-1 origin-left rounded-full"
            style={{ background: `linear-gradient(90deg, ${profile.color.accent}, transparent)` }}
          />
        )}
      </a>
    )
  }

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div className="relative flex items-center justify-center" style={{ minHeight: '320px' }}>
        {/* Left peek card */}
        <div className="absolute left-0 z-0 hidden w-[28%] md:block">
          {renderCard(getIndex(-1), 'left')}
        </div>

        {/* Center card */}
        <div className="relative z-10 w-full md:w-[50%]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative"
            >
              {renderCard(active, 'center')}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right peek card */}
        <div className="absolute right-0 z-0 hidden w-[28%] md:block">
          {renderCard(getIndex(1), 'right')}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-6">
        {/* Prev button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prev}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-100 dark:bg-cyan-300/10 text-cyan-600 dark:text-cyan-300 transition hover:bg-cyan-200 dark:hover:bg-cyan-200 dark:bg-cyan-300/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </motion.button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {codingProfiles.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > active ? 1 : -1)
                setActive(i)
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${i === active
                  ? `w-8 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]`
                  : 'w-2.5 bg-slate-600 hover:bg-slate-500'
                }`}
            />
          ))}
        </div>

        {/* Next button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={next}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-100 dark:bg-cyan-300/10 text-cyan-600 dark:text-cyan-300 transition hover:bg-cyan-200 dark:hover:bg-cyan-200 dark:bg-cyan-300/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </motion.button>
      </div>

      {/* Platform name indicator */}
      <div className="mt-4 text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400"
          >
            {active + 1} / {total} — <span className="text-amber-700 dark:text-amber-100">{codingProfiles[active].platform}</span>
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-8">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.22em] text-cyan-600 dark:text-cyan-300">{eyebrow}</p> : null}
      <h2 className="mt-2 text-3xl font-semibold text-amber-700 dark:text-amber-100 md:text-4xl">{title}</h2>
      {subtitle ? <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-300">{subtitle}</p> : null}
    </div>
  )
}

export default function App() {
  const heroText = useMemo(
    () => 'Full Stack Developer with a strong foundation in Machine Learning, creating smart, interactive applications powered by modern web and AI technologies.',
    [],
  )
  const [typedText, setTypedText] = useState('')
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      index += 1
      setTypedText(heroText.slice(0, index))
      if (index >= heroText.length) clearInterval(timer)
    }, 22)

    return () => clearInterval(timer)
  }, [heroText])

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 dark:bg-[#0b0d12] dark:text-white">
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(34,211,238,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.08)_1px,transparent_1px)] [background-size:28px_28px]" />

      <Hero3D />
      <InteractiveCursor3D />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-20">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl border border-cyan-200 dark:border-cyan-400/20 bg-white/80 dark:bg-gradient-to-br dark:from-[#0b1220]/70 dark:via-[#0d1117]/75 dark:to-[#0a1628]/70 p-8 shadow-[0_0_60px_rgba(34,211,238,0.15)] backdrop-blur-sm md:p-12"
        >
          {/* Grid dot pattern */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'radial-gradient(circle, #67e8f9 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Role pills */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-5 flex flex-wrap gap-2"
          >
            {['Full-Stack Developer', 'ML Engineer', 'Data Science'].map((role, i) => {
              const colors = [
                { dot: 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.6)]', border: 'border-cyan-300 dark:border-cyan-400/30', text: 'text-cyan-600 dark:text-cyan-300' },
                { dot: 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.6)]', border: 'border-violet-300 dark:border-violet-400/30', text: 'text-violet-700 dark:text-violet-300' },
                { dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]', border: 'border-amber-300 dark:border-amber-400/30', text: 'text-amber-700 dark:text-amber-300' },
              ]
              const c = colors[i]
              return (
                <motion.span
                  key={role}
                  variants={cardAnim}
                  className={`inline-flex items-center gap-2 rounded-full border ${c.border} bg-slate-100 dark:bg-slate-950/60 px-3.5 py-1.5 text-xs font-medium uppercase tracking-widest ${c.text}`}
                >
                  <motion.span
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className={`h-1.5 w-1.5 rounded-full ${c.dot}`}
                  />
                  {role}
                </motion.span>
              )
            })}
          </motion.div>

          <h1 className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-amber-200 dark:via-orange-300 dark:to-red-300 md:text-6xl">
            Shivam Singh
          </h1>

          {/* Typed bio */}
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700 dark:text-slate-200 md:text-xl">
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              className="ml-1 inline-block h-6 w-[2px] bg-cyan-600 align-middle dark:bg-cyan-300"
            />
          </p>

          {/* Highlight stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.4 }}
            className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {highlights.map((item) => (
              <motion.div
                key={item.label}
                variants={cardAnim}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group rounded-xl border border-cyan-200 dark:border-cyan-200 dark:border-cyan-300/20 bg-white dark:bg-slate-950/70 p-4 shadow-[inset_0_0_24px_rgba(34,211,238,0.06)] transition-all duration-300 hover:border-cyan-400 dark:hover:border-cyan-300 dark:border-cyan-300/40"
              >
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-100">{item.value}</p>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ['0 0 0 rgba(34,211,238,0)', '0 0 18px rgba(34,211,238,0.35)', '0 0 0 rgba(34,211,238,0)'] }}
              transition={{ boxShadow: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } }}
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-cyan-300 dark:border-cyan-300/40 bg-cyan-100 dark:bg-cyan-300/10 px-6 py-3 font-medium text-cyan-800 dark:text-cyan-200 transition hover:bg-cyan-200 dark:hover:bg-cyan-200 dark:bg-cyan-300/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
              </svg>
              Open to Opportunities
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 dark:border-amber-300/30 bg-amber-100 dark:bg-amber-300/10 px-6 py-3 font-medium text-amber-700 dark:text-amber-100 transition hover:border-amber-400 dark:hover:border-amber-200 hover:bg-amber-200 dark:hover:bg-amber-200 dark:bg-amber-300/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
              </svg>
              View Resume
            </motion.a>

            {/* Available badge */}
            <span className="ml-auto hidden items-center gap-2 rounded-full border border-emerald-300 dark:border-emerald-300 dark:border-emerald-400/25 bg-emerald-100 dark:bg-emerald-400/10 px-3 py-1.5 text-xs text-emerald-700 dark:text-emerald-300 md:inline-flex">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Available 2026
            </span>
          </div>
        </motion.section>

        <motion.section
          variants={sectionAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="py-16"
          id="about"
        >
          <SectionHeading
            eyebrow="About Me"
            title="Fresher in Software Engineering"
            subtitle="B.Tech graduate ready to build, break, and ship real-world software."
          />

          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              variants={cardAnim}
              className="rounded-xl border border-cyan-200 dark:border-cyan-300/15 bg-gradient-to-br from-white to-slate-50 dark:from-[#10161f]/70 dark:to-[#1a1012]/70 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-200 dark:border-cyan-200 dark:border-cyan-300/20 bg-cyan-100 dark:bg-cyan-300/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 dark:text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" />
                    <polyline points="8 6 2 12 8 18" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-100">Clean Code</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                I write readable, maintainable code with clear naming, modular structure, and consistent patterns. Every commit matters.
              </p>
            </motion.div>

            <motion.div
              variants={cardAnim}
              className="rounded-xl border border-amber-200 dark:border-amber-300/15 bg-gradient-to-br from-white to-slate-50 dark:from-[#1a1012]/70 dark:to-[#10161f]/70 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-amber-200 dark:border-amber-300/20 bg-amber-100 dark:bg-amber-300/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-700 dark:text-amber-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-100">CS Fundamentals</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                Strong grasp of DSA, OS, networking, and database design. 300+ problems solved on LeetCode and Codeforces.
              </p>
            </motion.div>

            <motion.div
              variants={cardAnim}
              className="rounded-xl border border-emerald-200 dark:border-emerald-300/15 bg-gradient-to-br from-white to-slate-50 dark:from-[#0f1a14]/70 dark:to-[#10161f]/70 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-300/20 bg-emerald-300/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-700 dark:text-emerald-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-100">Continuous Growth</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                I treat every project as a learning sprint. From MERN stack to ML pipelines — I pick up tools fast and build with intent.
              </p>
            </motion.div>

            <motion.div
              variants={cardAnim}
              className="rounded-xl border border-purple-200 dark:border-purple-300/15 bg-gradient-to-br from-white to-slate-50 dark:from-[#161020]/70 dark:to-[#10161f]/70 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-purple-300 dark:border-purple-300/20 bg-purple-100 dark:bg-purple-300/10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 dark:text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-100">Team-First Mindset</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                I value ownership, clear communication, and learning from senior engineers. Ready to contribute from day one.
              </p>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          variants={sectionAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="py-16"
          id="case-studies"
        >
          <SectionHeading
            eyebrow="Build Log"
            title="Projects"
            subtitle="Academic and personal builds that demonstrate problem-solving and implementation quality."
          />

          {/* Branching timeline */}
          <div className="relative">
            {/* Central vertical line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-cyan-300/30 via-amber-300/20 to-transparent md:block" />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.1 }}
              className="space-y-8 md:space-y-12"
            >
              {caseStudies.map((item, index) => {
                const isLeft = index % 2 === 0
                const colors = [
                  { border: 'border-cyan-200 dark:border-cyan-200 dark:border-cyan-300/20', dot: 'bg-cyan-400', glow: 'shadow-[0_0_12px_rgba(34,211,238,0.3)]', branch: 'bg-cyan-200 dark:bg-cyan-300/20', badge: 'bg-cyan-100 dark:bg-cyan-400/15 text-cyan-600 dark:text-cyan-300 border-cyan-300 dark:border-cyan-300/30' },
                  { border: 'border-amber-200 dark:border-amber-300/20', dot: 'bg-amber-400', glow: 'shadow-[0_0_12px_rgba(251,191,36,0.3)]', branch: 'bg-amber-200 dark:bg-amber-300/20', badge: 'bg-amber-100 dark:bg-amber-400/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-300/30' },
                  { border: 'border-red-200 dark:border-red-300/20', dot: 'bg-red-400', glow: 'shadow-[0_0_12px_rgba(252,165,165,0.3)]', branch: 'bg-red-200 dark:bg-red-300/20', badge: 'bg-red-100 dark:bg-red-400/15 text-red-600 dark:text-red-300 border-red-300 dark:border-red-300/30' },
                ]
                const c = colors[index % colors.length]

                return (
                  <motion.div
                    key={item.title}
                    variants={cardAnim}
                    className={`relative flex flex-col md:flex-row ${isLeft ? '' : 'md:flex-row-reverse'} md:items-start md:gap-8`}
                  >
                    {/* Timeline node (desktop) */}
                    <div className="absolute left-1/2 top-8 z-10 hidden -translate-x-1/2 md:block">
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
                        className={`h-4 w-4 rounded-full ${c.dot} ${c.glow}`}
                      />
                    </div>

                    {/* Branch line connecting node to card (desktop) */}
                    <div
                      className={`absolute top-[2.1rem] hidden h-px w-[calc(50%-2.5rem)] ${c.branch} md:block ${isLeft ? 'right-1/2 mr-4' : 'left-1/2 ml-4'
                        }`}
                    />

                    {/* Spacer for the other half */}
                    <div className="hidden flex-1 md:block" />

                    {/* Project card */}
                    <motion.article
                      whileHover={{ y: -6, scale: 1.01 }}
                      className={`relative flex-1 rounded-2xl border ${c.border} bg-gradient-to-br from-white to-slate-50 dark:from-[#1a1012]/80 dark:to-[#10161f]/80 p-6 transition-all hover:shadow-lg`}
                    >
                      {/* Mobile timeline dot */}
                      <div className={`absolute -left-3 top-8 h-3 w-3 rounded-full ${c.dot} ${c.glow} md:hidden`} />

                      {/* Project number badge */}
                      <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${c.badge}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 3v12" />
                          <circle cx="18" cy="6" r="3" />
                          <circle cx="6" cy="18" r="3" />
                          <path d="M18 9a9 9 0 0 1-9 9" />
                        </svg>
                        Project {String(index + 1).padStart(2, '0')}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-100">{item.title}</h3>
                        <span className="rounded-full border border-cyan-300/25 px-3 py-1 text-xs text-cyan-800 dark:text-cyan-200">{item.role}</span>
                      </div>

                      <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 md:text-base">
                        <p>
                          <span className="font-semibold text-amber-700 dark:text-amber-100">Problem:</span> {item.problem}
                        </p>
                        <p>
                          <span className="font-semibold text-amber-700 dark:text-amber-100">Approach:</span> {item.approach}
                        </p>
                        <p>
                          <span className="font-semibold text-amber-700 dark:text-amber-100">Outcome:</span> {item.outcome}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {item.stack.map((tech) => (
                          <span key={tech} className="rounded-full border border-amber-300 dark:border-amber-300/25 px-3 py-1 text-xs text-amber-700 dark:text-amber-800 dark:text-amber-100/90">
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex gap-3">
                        <a
                          href={item.github}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded border border-cyan-300 dark:border-cyan-300/30 bg-cyan-100 dark:bg-cyan-300/10 px-3 py-2 text-sm text-cyan-800 dark:text-cyan-200 transition hover:bg-cyan-200 dark:hover:bg-cyan-200 dark:bg-cyan-300/20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                          GitHub
                        </a>
                        <a
                          href={item.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded border border-amber-300 dark:border-amber-300/30 bg-amber-100 dark:bg-amber-300/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-100 transition hover:bg-amber-200 dark:hover:bg-amber-200 dark:bg-amber-300/20"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Demo
                        </a>
                      </div>
                    </motion.article>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </motion.section>

        {/* Competitive Programming Section */}
        <motion.section
          variants={sectionAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="py-16"
          id="coding"
        >
          <SectionHeading
            eyebrow="Competitive Programming"
            title="Coding Profiles & Contest Ratings"
            subtitle="Consistent practice across multiple competitive programming platforms."
          />

          {/* Total stats banner */}
          <motion.div
            variants={cardAnim}
            className="mb-10 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-cyan-200 dark:border-cyan-300/15 bg-gradient-to-r from-[#10161f]/70 via-[#131320]/70 to-[#10161f]/70 p-5"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-100 dark:bg-cyan-300/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-600 dark:text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6" />
                  <polyline points="8 6 2 12 8 18" />
                </svg>
              </motion.div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-100">370+</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">Total Problems Solved</p>
              </div>
            </div>
            <div className="hidden h-8 w-px bg-slate-700 md:block" />
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-300 dark:border-amber-300/25 bg-amber-100 dark:bg-amber-300/10 text-lg">
                🏅
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-100">4</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">Active Platforms</p>
              </div>
            </div>
            <div className="hidden h-8 w-px bg-slate-700 md:block" />
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-300/10 text-lg"
              >
                🔥
              </motion.div>
              <div>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-100">Active</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">Contest Participation</p>
              </div>
            </div>
          </motion.div>

          {/* Carousel */}
          <CodingCarousel />
        </motion.section>

        {/* Technical Foundation & Collaboration */}
        <motion.section
          variants={sectionAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="py-16"
          id="technical-depth"
        >
          {/* --- Technical Foundation --- */}
          <SectionHeading
            eyebrow="Systems"
            title="Technical Foundation"
            subtitle="Areas I am actively building depth in through projects and practice."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="mb-16 grid gap-5 sm:grid-cols-2"
          >
            {technicalDepth.map((item, index) => {
              const iconMap = {
                code: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
                  </svg>
                ),
                layers: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
                  </svg>
                ),
                brain: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-1 2.65V12a3 3 0 0 1 3 3v1a3 3 0 0 1-3 3h-1" />
                    <path d="M8 22h8" /><path d="M12 18v4" />
                    <circle cx="12" cy="8" r="4" />
                  </svg>
                ),
                database: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" /><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                  </svg>
                ),
              }
              return (
                <motion.div
                  key={item.title}
                  variants={cardAnim}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-[#10161f]/80 to-[#131320]/80 p-6 transition-all duration-300"
                  style={{ '--card-accent': item.accent }}
                >
                  {/* Top accent line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="absolute left-0 top-0 h-[2px] w-full origin-left"
                    style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
                  />

                  {/* Icon */}
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-colors duration-300"
                    style={{ borderColor: `${item.accent}33`, background: `${item.accent}15`, color: item.accent }}
                  >
                    {iconMap[item.icon]}
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-semibold text-amber-700 dark:text-amber-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">{item.desc}</p>

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]"
                    style={{ background: item.accent }}
                  />
                </motion.div>
              )
            })}
          </motion.div>

          {/* --- Collaboration & Ownership --- */}
          <SectionHeading
            eyebrow="Teamwork"
            title="Collaboration & Ownership"
            subtitle="How I contribute to teams as a fresher engineer."
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            className="grid gap-5 sm:grid-cols-2"
          >
            {leadership.map((item, index) => {
              const iconMap = {
                rocket: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                  </svg>
                ),
                presentation: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h20" /><path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
                    <path d="m7 21 5-5 5 5" />
                  </svg>
                ),
                users: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                ),
                trophy: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                ),
              }
              return (
                <motion.div
                  key={item.title}
                  variants={cardAnim}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-2xl border border-slate-700/40 bg-gradient-to-br from-[#10161f]/80 to-[#1a1012]/80 p-6 transition-all duration-300"
                >
                  {/* Step number */}
                  <div className="absolute right-4 top-4 text-4xl font-black text-slate-800/60">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border transition-colors duration-300"
                    style={{ borderColor: `${item.accent}33`, background: `${item.accent}15`, color: item.accent }}
                  >
                    {iconMap[item.icon]}
                  </div>

                  {/* Content */}
                  <h3 className="mb-2 text-lg font-semibold text-amber-700 dark:text-amber-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">{item.desc}</p>

                  {/* Bottom accent bar */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.12, ease: 'easeOut' }}
                    viewport={{ once: true }}
                    className="mt-5 h-[2px] origin-left rounded-full"
                    style={{ background: `linear-gradient(90deg, ${item.accent}, transparent)` }}
                  />

                  {/* Hover glow */}
                  <div
                    className="pointer-events-none absolute -bottom-10 -right-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-[0.08]"
                    style={{ background: item.accent }}
                  />
                </motion.div>
              )
            })}
          </motion.div>
        </motion.section>

        {writingAndTalks.length > 0 ? (
          <motion.section
            variants={sectionAnim}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="py-16"
            id="writing"
          >
            <SectionHeading
              eyebrow="Knowledge Feed"
              title="Writing, Notes, and Community Work"
              subtitle="Resources and talks where I share what I learn while building projects."
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              className="grid gap-4 md:grid-cols-3"
            >
              {writingAndTalks.map((item) => (
                <motion.a
                  key={item.title}
                  variants={cardAnim}
                  whileHover={{ y: -6, scale: 1.02 }}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-cyan-200 dark:border-cyan-300/15 bg-slate-900/70 p-5 transition hover:border-cyan-300/45"
                >
                  <p className="text-xs uppercase tracking-[0.15em] text-cyan-600 dark:text-cyan-300">{item.type}</p>
                  <h3 className="mt-2 font-semibold text-amber-700 dark:text-amber-100">{item.title}</h3>
                </motion.a>
              ))}
            </motion.div>
          </motion.section>
        ) : null}

        <motion.section
          variants={sectionAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="py-16"
          id="certifications"
        >
          <SectionHeading
            eyebrow="Credentials"
            title="Certifications"
            subtitle="Industry-recognized certifications validating core technical competencies."
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {certifications.map((cert) => {
              const Card = cert.href ? 'a' : 'div'
              const linkProps = cert.href ? { href: cert.href, target: '_blank', rel: 'noreferrer' } : {}
              return (
                <motion.div
                  key={cert.title}
                  variants={cardAnim}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group relative overflow-hidden rounded-xl border border-cyan-200 dark:border-cyan-300/15 bg-gradient-to-br from-[#10161f]/80 to-[#1a1012]/80 transition hover:border-cyan-400 dark:hover:border-cyan-300 dark:border-cyan-300/40"
                >
                  <Card {...linkProps} className="block p-6">
                    <div className="absolute -right-4 -top-4 text-6xl opacity-10 transition-opacity group-hover:opacity-20">
                      {cert.icon}
                    </div>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-amber-200 dark:border-amber-300/20 bg-amber-100 dark:bg-amber-300/10 text-2xl">
                      {cert.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-100">{cert.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500 dark:text-slate-500 dark:text-slate-400">{cert.issuer}</p>

                    {cert.href && (
                      <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-300 opacity-70 transition-opacity group-hover:opacity-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        View Certificate
                      </div>
                    )}
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.section>

        <motion.section
          variants={sectionAnim}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          id="contact"
          className="relative overflow-hidden rounded-2xl border border-cyan-200 dark:border-cyan-200 dark:border-cyan-300/20 bg-gradient-to-br from-[#0f141d]/95 via-[#131320]/95 to-[#1b1112]/95 p-8 md:p-14"
        >
          {/* Animated ambient glow orbs */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.12, 0.06] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-400 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="pointer-events-none absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-amber-400 blur-[100px]"
          />
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 blur-[80px]"
          />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              animate={{ y: [0, -30, 0], x: [0, i % 2 === 0 ? 15 : -15, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
              className="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-cyan-300/40"
              style={{ left: `${15 + i * 18}%`, top: `${20 + (i * 13) % 60}%` }}
            />
          ))}

          <div className="relative flex flex-col items-center text-center">
            {/* Icon with orbital rings */}
            <div className="relative mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-4 rounded-full border border-dashed border-cyan-200 dark:border-cyan-200 dark:border-cyan-300/20"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-8 rounded-full border border-dotted border-amber-300/10"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-cyan-300 dark:border-cyan-300/30 bg-gradient-to-br from-cyan-300/15 to-cyan-300/5 shadow-[0_0_30px_rgba(34,211,238,0.15)]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-cyan-600 dark:text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              </motion.div>
            </div>

            {/* Status badge with glow */}
            <motion.div
              animate={{ boxShadow: ['0 0 0 rgba(52,211,153,0)', '0 0 20px rgba(52,211,153,0.15)', '0 0 0 rgba(52,211,153,0)'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-100 dark:bg-emerald-400/10 px-5 py-2"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold tracking-wider text-emerald-700 dark:text-emerald-300">AVAILABLE FOR OPPORTUNITIES</span>
            </motion.div>

            {/* Gradient heading */}
            <h2 className="mt-3 bg-gradient-to-r from-amber-200 via-amber-100 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Let&apos;s Connect
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-300/90">
              Looking for opportunities to contribute, learn fast, and grow in a strong engineering environment.
              Open to internships and fresher roles.
            </p>

            {/* Animated down arrow */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-6 text-cyan-600 dark:text-cyan-300/50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          {/* Contact cards with per-platform colors */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            className="relative mt-10 grid gap-5 md:grid-cols-3"
          >
            {contactLinks.map((item) => (
              <motion.a
                key={item.label}
                variants={cardAnim}
                whileHover={{ y: -6, scale: 1.04 }}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noreferrer' : undefined}
                className={`group relative flex flex-col items-center gap-3 overflow-hidden rounded-xl border bg-[#0c1119]/80 p-6 text-center transition-all duration-300 ${item.label === 'Email'
                  ? 'border-cyan-400/15 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.12)]'
                  : item.label === 'GitHub'
                    ? 'border-slate-500/20 hover:border-slate-400/50 hover:shadow-[0_0_30px_rgba(148,163,184,0.1)]'
                    : 'border-blue-400/15 hover:border-blue-400/50 hover:shadow-[0_0_30px_rgba(96,165,250,0.12)]'
                  }`}
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-300 ${item.label === 'Email'
                  ? 'border border-cyan-200 dark:border-cyan-200 dark:border-cyan-300/20 bg-cyan-100 dark:bg-cyan-300/10 text-cyan-600 dark:text-cyan-300 group-hover:bg-cyan-200 dark:hover:bg-cyan-200 dark:bg-cyan-300/20 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                  : item.label === 'GitHub'
                    ? 'border border-slate-500/20 bg-slate-400/10 text-slate-600 dark:text-slate-300 group-hover:bg-slate-400/20 group-hover:shadow-[0_0_15px_rgba(148,163,184,0.15)]'
                    : 'border border-blue-400/20 bg-blue-400/10 text-blue-400 group-hover:bg-blue-400/20 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.2)]'
                  }`}>
                  {item.icon}
                </div>
                <p className="text-base font-semibold text-slate-100">{item.label}</p>
              </motion.a>
            ))}
          </motion.div>
        </motion.section>
      </main>
    </div>
  )
}
