export interface ConferenceItem {
  title: string
  date: string | null
  description: string
  location?: string
}

export const conferences: ConferenceItem[] = [
  {
    title: 'Trained on Industry level machinery',
    date: null,
    description: 'Trained on Industry level machinery.',
  },
  {
    title: 'SLC Math Tutor Training Facilitator',
    date: 'Fall 2021',
    description:
      'Facilitate a content specific math tutor training for the Student Learning Center, which I designed based on ideas developed while writing my master\'s thesis.',
  },
  {
    title: 'CSU Chico "GoFlex Session #1"',
    date: 'Summer 2021',
    description:
      'Faculty participants will learn about how to manage the classroom equipment, the features and configurations to engage in-person and online students at the same time. Faculty mentors will lead and facilitate a cohort of up to 15 faculty. GoFlex will support faculty in leveraging tools (e.g. Poll Everywhere for polling students both online and in-person at the same time), sharing templates for student activities and best practices for classroom rules of engagement in this new environment.',
    location: 'California State University, Chico',
  },
  {
    title: 'FLC Faculty Writing Community',
    date: 'Spring 2021',
    description:
      'A semester long commitment to a shared space for faculty to share their research ideas and publication goals, while supporting and motivating each other.',
  },
  {
    title: 'Quality Learning and Teaching Workshops (QLT)',
    date: 'Spring 2021',
    description:
      '5 workshop training meant developed to assist faculty and instructional designers to more effectively create and deliver online, blended, and flipped courses.',
  },
  {
    title: 'Digital Pedagogy FLC',
    date: 'Spring 2021',
    description:
      'A semester-long training meant to support teaching across the disciplines and consider how our students, nascent learners in our fields, become full participants in our courses, in our disciplines, and importantly, in pursuit of their learning goals.',
  },
  {
    title: 'Theory and Practice of Teaching First-Year Students FLC',
    date: 'Fall 2020 - Spring 2021',
    description:
      '8 training days inviting participants to think about teaching and learning with a focus on first-year students. Our goal: to support teaching across the disciplines, while thinking about how to best support first-year students as novice learners.',
  },
  {
    title: 'Mount Lassen Mathematics Conference',
    date: 'March 2020',
    description:
      'Guest speaker instructing north state teachers on CCSS mathematical practices.',
    location: 'Redding, CA',
  },
  {
    title: 'CSU Chico "Go Virtual Summer Institute #2"',
    date: 'Summer 2020',
    description:
      'A five-day training for faculty to learn how, and to have the time, to convert existing classes into effective online or blended courses.',
    location: 'California State University, Chico',
  },
  {
    title: "CSU Sacramento's 2020 Quantitative Reasoning Summer Course",
    date: 'June 2020',
    description:
      "A multi-day training designed to develop and hone your abilities in becoming a facilitative teacher, understand the curriculum's approach to building on students' patterning abilities to see algebraic structures which is pivotal for each course, understand the daily structure and curriculum components, and discuss adaptations for teaching the QR courses in distance learning conditions.",
    location: 'CSU Sacramento',
  },
  {
    title: 'EO 1100 Co-Requisite PD Instructor',
    date: 'November 2019',
    description:
      'Guest speaker instructing other Co-requisite faculty on CCSS mathematical practices.',
    location: 'California State University, Chico',
  },
  {
    title: 'Chico Math Project Summer Workshop',
    date: 'June 2019',
    description:
      'Five-day training for student centered geometry problem-based teaching strategies.',
    location: 'California State University, Chico',
  },
  {
    title: '2018 CPM Teacher Conference',
    date: 'February 2018',
    description:
      "A multi-day conference where other educators showcase how they are implementing CPM's curriculum.",
  },
  {
    title: 'SparkFun Education: Maker Education PD',
    date: 'January 2018',
    description:
      'A one day workshop to become familiarized with "Maker" educational tools.',
  },
  {
    title: 'Sonoma State: Learn by Making',
    date: '2017 - 2018',
    description:
      'An interactive workshop where participants will be introduced to the innovative, integrated STEM curriculum.',
    location: 'Sonoma State University',
  },
  {
    title: 'AP Calculus AB and BC Workshop',
    date: 'July 2017',
    description:
      'Multi-day training for effective teaching strategies for Calculus AB/BC.',
    location: 'Palo Alto High School, CA',
  },
  {
    title: 'AVID Certified',
    date: 'Summer 2017',
    description:
      'Multi-day training in how to better support students for college eligibility and success.',
  },
  {
    title: 'WestEd Experimental Research Study',
    date: '2015 - 2017',
    description:
      'Participated in early phase research to develop new and innovative technology for the math classroom.',
  },
]
