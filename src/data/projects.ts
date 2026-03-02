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
    subtitle: 'Ollama Grading and Rubric Evaluator',
    description:
      'OGRE is a chrome browser extension (OGRE Desktop App in progress) to help support educators in more objective and faster feedback to students. Designed to be highly optimized for consistency across multiple sessions OGRE helps educators create, design, and edit rubrics while also helps educators sift through student response for the actual conceptual responses.',
    dateStart: 'Spring 2026',
    dateEnd: null,
    status: 'active',
    featured: true,
    repoUrl: 'https://github.com/shuff57/O.G.R.E-OllamaGradingRubricEvaluator',
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
    repoUrl: 'https://github.com/shuff57',
    iframeUrl: 'https://rashio.pages.dev/',
    type: 'tool',
  },
  {
    id: 'bookshelf',
    title: 'bookSHelf',
    subtitle: 'Book Merge and Remastering Tool',
    description:
      'A custom book merge and remastering tool used to create and adopt introductory concepts of mechatronics engineering curricula for Chico Unified School District. No app yet.',
    dateStart: '2025',
    dateEnd: '2026',
    status: 'active',
    featured: true,
    iframeUrl: 'https://shuff57.github.io/bookSHelf/',
    type: 'tool',
  },
  {
    id: 'wishlist',
    title: 'wiSHlist',
    description: 'Proof of concept personal project.',
    dateStart: '2015',
    dateEnd: null,
    status: 'concept',
    featured: false,
    type: 'tool',
  },
  {
    id: 'shdev',
    title: 'shDev',
    description: 'Proof of concept personal project.',
    dateStart: '2015',
    dateEnd: null,
    status: 'concept',
    featured: false,
    type: 'tool',
  },
  {
    id: '11gauge',
    title: '11Gauge',
    description: 'Proof of concept personal project.',
    dateStart: '2015',
    dateEnd: null,
    status: 'concept',
    featured: false,
    type: 'tool',
  },
  {
    id: 'animated-fill-buttons',
    title: 'animated-fill-buttons',
    description: 'Personal project for animated fill button components.',
    dateStart: '2015',
    dateEnd: null,
    status: 'concept',
    featured: false,
    type: 'tool',
  },
  {
    id: 'shufflr',
    title: 'Shufflr',
    description: 'Proof of concept personal project.',
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
    title: 'Chico STEM Connections Collaborative (CSC\u00B2) - Lead Mentor NSC Coordinator',
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
    title: 'CSC\u00B2 STEMCAT Mentor Coordinator',
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
    description:
      'QRAT and TQR is a CSU Sacramento developed highschool mathematics curriculum.',
    dateStart: 'June 2020',
    dateEnd: null,
    status: 'completed',
    featured: false,
    type: 'curriculum',
  },
]
