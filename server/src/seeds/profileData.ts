import { Education, Experience, Profile } from '../entities/Profile';

const profileData: Profile[] = [
  // Elitan
  {
    company: 'Nhost',
    website: 'https://nhost.io',
    location: 'Stockholm, Sweden',
    status: 'CEO, Co-Founder',
    bio: 'Johan has been building apps his whole life and is passioned about making it easy to develop web and mobile apps.',
    githubusername: 'elitan',
    skills: 'HTML, Python, SQL, Django, Node.js',
    social: {
      facebook: '',
      instagram: '',
      linkedin: 'https://www.linkedin.com/in/johan--eliasson',
      twitter: 'https://twitter.com/elitasson',
      youtube: '',
    },
    educations: [
      {
        current: false,
        degree: 'Master of Science in Computer Security',
        fieldofstudy:
          'Computer and Information Systems Security/Information Assurance',
        from: new Date('2011-09-01'),
        school: 'Blekinge Institute of Technology',
        description:
          'Specialized knowledge in computer security and advanced knowledge in computer science, programming and math.',
        to: new Date('2016-08-30'),
      } as Education,
    ],
    experiences: [
      {
        company: 'Nhost',
        current: true,
        description:
          'Nhost: The open source Firebase alternative with GraphQL. Backend infrastructure for the next generation of web and mobile applications. From MVPs to global scale.',
        from: new Date('2019-12-01'),
        location: 'Remote',
        title: 'Co-Founder/CEO',
      } as Experience,
    ],
  } as Profile,
  // Awad
  {
    company: 'YouTube',
    website: 'https://benawad.com',
    location: 'Austin, TX',
    status: 'Programming Mentor',
    bio: "I'm a Software Consultant who enjoys making programming videos on YouTube and building a cooking app called Saffron. My favorite technologies right now are: React.js, Typescript, GraphQL, Node.js, and PostgreSQL.",
    githubusername: 'benawad',
    skills: 'React.js, TypeScript, GraphQL, Node.js, PostgreSQL',
    social: {
      facebook: '',
      instagram: '',
      linkedin: 'https://www.linkedin.com/in/benawad',
      twitter: 'https://twitter.com/benawad',
      youtube: 'https://www.youtube.com/benawad97',
    },
    educations: [
      {
        current: false,
        degree: 'Bachelor of Degree in Computer Science',
        fieldofstudy:
          'Computer and Information Systems Security/Information Assurance',
        from: new Date('2015-09-01'),
        school: 'The University of Texas, Dallas',
        description:
          'Design and analyze algorithms to solve programs and study the performance of computer hardware and software',
        to: new Date('2018-08-30'),
      } as Education,
    ],
    experiences: [
      {
        company: 'YouTube',
        current: true,
        description: 'I make programming videos about React.js and GraphQL.',
        from: new Date('2017-01-01'),
        location: 'Remote',
        title: 'Programming Mentor/ Software Consultant',
      } as Experience,
    ],
  } as Profile,
  // Aseer
  {
    company: 'Nowhere',
    website: 'https://aseerkt.vercel.app',
    location: 'Kerala, India',
    status: 'Junior Web Developer',
    bio: 'I enjoy building clones of popular website and applications',
    githubusername: 'aseerkt',
    skills: 'HTML, CSS, React.js, TypeScript, GraphQL',
    social: {
      linkedin: 'https://linkedin.com/in/aseerkt',
      twitter: 'https://twitter.com/aseerkta',
    },
    educations: [
      {
        current: false,
        degree: 'BS-MS in Physics',
        fieldofstudy: 'Physical Science',
        from: new Date('2015-08-01'),
        school: 'Indian Institute of Science Education and Research, Bhopal',
        description: 'Research studies on Bubble dynamics',
        to: new Date('2021-08-30'),
      } as Education,
    ],
    experiences: [
      {
        company: 'Nowhere',
        current: true,
        description: 'Just like the name, this company does not exist',
        from: new Date('2017-01-01'),
        location: 'Somwhere',
        title: 'Junior Web Developer',
      } as Experience,
    ] as any,
  } as Profile,
];

export default profileData;
