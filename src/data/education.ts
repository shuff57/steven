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
    abstract: string
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
    abstract:
      'The purpose of the present qualitative study is to categorize the beliefs about the nature and function of tutoring by college students at a public university in Northern California by developing three math-specific tutoring categories. Study participants included fifty-eight undergraduate mathematics students who completed a questionnaire to report math confidence, self-perspective on the purpose and importance of tutoring, and self-perspective on the importance of mathematics in life. The questionnaire consisted of a combination of Likert scale items and free response items. Additionally, four participants were selected for a follow-up interview based on their responses to the questionnaire. This study found three math-specific tutoring perspectives that help describe what students believe is the purpose(s) and function(s) of math tutoring. The results of the study determined that not all students think about the functions of tutoring in the same way. This difference between expectation and experience may reduce the usefulness of tutoring to some students. Thus, by not knowing the students\u2019 specific reason(s) for attending tutoring they may be left with the impression that tutoring is not an effective support system for them.',
  },
}
