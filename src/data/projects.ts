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
  repoUrl?: string       // GitHub / source code URL
  iframeUrl?: string     // embeddable preview URL
  videoUrl?: string      // demo video path (public/)
  posterUrl?: string     // video poster image path (public/)
  type: 'tool' | 'initiative' | 'grant' | 'curriculum'
}

export const projects: Project[] = [
  // ─── TOOLS ─────────────────────────────────────────────────────────
  {
    id: 'dad',
    title: 'D.A.D',
    subtitle: 'Dynamic Assessment Developer',
    description:
      'DAD is a MyOpenMath (MOM) question writing tool currently in development. The goal is to use a simple chat bot "trained" on MyOpenMath documentation to help write robust, dynamic questions and to standardize formatting across questions. The tool will be aimed at the non-technical MyOpenMath user who wants to write questions but doesn\'t know how to write code.',
    dateStart: '2026',
    dateEnd: null,
    status: 'in-progress',
    featured: true,
    type: 'tool',
  },
  {
    id: 'ogre',
    title: 'O.G.R.E',
    subtitle: 'AI-powered grading tools for educators',
    description:
      'A collection of AI-powered grading tools including a Chrome Extension for manual AI-assisted grading in the browser with custom rubrics, and an autonomous /grade skill for automated batch grading of 30+ students. Processes both text and images (math problems, diagrams) using vision-capable models, with rubric import via text or screenshot and progress tracking with resume capability for large classes.',
    dateStart: 'Spring 2026',
    dateEnd: null,
    status: 'active',
    featured: true,
    repoUrl: 'https://github.com/shuff57/O.G.R.E-OllamaGradingRubricEvaluator',
    videoUrl: '/videos/OGRE-demo.mp4',
    type: 'tool',
  },
  {
    id: 'rashio',
    title: 'rāSHio',
    subtitle: 'ray-she-oh',
    description:
      'rāSHio (ray-she-oh) is a custom statistical calculator designed specifically for the introductory statistics student to help minimize the confusion when using statCrunch or a ti-84 calculator while also increasing accessibility to the core tools needed to be successful.',
    dateStart: '2025',
    dateEnd: '2026',
    status: 'active',
    featured: true,
    externalUrl: 'https://rashio.pages.dev',
    videoUrl: '/videos/rashio-demo.mp4',
    // repoUrl removed — only live site button shown
    type: 'tool',
  },
  {
    id: 'bookshelf',
    title: 'bookSHelf',
    subtitle: 'AI-powered textbook enhancement pipeline',
    description:
      'An 11-step automated pipeline that transforms raw textbook content into interactive Student Enhanced Edition HTML pages — complete with plain-English explanations, worked examples, step-by-step solutions, verified math, embedded videos, and a navigable web interface. Features AI-driven rewriting for student accessibility, independent math verification by subagents, and generates standalone pages with MathJax and collapsible solutions.',
    dateStart: '2025',
    dateEnd: '2026',
    status: 'active',
    featured: true,
    iframeUrl: 'https://shuff57.github.io/bookSHelf/',
    videoUrl: '/videos/bookSHelf-demo.mp4',
    repoUrl: 'https://github.com/shuff57/bookSHelf',
    // posterUrl removed — file does not exist in public/videos
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
    externalUrl: 'https://wishlist.huffpalmer.fyi/',
    repoUrl: 'https://github.com/shuff57/wiSHlist',
    videoUrl: '/videos/wiSHlist-demo.mp4',
    type: 'tool',
  },
  {
    id: 'shdev',
    title: 'shDev',
    subtitle: 'Browser-based code editor with built-in version control',
    description:
      'A self-hosted, browser-based code editor built with Next.js, Monaco Editor (the engine behind VS Code), and React Arborist for file tree navigation. Includes shRepo — a custom-built, user-friendly Git-style version control interface that serves as the central hub for project management, with commit, history, and restore functionality.',
    dateStart: '2025',
    dateEnd: null,
    status: 'concept',
    featured: false,
    repoUrl: 'https://github.com/shuff57/shCode',
    externalUrl: 'https://coder.appwrite.network/',
    videoUrl: '/videos/shDev-demo.mp4',
    type: 'tool',
  },
  {
    id: '11gauge',
    title: '11Gauge',
    subtitle: 'AI-powered weld grader',
    description:
      'An AI-powered weld grading tool that analyzes photos and videos of welds using vision models (Qwen3-VL) and a configurable reasoning model (ChatGPT, Gemini, DeepSeek, and more). Configure material type, weld process (MIG, TIG, Stick, Flux Core), material thickness, joint type, and weld position — then upload media to receive a detailed grading report.',
    dateStart: '2015',
    dateEnd: null,
    status: 'concept',
    featured: false,
    externalUrl: 'https://11gauge.pages.dev/',
    videoUrl: '/videos/11Gauge-demo.mp4',
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
    dateStart: '2015',
    dateEnd: null,
    status: 'concept',
    featured: false,
    type: 'tool',
  },

  // ─── INITIATIVES / CURRICULUM / GRANTS ─────────────────────────────
  {
    id: 'golden-state-pathways-grant',
    title: 'Awarded Golden State Pathways Grant for approximately $300,000',
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
    dateEnd: null,
    status: 'active',
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
