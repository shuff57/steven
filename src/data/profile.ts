export interface Profile {
  name: string
  email: string
  researchInterests: string[]
  teachingInterests: string[]
}

export const profile: Profile = {
  name: 'Steven Huff',
  email: 'shuff57@gmail.com',
  researchInterests: [
    'Student(s) use of tutoring/support services',
    'Problem-based learning',
    'Project-based learning',
    'Inquiry-based learning',
    'Curriculum development',
    'Multimodality mathematics learning',
    'Graph theory',
    'Geometry',
    'Use of models to enhance student learning and development',
  ],
  teachingInterests: [
    'Foundational Mathematics',
    'Introductory Statistics',
    'Finite Mathematics',
    'Survey of Calculus',
    'Concepts and Structures of Mathematics Series',
    'College Algebra',
    'Trigonometry',
    'Pre-Calculus',
    'Analytic Geometry and Calculus Series',
    'Discrete Math',
    'Elementary Linear Algebra',
    'Elementary Differential Equations',
    'Conceptual and Practical Statistics',
    'Intuitive Foundations of Geometry',
    'College Geometry',
    'Advanced Number and Operation',
    'Real and Complex Number Systems',
    'Graph Theory',
    'Industrial Technology',
    'Woodworking',
    'CNC Machining',
  ],
}
