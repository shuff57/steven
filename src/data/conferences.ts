export interface ConferenceItem {
  title: string
  subtitle: string
  date: string | null
  description: string
  location?: string
  status: 'training' | 'facilitated' | 'presented' | 'attended'
}

export const conferences: ConferenceItem[] = [
  {
    title: 'Norfield trained on industry level Haas Mills',
    subtitle: 'CNC setup & operation for precision industrial components',
    date: 'Summer 2025',
    description:
      'Completed 90+ hours of intensive technical training at Norfield in the setup and operation of Haas CNC vertical mills to fabricate precision components for industrial door machinery. Responsibilities included interpreting CAD/CAM files and engineering drawings to maintain tight tolerances through meticulous tool calibration, parts inspection, and routine preventive maintenance. This role also required supporting multi-stage assembly operations to ensure strict adherence to quality control standards within a high-output production environment.',
    location: 'Norfield, Chico, CA',
    status: 'training',
  },
  {
    title: 'SLC Math Tutor Training Facilitator',
    subtitle: 'Designed & led content-specific tutor training for the Student Learning Center',
    date: 'Fall 2021',
    description:
      'Facilitated a content-specific math tutor training for the Student Learning Center, designing the curriculum around ideas developed during my master\'s thesis research on effective math support models. The training focused on how tutors can ask productive questions, support student reasoning without giving away answers, and adapt to a range of problem-solving approaches in co-requisite and transfer-level courses.',
    location: 'CSU Chico',
    status: 'facilitated',
  },
  {
    title: 'CSU Chico "GoFlex Session #1"',
    subtitle: 'Simultaneous in-person & online instruction using hybrid classroom tools',
    date: 'Summer 2021',
    description:
      'Faculty participants will learn about how to manage the classroom equipment, the features and configurations to engage in-person and online students at the same time. Faculty mentors will lead and facilitate a cohort of up to 15 faculty. GoFlex will support faculty in leveraging tools (e.g. Poll Everywhere for polling students both online and in-person at the same time), sharing templates for student activities and best practices for classroom rules of engagement in this new environment.',
    location: 'CSU Chico',
    status: 'facilitated',
  },
  {
    title: 'FLC Faculty Writing Community',
    subtitle: 'Semester-long peer community for research sharing and publication goals',
    date: 'Spring 2021',
    description:
      'A semester-long commitment to a shared space for faculty to develop and share research ideas, set publication goals, and hold each other accountable. The community provided structured peer feedback on drafts, helped members clarify arguments, and offered motivation to push writing projects past the idea stage and into submission.',
    location: 'CSU Chico',
    status: 'attended',
  },
  {
    title: 'Quality Learning and Teaching Workshops (QLT)',
    subtitle: 'Online course design for faculty and instructional designers',
    date: 'Spring 2021',
    description:
      '5 workshop training meant developed to assist faculty and instructional designers to more effectively create and deliver online, blended, and flipped courses.',
    location: 'CSU Chico',
    status: 'training',
  },
  {
    title: 'Digital Pedagogy FLC',
    subtitle: 'Supporting student agency through technology-integrated teaching practices',
    date: 'Spring 2021',
    description:
      'A semester-long training meant to support teaching across the disciplines and consider how our students, nascent learners in our fields, become full participants in our courses, in our disciplines, and importantly, in pursuit of their learning goals.',
    location: 'CSU Chico',
    status: 'attended',
  },
  {
    title: 'Theory and Practice of Teaching First-Year Students FLC',
    subtitle: 'Evidence-based strategies for supporting first-year student success',
    date: 'Fall 2020 – Spring 2021',
    description:
      '8 training days inviting participants to think about teaching and learning with a focus on first-year students. Our goal: to support teaching across the disciplines, while thinking about how to best support first-year students as novice learners.',
    location: 'CSU Chico',
    status: 'attended',
  },
  {
    title: 'Mount Lassen Mathematics Conference',
    subtitle: 'CCSS mathematical practices for north state K–12 teachers',
    date: 'March 2020',
    description:
      'Guest speaker instructing north state K–12 teachers on CCSS mathematical practices, with a focus on connecting procedural fluency to conceptual understanding. The session modeled classroom activities that use the Standards for Mathematical Practice to structure student discourse and problem-solving, and gave attendees transferable strategies they could bring directly back to their classrooms.',
    location: 'Redding, CA',
    status: 'presented',
  },
  {
    title: 'CSU Chico "Go Virtual Summer Institute #2"',
    subtitle: 'Converting existing courses to effective online and blended formats',
    date: 'Summer 2020',
    description:
      'A five-day training for faculty to learn how, and to have the time, to convert existing classes into effective online or blended courses.',
    location: 'CSU Chico',
    status: 'training',
  },
  {
    title: "CSU Sacramento's 2020 Quantitative Reasoning Summer Course",
    subtitle: 'Facilitative QR teaching methods and distance learning adaptations',
    date: 'June 2020',
    description:
      "A multi-day training designed to develop and hone your abilities in becoming a facilitative teacher, understand the curriculum's approach to building on students' patterning abilities to see algebraic structures which is pivotal for each course, understand the daily structure and curriculum components, and discuss adaptations for teaching the QR courses in distance learning conditions.",
    location: 'CSU Sacramento',
    status: 'training',
  },
  {
    title: 'EO 1100 Co-Requisite PD Instructor',
    subtitle: 'CCSS mathematical practices for co-requisite math faculty',
    date: 'November 2019',
    description:
      'Guest speaker for a professional development session instructing co-requisite math faculty on CCSS mathematical practices under Executive Order 1100. Shared strategies for integrating mathematical practice standards into co-requisite support courses, helping faculty connect skill-building activities to the reasoning demands of transfer-level content.',
    location: 'CSU Chico',
    status: 'presented',
  },
  {
    title: 'Chico Math Project Summer Workshop',
    subtitle: 'Problem-based geometry teaching strategies for student-centered classrooms',
    date: 'June 2019',
    description:
      'Five-day summer workshop focused on student-centered, problem-based teaching strategies for geometry. Participants worked through rich tasks as learners first, then debriefed the pedagogy behind each activity — examining how to launch problems, facilitate productive struggle, and use student work to drive whole-class discussion rather than lecture.',
    location: 'CSU Chico',
    status: 'training',
  },
  {
    title: '2018 CPM Teacher Conference',
    subtitle: 'Classroom implementation showcases for CPM curriculum',
    date: 'February 2018',
    description:
      "A multi-day conference where educators from around the country showcase how they implement CPM's problem-based curriculum. Sessions covered team structures, homework strategies, assessment practices, and how to support struggling students within a collaborative, inquiry-driven classroom model.",
    location: 'Sacramento, CA',
    status: 'attended',
  },
  {
    title: 'SparkFun Education: Maker Education PD',
    subtitle: 'Hands-on introduction to Maker tools for STEM classrooms',
    date: 'January 2018',
    description:
      'A one-day workshop introducing educators to Maker educational tools and the pedagogical principles behind Maker culture in the classroom. Participants explored hands-on hardware (microcontrollers, sensors, basic circuits) and discussed how open-ended making projects can build student agency, persistence, and cross-disciplinary thinking.',
    location: 'Online',
    status: 'training',
  },
  {
    title: 'Sonoma State: Learn by Making',
    subtitle: 'Integrated STEM curriculum through hands-on making and fabrication',
    date: '2017 – 2018',
    description:
      'An interactive workshop where participants will be introduced to the innovative, integrated STEM curriculum.',
    location: 'Sonoma State',
    status: 'training',
  },
  {
    title: 'AP Calculus AB and BC Workshop',
    subtitle: 'Effective pedagogical strategies for AP Calculus courses',
    date: 'July 2017',
    description:
      'Multi-day training for effective teaching strategies for AP Calculus AB and BC. Topics included pacing the curriculum around the AP exam, using graphical and numerical reasoning alongside algebraic methods, designing free-response practice, and leveraging College Board resources to align classroom instruction with exam expectations.',
    location: 'Palo Alto, CA',
    status: 'training',
  },
  {
    title: 'AVID Certified',
    subtitle: 'College readiness strategies for underrepresented student populations',
    date: 'Summer 2017',
    description:
      'Multi-day AVID certification training focused on strategies that support first-generation and underrepresented students in meeting college eligibility requirements and thriving once enrolled. Covered Cornell note-taking, Socratic seminars, inquiry-based learning, and tutorial support structures designed to build academic habits without lowering rigor.',
    location: 'Online',
    status: 'training',
  },
  {
    title: 'WestEd Experimental Research Study',
    subtitle: 'Early-phase research on emerging math classroom technology',
    date: '2015 – 2017',
    description:
      'Participated as a classroom teacher in an early-phase experimental research study conducted by WestEd to develop and evaluate emerging technology tools designed for the math classroom. Contributed classroom observations, student outcome data, and practitioner feedback to inform iterative tool design across a multi-year development cycle.',
    location: 'Online',
    status: 'attended',
  },
]
