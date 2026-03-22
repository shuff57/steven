export type PositionStatus = 'current' | 'past'
export type TeachingLevel = 'post-secondary' | 'secondary' | 'primary'

export interface Course {
  code: string
  name: string
  description: string
}

export interface Position {
  title: string
  courses?: Course[]
  notes?: string
}

export interface Institution {
  name: string
  location: string
  dateStart: string
  dateEnd: string | null // null means current
  status: PositionStatus
  level: TeachingLevel
  positions: Position[]
  concurrent?: boolean // true if this overlaps with other current positions
}

export const experiences: Institution[] = [
  // ─── POST-SECONDARY ───────────────────────────────────────────────
  {
    name: 'Butte College',
    location: 'Oroville, CA',
    dateStart: '2023',
    dateEnd: null,
    status: 'current',
    level: 'post-secondary',
    concurrent: true,
    positions: [
      {
        title: 'Adjunct Instructor',
        courses: [
          {
            code: 'Math 11',
            name: 'Liberal Arts Mathematics',
            description:
              "This course is applicable for students whose major doesn't dictate a specific transfer level math course. It is a survey of mathematical concepts in a variety of areas. The topics include probability, statistics, set theory, measurement, geometry, and business finance. Transfers to CSU.",
          },
          {
            code: 'Math 12',
            name: 'Mathematics for Business Decisions (Finite Mathematics)',
            description:
              'Linear functions, systems of linear equations and inequalities, matrices, linear programming, mathematics of finance, sets and Venn diagrams, combinatorial techniques and an introduction to probability. Applications in business, economics and social sciences. Transfers to CSU/UC.',
          },
          {
            code: 'Math 18',
            name: 'Intro to Statistics',
            description:
              'This course uses data from disciplines including business, social sciences, psychology, life science, health science, and education to create better understanding of probability techniques, hypothesis testing, and predictive techniques to facilitate decision-making. Topics include descriptive statistics; probability and sampling distributions; statistical inference; correlation and linear regression; analysis of variance, chi-square and t-tests; and application of technology for statistical analysis including the interpretation of the relevance of the statistical findings. Transfers to CSU/UC.',
          },
          {
            code: 'Math 30',
            name: 'Analytic Geometry and Calculus I',
            description:
              'Primarily for Science, Technology, Engineering & Math (STEM) Majors, this is the first course in differential and integral calculus of a single variable: functions, limits and continuity, techniques and applications of differentiation and integration, Fundamental Theorem of Calculus. Transfers to CSU/UC.',
          },
        ],
      },
    ],
  },
  {
    name: 'California State University, Chico',
    location: 'Chico, CA',
    dateStart: '2018',
    dateEnd: '2022',
    status: 'past',
    level: 'post-secondary',
    positions: [
      {
        title: 'Lecturer',
        courses: [
          {
            code: 'MATH 51/005L',
            name: 'Foundational Mathematics B',
            description:
              'Foundational level California Common Core State Standards mathematics topics in support of general education mathematics. This course is a supplemental requirement for Math Ready with Support students required to enroll in designated general education courses.',
          },
          {
            code: 'MATH 101',
            name: 'Patterns of Mathematical Thought',
            description:
              'An informal approach to mathematics designed to bring an appreciation and workable knowledge of the subject to non-majors.',
          },
          {
            code: 'MATH 105',
            name: 'Introduction to Statistics',
            description:
              'Summary of numerical data, distributions, linear regression, and introduction to statistical inference. Statistical software is used.',
          },
          {
            code: 'MATH 108',
            name: 'Statistics of Business and Economics',
            description:
              'Descriptive statistics, sampling theory, statistical inference and tests of hypotheses, analysis of variance, chi-square tests, simple regression and correlation, and multiple regression and correlation.',
          },
          {
            code: 'MATH 118',
            name: 'Trigonometry',
            description:
              'Trigonometric functions, graphs, identities and conditional equations, logarithms, solutions of triangles, and complex numbers.',
          },
          {
            code: 'MATH 119',
            name: 'Precalculus Mathematics',
            description:
              'Functions and graphs, including polynomial, rational, exponential, logarithmic, and trigonometric functions. Systems of equations and inequalities, polar and parametric equations, complex numbers, and analytic trigonometry.',
          },
          {
            code: 'MATH 290',
            name: 'Early Start',
            description:
              'This course provides number sense, graphical reasoning, algebraic thinking, and university processes and campus information.',
          },
        ],
      },
    ],
  },

  // ─── SECONDARY ─────────────────────────────────────────────────────
  {
    name: 'Pleasant Valley High School',
    location: 'Chico, CA',
    dateStart: '2022',
    dateEnd: null,
    status: 'current',
    level: 'secondary',
    concurrent: true,
    positions: [
      {
        title: 'High School Mathematics Teacher',
        courses: [
          {
            code: 'Integrated I',
            name: 'Integrated Mathematics I',
            description: 'First course in the integrated mathematics sequence covering linear relationships, systems of equations, basic statistics, and an introduction to geometric reasoning aligned to California Common Core standards.',
          },
          {
            code: 'Integrated III',
            name: 'Integrated Mathematics III',
            description: 'Capstone high school mathematics course covering polynomial, rational, exponential, and logarithmic functions, trigonometry, and statistical inference, preparing students for college-level mathematics.',
          },
        ],
      },
      {
        title: 'High School Computer Science Teacher',
        courses: [
          {
            code: 'Intro CS',
            name: 'Introduction to Computer Science',
            description: 'Survey course introducing foundational computing concepts including algorithms, problem decomposition, programming logic, and the societal impact of technology. No prior experience required.',
          },
          {
            code: 'AP CSP',
            name: 'Advanced Placement Computer Science Principles',
            description: 'College Board AP course exploring the big ideas of computer science: creativity, abstraction, data, algorithms, programming, the internet, and global impact. Prepares students for the AP exam and college CS coursework.',
          },
        ],
      },
      {
        title: 'Dual Enrollment Instructor for Butte Community College',
        notes: '2024 - Present',
        courses: [
          {
            code: 'Math 18',
            name: 'Introduction to Statistics',
            description: 'Introduction to Statistics (Dual Enrollment through Butte Community College)',
          },
          {
            code: 'CSCI 4',
            name: 'Introduction to Programming Concepts and Methodologies',
            description:
              'Introduction to Programming Concepts and Methodologies (Dual Enrollment through Butte Community College)',
          },
        ],
      },
    ],
  },
  {
    name: 'Anderson Valley Jr./Sr. High School',
    location: 'Boonville, CA',
    dateStart: '2017',
    dateEnd: '2018',
    status: 'past',
    level: 'secondary',
    positions: [
      {
        title: 'High School Mathematics Teacher',
        courses: [
          {
            code: 'Integrated I/Algebra 1',
            name: 'Integrated I/Algebra 1 for ELL Students',
            description: 'Integrated Mathematics I and Algebra 1 content adapted for English Language Learner students, with emphasis on mathematical vocabulary development, visual representations, and scaffolded problem-solving.',
          },
          {
            code: 'Integrated III/Precalculus',
            name: 'Integrated III/Precalculus',
            description: 'Advanced high school mathematics covering polynomial and rational functions, trigonometry, exponential and logarithmic models, and an introduction to limits, preparing students for calculus.',
          },
          {
            code: 'Calculus AB',
            name: 'Calculus AB',
            description: 'Introductory calculus course covering limits, derivatives, and integrals of single-variable functions with applications to motion, optimization, and area. Aligned to College Board AP Calculus AB standards.',
          },
        ],
      },
      {
        title: 'Middle School Technology Teacher',
        courses: [
          {
            code: 'Technology',
            name: 'Technology, Coding and Modeling',
            description: 'Middle school elective integrating digital literacy, introductory programming, and 3D modeling. Students explore computational thinking through hands-on projects using coding environments and design tools.',
          },
        ],
      },
      {
        title: 'Mendocino College Concurrent Enrollment Program Instructor',
        notes: '2017 - 2018',
        courses: [
          {
            code: 'CCS 100',
            name: 'Career Planning',
            description:
              'An introduction to the career planning process. Designed to help students find the best career options, based on their strengths, interests, and values. Also includes developing job interviews and resume writing skills.',
          },
        ],
      },
    ],
  },
  {
    name: 'San Leandro High School',
    location: 'San Leandro, CA',
    dateStart: '2016',
    dateEnd: '2017',
    status: 'past',
    level: 'secondary',
    positions: [
      {
        title: 'High School Mathematics Teacher',
        courses: [
          {
            code: 'Algebra 1',
            name: 'Algebra 1',
            description: 'Foundational high school algebra covering linear equations and inequalities, systems of equations, functions, exponents, and an introduction to quadratic expressions. Emphasis on mathematical reasoning and real-world applications.',
          },
        ],
      },
    ],
  },

  // ─── PRIMARY ───────────────────────────────────────────────────────
  {
    name: 'Clifford Elementary School',
    location: 'Redwood City, CA',
    dateStart: '2015',
    dateEnd: '2016',
    status: 'past',
    level: 'primary',
    positions: [
      {
        title: 'Middle School Mathematics Teacher',
        courses: [
          {
            code: '7th Grade Math',
            name: '7th Grade Math/Beginning Algebra',
            description: 'Seventh grade mathematics bridging arithmetic and algebraic thinking. Topics include ratios and proportional relationships, operations with rational numbers, expressions and equations, geometry, and introductory statistics.',
          },
          {
            code: '8th Grade Math',
            name: '8th Grade Math/Core Algebraic Ideas',
            description: 'Eighth grade mathematics deepening algebraic foundations with linear functions, systems of equations, transformations, the Pythagorean theorem, and introductory work with irrational numbers and statistics.',
          },
        ],
      },
    ],
  },
]
