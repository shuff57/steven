export interface Credential {
  degree: string
  field: string
  institution: string
  date: string
  notes?: string
  link?: string
}

export interface Education {
  degrees: Credential[]
  credentials: Credential[]
  thesis?: {
    title: string
    link: string
    summary: string
  }
}

export const education: Education = {
  degrees: [
    {
      degree: 'Master of Science',
      field: 'Mathematics Education',
      institution: 'California State University, Chico',
      date: 'May 2021',
      notes: 'Department of Mathematics and Statistics',
    },
    {
      degree: 'Bachelor of Science',
      field: 'Mathematics (Mathematics Education: Credential Pathway)',
      institution: 'California State University, Chico',
      date: 'May 2015',
      notes: 'Department of Mathematics and Statistics',
    },
  ],
  credentials: [
    {
      degree: 'California Teaching Credential',
      field: 'Single Subject Mathematics',
      institution: 'California State University, Chico',
      date: 'May 2015',
    },
    {
      degree: 'Supplementary Authorization Credential',
      field: 'Computer Science',
      institution: 'California State University, Chico',
      date: 'Summer 2023',
    },
    {
      degree: 'Supplementary Authorization Credential',
      field: 'Career Technical Education: Information and Communication Technologies',
      institution: 'California State University, Chico',
      date: 'Spring 2026',
    },
  ],
  thesis: {
    title:
      "Lower-Division Undergraduate Mathematics Students' Perspectives on the Purpose of Tutoring",
    link: 'https://scholarworks.calstate.edu/concern/theses/fq978099t',
    summary:
      'Research on how undergraduate math students perceive tutoring/support services',
  },
}
