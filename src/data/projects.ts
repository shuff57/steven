export type ProjectStatus = 'active' | 'in-progress' | 'concept' | 'completed'

export interface Project {
  id: string
  title: string
  subtitle?: string
  description: string
  dateStart: string
  dateEnd: string | null
  status: ProjectStatus
  featured: boolean
  externalUrl?: string   // live app / demo URL
  externalLabel?: string // custom label for the external link
  repoUrl?: string       // GitHub / source code URL
  iframeUrl?: string     // embeddable preview URL
  videoUrl?: string      // demo video path (public/)
  posterUrl?: string     // video poster image path (public/)
  type: 'tool' | 'initiative' | 'grant' | 'curriculum'
}

export const projects: Project[] = [
  // ─── TOOLS ─────────────────────────────────────────────────────────
  {
    id: 'rashio',
    title: 'rāSHio',
    subtitle: 'ray-she-oh',
    description:
      'rāSHio (ray-she-oh) is a browser-based statistical analysis platform built for the introductory statistics student, replacing the confusion of StatCrunch and the TI-84 with tools built around how the course actually teaches. It pairs a custom spreadsheet engine (Excel-style formulas, statistics-first data entry) with a full analysis suite: descriptive statistics, one- and two-sample t-tests, z-tests, ANOVA, chi-square, and normal/binomial distribution work with interactive probability shading. D3-powered histograms, box plots, scatterplots with regression, and normal curves update live as the data changes. All computation runs in the browser, so data sets stay on the student\'s machine and the core tools work offline. Accounts, admin/teacher/student roles, and .edu teacher verification run on Cloudflare Pages Functions and D1.',
    dateStart: '2025',
    dateEnd: null,
    status: 'active',
    featured: true,
    externalUrl: 'https://rashio.app',
    videoUrl: '/videos/rashio-demo.mp4',
    // repoUrl removed — only live site button shown
    type: 'tool',
  },
  {
    id: 'bookshelf',
    title: 'bookSHelf',
    subtitle: 'AI-powered textbook enhancement pipeline',
    description:
      'An 11-step automated pipeline that transforms raw textbook content into interactive Student Enhanced Edition HTML pages, complete with plain-English explanations, worked examples, step-by-step solutions, verified math, embedded videos, and a navigable web interface. Features AI-driven rewriting for student accessibility, independent math verification by subagents, and generates standalone pages with MathJax and collapsible solutions. Finished books are published to oerbookshelf.app. The pipeline also ships as an Electron desktop app: a three-step wizard for starting a new textbook, a dashboard that runs and monitors all eleven steps, live logs, and a SQLite-backed session record — so the whole process runs without touching a command line.',
    dateStart: '2025',
    dateEnd: null,
    status: 'active',
    featured: true,
    externalUrl: 'https://oerbookshelf.app',
    externalLabel: 'oerbookshelf.app',
    videoUrl: '/videos/bookSHelf-demo.mp4',
    // repoUrl removed — only live site button shown
    // posterUrl removed — file does not exist in public/videos
    type: 'tool',
  },
  {
    id: 'boring-clicks',
    title: 'Boring Clicks',
    subtitle: 'Teach-by-example browser automation for the tedious parts of the job',
    description:
      'A desktop app (Tauri + Svelte 5) that watches you do a repetitive browser task once, then does it for you. Open any site in the embedded browser, run discovery to map its interactive fields, and capture the workflow by example; the saved workflow persists as a reusable skill and replays later without retraining. Selectors that stop matching are re-derived from live page state instead of failing silently, and every run reports each action taken and anything skipped. Student data never leaves the machine: a deterministic redactor sits as a hard gate in front of any model call, stripping identifiers before the payload goes out and rehydrating them locally afterward. Powered by S.T.E.V.E, the underlying agent framework.',
    dateStart: '2026',
    dateEnd: null,
    status: 'in-progress',
    featured: true,
    // repoUrl omitted — shuff57/steve-desktop is private (404s for visitors)
    type: 'tool',
  },
  {
    id: 'ogre',
    title: 'O.G.R.E',
    subtitle: 'AI-powered grading desktop app for educators',
    description:
      'O.G.R.E is a native desktop app (Electron + Svelte 5) that grades 30+ student written responses in minutes. It uses a fine-tuned AI model that runs locally via Ollama, keeping student data fully private and off any cloud service. Load any grading page in the embedded browser, attach a saved rubric, and run a batch grade. All students are scored in a single AI pass for consistent, calibrated results. Scores and feedback are written back to the page for your review before anything is submitted. Rubrics are stored in SQLite and reused across sessions. Supports any grading platform via configurable Site Profiles, with MyOpenMath included out of the box.',
    dateStart: 'Spring 2026',
    dateEnd: null,
    status: 'active',
    featured: true,
    repoUrl: 'https://github.com/shuff57/O.G.R.E-OllamaGradingRubricEvaluator',
    videoUrl: '/videos/OGRE-demo.mp4',
    type: 'tool',
  },
  {
    id: 'slag',
    title: 'SLAG',
    subtitle: 'Settings Lookup & Auto-Guide — weld settings for your actual machine',
    description:
      'Weld setting charts tell you an amperage and a wire feed speed in inches per minute. The machine in front of you has a knob reading 1 to 10. SLAG closes that gap. Enter process, material, thickness, and wire or rod diameter and it computes brand-agnostic targets — amperage, wire feed, voltage, gas, tungsten — then translates them onto a specific machine\'s controls, interpolating the target feed rate into the number you actually turn the dial to, whether that dial reads 1–10 or 0–100. It handles continuous voltage knobs and discrete tap settings, and warns on out-of-range feed, over-capacity amperage, or a DC-only machine asked to weld aluminum. Signed-in welders can adjust the gauges to what genuinely works on their machine and save it as a named tweak that reloads the whole job setup later. Built with React and Vite on Cloudflare Pages Functions with a D1 database.',
    dateStart: '2026',
    dateEnd: null,
    status: 'concept',
    featured: false,
    externalUrl: 'https://slagweld.pages.dev',
    videoUrl: '/videos/SLAG-demo.mp4',
    // repoUrl omitted — shuff57/slag is private (404s for visitors)
    type: 'tool',
  },
  {
    id: 'earshot',
    title: 'earSHot',
    subtitle: 'Self-hosted music library and discovery engine',
    description:
      'A self-hosted music server that streams a personal library to any device, online or off. Beyond playback it generates song radios and daily/weekly discovery playlists saved back to the server, accepts plain-English search for music across the library, and can acquire and file new music automatically with metadata matching and duplicate detection. Runs as a set of Docker profiles brought up by a single bootstrap script, so a full stack — player, AI features, acquisition, remote access — can be started or trimmed one flag at a time.',
    dateStart: '2026',
    dateEnd: null,
    status: 'active',
    featured: false,
    // repoUrl omitted — shuff57/earSHot is private (404s for visitors)
    type: 'tool',
  },
  {
    id: 'reshape',
    title: 'reSHape',
    subtitle: 'Mesh-to-CAD converter for mechanical parts',
    description:
      'Converts STL and 3MF triangle meshes of mechanical parts into STEP solids with true analytic geometry — real planes, cylinders, cones, and spheres with exact edges, not thousands of triangles wrapped as faces. It segments the mesh into smooth regions, fits a primitive surface to each, merges fragments back into whole features, strips engraving, and hands the analytic surfaces to OpenCASCADE to build a watertight solid. Every output is scored against the input mesh and reported as pass, warn, or fail, so it never silently returns a bad conversion. Includes promptCAD, a companion tool that turns a plain-language description into a parametric FreeCAD model.',
    dateStart: '2026',
    dateEnd: null,
    status: 'in-progress',
    featured: false,
    type: 'tool',
  },
  {
    id: 'agent-evo',
    title: 'Agent-Evo',
    subtitle: 'Self-evolving agent framework for Claude Code',
    description:
      'The framework behind the AI tooling used across these projects. Agent-Evo defines a roster of specialized agents, groups them into teams and chains for multi-stage work, and gives them persistent memory that carries learnings between sessions. Its evolution workspace analyzes how a session actually went and proposes small, surgical edits to the agents and skills themselves, so the toolchain improves from use rather than from rewrites. Installs with a single script that detects the platform, backs up existing configuration, and validates every agent, team, and chain before finishing.',
    dateStart: '2026',
    dateEnd: null,
    status: 'active',
    featured: false,
    repoUrl: 'https://github.com/shuff57/agent-evo',
    type: 'tool',
  },
  {
    id: 'stat-grader',
    title: 'Fine-tuned AI',
    subtitle: 'Fine-tuned LLM for grading statistics',
    description:
      'A fine-tuned Qwen 3.5 9B model built for locally grading introductory statistics written responses. Designed to run privately via Ollama, keeping student data off any cloud service. Powers the grading engine behind O.G.R.E.',
    dateStart: '2026',
    dateEnd: null,
    status: 'active',
    featured: false,
    externalUrl: 'https://ollama.com/shuff57/qwen3.5-9B-stat-grader',
    externalLabel: 'Ollama AI Model',
    type: 'tool',
  },
  {
    id: 'dad',
    title: 'D.A.D',
    subtitle: 'Dynamic Assessment Developer',
    description:
      'DAD is a MyOpenMath (MOM) question writing tool currently in development. The goal is to use a simple chat bot "trained" on MyOpenMath documentation to help write robust, dynamic questions and to standardize formatting across questions. The tool will be aimed at the non-technical MyOpenMath user who wants to write questions but doesn\'t know how to write code.',
    dateStart: '2026',
    dateEnd: null,
    status: 'in-progress',
    featured: false,
    type: 'tool',
  },
  {
    id: 'animated-fill-buttons',
    title: 'animated-fill-buttons',
    subtitle: 'Animated fill button component library',
    description:
      'A collection of animated fill button components built with Google AI Studio and Gemini. Provides reusable, customizable animated button styles as a React/TypeScript component library for use across projects.',
    dateStart: '2025',
    dateEnd: null,
    status: 'concept',
    featured: false,
    externalUrl: 'https://aistudio.google.com/apps/drive/121tDWYDOJOH78Xqge_mZlRCEASRTva69?showPreview=true&showAssistant=true',
    repoUrl: 'https://github.com/shuff57/animated-fill-buttons',
    type: 'tool',
  },
  {
    id: 'shufflr',
    title: 'Shufflr',
    subtitle: 'Classroom seating chart randomizer',
    description:
      'A seating chart tool for teachers that randomizes and manages classroom seating arrangements.',
    dateStart: '2025',
    dateEnd: null,
    status: 'concept',
    featured: false,
    type: 'tool',
  },
  {
    id: '11gauge',
    title: '11Gauge',
    subtitle: 'AI-powered weld grader',
    description:
      'An AI-powered weld grading tool that analyzes photos and videos of welds using vision models (Qwen3-VL) and a configurable reasoning model (ChatGPT, Gemini, DeepSeek, and more). Configure material type, weld process (MIG, TIG, Stick, Flux Core), material thickness, joint type, and weld position, then upload media to receive a detailed grading report.',
    dateStart: '2025',
    dateEnd: null,
    status: 'concept',
    featured: false,
    externalUrl: 'https://11gauge.pages.dev/',
    videoUrl: '/videos/11Gauge-demo.mp4',
    type: 'tool',
  },
  {
    id: 'wishlist',
    title: 'wiSHlist',
    subtitle: 'Classroom supply wishlist app for teachers',
    description:
      'A wishlist application designed for teachers to create and share classroom supply lists with parents and supporters. Built with React 18, TypeScript, and Appwrite. Features drag-and-drop wishlist reordering, real-time sync, shareable public links, purchase tracking to prevent duplicate purchases, and dark/light mode support.',
    dateStart: '2025',
    dateEnd: null,
    status: 'concept',
    featured: false,
    repoUrl: 'https://github.com/shuff57/wiSHlist',
    videoUrl: '/videos/wiSHlist-demo.mp4',
    type: 'tool',
  },
  {
    id: 'shdev',
    title: 'shDev',
    subtitle: 'Browser-based code editor with built-in version control',
    description:
      'A self-hosted, browser-based code editor built with Next.js, Monaco Editor (the engine behind VS Code), and React Arborist for file tree navigation. Includes shRepo, a custom-built, user-friendly Git-style version control interface that serves as the central hub for project management, with commit, history, and restore functionality.',
    dateStart: '2025',
    dateEnd: null,
    status: 'concept',
    featured: false,
    repoUrl: 'https://github.com/shuff57/shCode',
    externalUrl: 'https://coder.appwrite.network/',
    videoUrl: '/videos/shDev-demo.mp4',
    type: 'tool',
  },
  // ─── INITIATIVES / CURRICULUM / GRANTS ─────────────────────────────
  {
    id: 'golden-state-pathways-grant',
    title: 'Golden State Pathways Grant Recipient – approximately $300,000',
    subtitle: 'Robotics pathway development at Pleasant Valley High School',
    description:
      'Create/Develop a robotics pathway at Pleasant Valley High School.',
    dateStart: 'Spring 2024',
    dateEnd: null,
    status: 'active',
    featured: false,
    type: 'grant',
  },
  {
    id: 'embedded-systems-robotics',
    title: 'Embedded Systems and Robotics Course and Curriculum Developer',
    subtitle: 'Mechatronics engineering curriculum for Chico Unified School District',
    description:
      'Created and adopted introductory concepts of mechatronics engineering curricula (Arduino Programming and core electrical concepts, introduction to 3D design (FreeCAD) and 3D printing, introduction to different types machining and milling) for Chico Unified School District using a custom book merge and remastering tool (bookSHelf) I developed.',
    dateStart: '2025',
    dateEnd: '2026',
    status: 'active',
    featured: false,
    type: 'curriculum',
  },
  {
    id: 'cs-pathway-update',
    title: 'Computer Science Pathway Developer (Update)',
    subtitle: 'CTE Information & Communication Technologies Pathway concentrator',
    description:
      'Introduction to Computer Science is a hybrid block-based programming/JavaScript semester elective course. AP Computer Science is dual enrolled and is now called Advanced Computer Science (Advanced CS). Advanced CS is now the concentrator course for the Career Technical Education: Information and Communication Technologies Pathway with the new Embedded Systems and Robotics as the Capstone course.',
    dateStart: 'Spring 2026',
    dateEnd: null,
    status: 'active',
    featured: false,
    type: 'curriculum',
  },
  {
    id: 'cs-pathway-original',
    title: 'Computer Science Pathway Developer',
    subtitle: 'Intro CS and AP CSP pathway at Pleasant Valley High School',
    description:
      'Created computer science pathway (Introduction to Computer Science in JavaScript, AP Computer Science Principles in Python/JavaScript) for Pleasant Valley High School.',
    dateStart: 'Fall 2022',
    dateEnd: null,
    status: 'completed',
    featured: false,
    type: 'curriculum',
  },
  {
    id: 'cs-curriculum-developer',
    title: 'Computer Science Curriculum Developer',
    subtitle: 'District-adopted CS curricula for Chico Unified School District',
    description:
      'Created and adopted computer science curricula (Introduction to Computer Science in JavaScript, AP Computer Science Principles in Python/JavaScript) for Chico Unified School District.',
    dateStart: 'Fall 2022',
    dateEnd: null,
    status: 'completed',
    featured: false,
    type: 'curriculum',
  },
  {
    id: 'csc2-lead-mentor',
    title: 'Chico STEM Connections Collaborative (CSC²) - Lead Mentor NSC Coordinator',
    subtitle: 'NSC payroll, study center management, and program coordination',
    description:
      'Assist with College of Natural Sciences (NSC) payroll, manage the NSC study center, assist with NSC program management.',
    dateStart: '2021',
    dateEnd: '2022',
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'csc2-stemcat',
    title: 'CSC² STEMCAT Mentor Coordinator',
    subtitle: 'First-year student mentorship and institutional knowledge programming',
    description:
      'Coordinate student mentors with student mentees, plan activities and learning opportunities around first year institutional knowledge.',
    dateStart: '2021',
    dateEnd: '2022',
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'reach-faculty-mentor',
    title: 'REACH Faculty Mentor',
    subtitle: 'Guiding first-year students in university life, skills, and resources',
    description:
      'A role guiding first-year students toward understanding university life, skills and resources.',
    dateStart: '2021',
    dateEnd: '2022',
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'project-math-placement',
    title: '"Project MATH" Community Placement Teacher',
    subtitle: 'Hosting Chico State student teachers in high school classroom',
    description:
      'Host Project MATH students from Chico State in my high school classroom.',
    dateStart: 'Fall 2022',
    dateEnd: null,
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'project-math-mentor',
    title: '"Project MATH" Mentor Teacher',
    subtitle: 'Developing pedagogy for Mathematics Education majors',
    description:
      'Work with Mathematics Education majors in fostering and developing an understanding of core pedagogical ideas.',
    dateStart: '2020',
    dateEnd: '2021',
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'eap-research-assistant',
    title: 'Early Assessment Program Mathematics and Research Assistant',
    subtitle: 'CAASPP data collection and 11th grade outreach across service area high schools',
    description:
      'Responsibilities include but are not limited to CAASPP Data collection, organization and updating high school data. Visit service area high schools to present to 11th grade students.',
    dateStart: '2018',
    dateEnd: '2024',
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'early-start-curriculum',
    title: 'Early Start Program Curriculum Developer',
    subtitle: 'Number sense, algebraic thinking, and university orientation curriculum',
    description:
      'Developed and implemented curriculum centered around number sense, graphical reasoning, algebraic thinking, and university processes and campus information.',
    dateStart: 'Summer 2019',
    dateEnd: 'Summer 2022',
    status: 'completed',
    featured: false,
    externalUrl: undefined,
    type: 'curriculum',
  },
  {
    id: 'avhs-steam7',
    title: 'Pilot Teacher and Curriculum Developer for AVHS STEAM7 Program',
    subtitle: 'Science, Technology, Engineering, Art, and Math',
    description:
      'A three teacher co-collaboration for helping students develop skills necessary for the culminating project meant to capture three or more facets of STEAM.',
    dateStart: '2017',
    dateEnd: '2018',
    status: 'completed',
    featured: false,
    type: 'curriculum',
  },
  {
    id: 'si-mentor',
    title: 'Supplemental Instruction (SI) "Student Leader" Mentor',
    subtitle: 'Coordinating concept support with SI student leaders',
    description:
      'Work with SI student leader to determine which concepts will be further supported.',
    dateStart: 'Fall 2019',
    dateEnd: 'Fall 2020',
    status: 'completed',
    featured: false,
    type: 'initiative',
  },
  {
    id: 'qrat-tqr',
    title: 'Trained QRAT and TQR Curriculum Instructor',
    subtitle: 'CSU Sacramento high school mathematics curriculum',
    description:
      'QRAT and TQR is a CSU Sacramento developed highschool mathematics curriculum.',
    dateStart: 'June 2020',
    dateEnd: null,
    status: 'completed',
    featured: false,
    type: 'curriculum',
  },
]
