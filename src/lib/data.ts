
export const CAREER_DATA = {
  "Data Scientist": {
    description: "Analyzes large datasets to extract meaningful insights. Requires strong statistical knowledge and programming skills.",
    skills: {
      essential: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Data Visualization"],
      "good-to-have": ["Big Data Technologies (Spark, Hadoop)", "Cloud Computing (AWS, GCP)", "Deep Learning"],
    },
  },
  "Frontend Developer": {
    description: "Builds the user-facing part of websites and web applications. Focuses on user experience and interface design.",
    skills: {
      essential: ["HTML", "CSS", "JavaScript", "React", "Git"],
      "good-to-have": ["TypeScript", "Next.js", "UI/UX Design Principles", "Webpack"],
    },
  },
  "Backend Developer": {
    description: "Works on the server-side logic, databases, and APIs that power applications.",
    skills: {
      essential: ["Node.js", "Python", "Java", "Databases (SQL, NoSQL)", "API Design", "Git"],
      "good-to-have": ["Docker", "Kubernetes", "Microservices", "CI/CD"],
    },
  },
  "Product Manager": {
    description: "Defines the product vision, strategy, and roadmap. Acts as the bridge between business, tech, and user experience.",
    skills: {
      essential: ["Communication", "Leadership", "Agile Methodologies", "Market Research", "Problem Solving"],
      "good-to-have": ["Data Analysis", "UX/UI knowledge", "Technical literacy"],
    },
  },
  "UX/UI Designer": {
    description: "Designs user interfaces and experiences for digital products, focusing on usability and aesthetics.",
    skills: {
      essential: ["Figma", "Adobe XD", "User Research", "Wireframing", "Prototyping", "Visual Design"],
      "good-to-have": ["Interaction Design", "HTML/CSS", "Design Systems"],
    },
  },
  "DevOps Engineer": {
    description: "Works on automating the software development lifecycle, including build, test, deployment, and monitoring.",
    skills: {
      essential: ["CI/CD (Jenkins, GitLab CI)", "Infrastructure as Code (Terraform, Ansible)", "Docker", "Kubernetes", "Scripting (Bash, Python)", "Cloud (AWS, Azure, GCP)"],
      "good-to-have": ["Monitoring (Prometheus, Grafana)", "Networking", "Security Best Practices"],
    },
  },
  "Data Engineer": {
    description: "Builds and maintains data pipelines and infrastructure to collect, store, and process large datasets.",
    skills: {
      essential: ["ETL/ELT", "Big Data Technologies (Spark, Hadoop, Kafka)", "SQL", "NoSQL Databases", "Python", "Cloud (AWS, GCP, Azure)"],
      "good-to-have": ["Data Warehousing (Snowflake, BigQuery)", "Data Modeling", "Scala"],
    },
  },
  "Cybersecurity Analyst": {
    description: "Protects an organization's computer systems and networks from cyber threats.",
    skills: {
      essential: ["Network Security", "Security Information and Event Management (SIEM)", "Vulnerability Assessment", "Penetration Testing", "Cryptography"],
      "good-to-have": ["Incident Response", "Forensics", "Certifications (CISSP, CompTIA Security+)"],
    },
  },
};

export type Career = keyof typeof CAREER_DATA;

export const LEARNING_RESOURCES = [
  { id: 1, title: "Python for Everybody", platform: "Coursera", skill: "Python", type: "course" },
  { id: 2, title: "Google Data Analytics Professional Certificate", platform: "Coursera", skill: "Data Visualization", type: "certification" },
  { id: 3, title: "Build a responsive website", platform: "freeCodeCamp", skill: "HTML", type: "project" },
  { id: 4, title: "The Complete 2024 Web Development Bootcamp", platform: "Udemy", skill: "React", type: "course" },
  { id: 5, title: "Machine Learning A-Z", platform: "Udemy", skill: "Machine Learning", type: "course" },
  { id: 6, title: "IBM Data Science Professional Certificate", platform: "Coursera", skill: "Statistics", type: "certification" },
  { id: 7, title: "SQL for Data Science", platform: "Coursera", skill: "SQL", type: "course" },
  { id: 8, title: "Advanced CSS and Sass", platform: "Udemy", skill: "CSS", type: "course"},
  { id: 9, title: "JavaScript Algorithms and Data Structures", platform: "freeCodeCamp", skill: "JavaScript", type: "certification"},
  { id: 10, title: "The Odin Project", platform: "Community", skill: "Git", type: "project"},
  { id: 11, title: "Terraform - From Beginner to Certified", platform: "Udemy", skill: "Infrastructure as Code", type: "course" },
  { id: 12, title: "Docker & Kubernetes: The Practical Guide", platform: "Udemy", skill: "Docker", type: "course" },
  { id: 13, title: "Google Cloud Certified - Professional Data Engineer", platform: "Coursera", skill: "Big Data Technologies", type: "certification" },
  { id: 14, title: "CompTIA Security+ (SY0-601) Complete Course", platform: "Udemy", skill: "Network Security", type: "course" }
];

export const INTERVIEW_QUESTIONS: Record<Career, string[]> = {
  "Data Scientist": [
    "What is the difference between supervised and unsupervised learning?",
    "Explain the bias-variance tradeoff.",
    "How would you handle missing data in a dataset?",
    "Describe a machine learning project you've worked on from start to finish.",
  ],
  "Frontend Developer": [
    "What is the Box Model in CSS?",
    "Explain the concept of 'state' and 'props' in React.",
    "What are Promises in JavaScript?",
    "Describe your process for making a website responsive.",
  ],
  "Backend Developer": [
    "What are the differences between SQL and NoSQL databases?",
    "Explain RESTful API design principles.",
    "What is the purpose of Docker?",
    "Describe how you would secure an API endpoint.",
  ],
  "Product Manager": [
    "How would you improve our product?",
    "Tell me about a time you had to say 'no' to a stakeholder.",
    "How do you prioritize features?",
    "What is your favorite product and why?",
  ],
  "UX/UI Designer": [
    "Walk me through your design process.",
    "What is a design system and why is it important?",
    "How do you conduct user research?",
    "Show me a project you are proud of and explain your design decisions."
  ],
  "DevOps Engineer": [
    "What is Infrastructure as Code and why is it important?",
    "Explain the difference between a container and a virtual machine.",
    "What is a CI/CD pipeline and what are its stages?",
    "How would you monitor a production application?"
  ],
  "Data Engineer": [
    "What is the difference between ETL and ELT?",
    "Explain the CAP theorem.",
    "How would you design a data pipeline for real-time processing?",
    "What are the different types of data storage?"
  ],
  "Cybersecurity Analyst": [
    "What is the difference between a threat, a vulnerability, and a risk?",
    "Explain the different layers of the OSI model.",
    "What are the common types of cyber attacks?",
    "How would you respond to a security incident?"
  ]
};

export const ALL_ROLES = Object.keys(CAREER_DATA) as Career[];
