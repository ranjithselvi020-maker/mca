import { Subject, CodeProblem, CareerPath } from '../types';

export const initialSubjects: Subject[] = [
  {
    id: 'ds',
    title: 'Data Structures & Algorithms',
    code: 'MCA-2001',
    category: 'Core Computer Science',
    description: 'Master linear and non-linear data structures, complex algorithms, asymptotic analysis, and optimization techniques.',
    topics: [
      { name: 'Asymptotic Notations (O, Ω, Θ)', completed: true },
      { name: 'Singly & Doubly Linked Lists', completed: true },
      { name: 'Stack and Queue Implementations', completed: false },
      { name: 'Binary Search Trees (BST)', completed: false },
      { name: 'AVL Trees and B-Trees', completed: false },
      { name: 'Dijkstra and Kruskal Algorithms', completed: false },
      { name: 'Dynamic Programming Concepts', completed: false }
    ],
    progress: 28
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    code: 'MCA-2002',
    category: 'Core Computer Science',
    description: 'Learn relational data models, ER diagrams, normalization (1NF to BCNF/4NF), SQL, query optimization, and transaction ACID properties.',
    topics: [
      { name: 'ER Modeling & Relational Schema', completed: true },
      { name: 'Normalization & Functional Dependencies', completed: true },
      { name: 'RAID Levels & Indexing (B-Tree, B+ Tree)', completed: true },
      { name: 'SQL Joins, Subqueries & Triggers', completed: false },
      { name: 'ACID Properties and Transaction States', completed: false },
      { name: 'Concurrency Control (2PL, Timestamp)', completed: false },
      { name: 'NoSQL Databases & Sharding', completed: false }
    ],
    progress: 42
  },
  {
    id: 'os',
    title: 'Operating Systems & Systems Programming',
    code: 'MCA-2003',
    category: 'Core Computer Science',
    description: 'Understand process scheduling, thread synchronization, deadlocks, virtual memory management, paging, and file systems.',
    topics: [
      { name: 'Process State Transitions & PCB', completed: true },
      { name: 'CPU Scheduling Algorithms (SJF, RR, Priority)', completed: true },
      { name: 'Semaphores & Classical IPC Problems', completed: false },
      { name: 'Deadlock Characterization & Banker’s Algorithm', completed: false },
      { name: 'Paging, Segmentation and Page Replacement', completed: false },
      { name: 'Disk Scheduling (SSTF, SCAN, LOOK)', completed: false }
    ],
    progress: 33
  },
  {
    id: 'java',
    title: 'Advanced Java Programming',
    code: 'MCA-2004',
    category: 'Programming & Web Technologies',
    description: 'Core concepts of OOP, Exceptional handling, Multithreading, Generics, Collection Framework, JDBC, Servlets, and Spring Boot.',
    topics: [
      { name: 'OOP Principles & Multiple Inheritance in Java', completed: true },
      { name: 'Custom Exception Handling & Throwables', completed: true },
      { name: 'Multithreading & Synchronization Blocks', completed: false },
      { name: 'Java Collections Framework (HashMap, ArrayList)', completed: false },
      { name: 'JDBC Transactions & PreparedStatements', completed: false },
      { name: 'REST API creation using Node/Express or Spring Boot', completed: false }
    ],
    progress: 33
  },
  {
    id: 'python',
    title: 'Python for Data Analysis & AI',
    code: 'MCA-2005',
    category: 'Programming & Web Technologies',
    description: 'Utilize Python arrays, NumPy, Pandas, Matplotlib, and scikit-learn for heavy data automation and machine learning models.',
    topics: [
      { name: 'List Comprehensions & Lambda Functions', completed: true },
      { name: 'NumPy Vectorization & N-dimensional Arrays', completed: false },
      { name: 'Pandas DataFrame data-wrangling keys', completed: false },
      { name: 'Matplotlib and Seaborn Visualizers', completed: false },
      { name: 'Scikit-Learn Regression & Classification pipelines', completed: false }
    ],
    progress: 20
  },
  {
    id: 'cn',
    title: 'Computer Networks',
    code: 'MCA-2006',
    category: 'Core Computer Science',
    description: 'Analyze OSI and TCP/IP protocol suites, flow control (Sliding Window), IP addressing, routing algorithms, and security.',
    topics: [
      { name: 'OSI vs TCP/IP Reference Model Layers', completed: true },
      { name: 'Error Detection Codes (CRC, Hamming)', completed: false },
      { name: 'IPv4 Subnetting & CIDR notation rules', completed: false },
      { name: 'Routing Protocols (RIP, OSPF, BGP)', completed: false },
      { name: 'TCP 3-way Handshake & Congestion Control', completed: false },
      { name: 'DNS, HTTPS, and TLS handshakes', completed: false }
    ],
    progress: 16
  },
  {
    id: 'se',
    title: 'Software Engineering & DevOps',
    code: 'MCA-2007',
    category: 'Core Computer Science',
    description: 'Understand Agile methodology, SDLC models, SRS, system architectural styles, testing metrics, and modern CI/CD pipelines.',
    topics: [
      { name: 'SDLC Waterfall vs Spiral vs Agile Scrum', completed: true },
      { name: 'SRS Guidelines & Functional Specifications', completed: true },
      { name: 'Component-level design patterns', completed: false },
      { name: 'White-box vs Black-box Testing (Basis Path)', completed: false },
      { name: 'CI/CD Pipelines, Docker containerisation', completed: false }
    ],
    progress: 40
  },
  {
    id: 'cloud',
    title: 'Cloud Computing Architecture',
    code: 'MCA-2008',
    category: 'Advanced Electives',
    description: 'Explore SaaS, PaaS, IaaS, virtualization, AWS services, serverless computing (Lambda), and microservices container integration.',
    topics: [
      { name: 'SaaS, PaaS, and IaaS comparisons', completed: false },
      { name: 'Hypervisors and Hardware Virtualization', completed: false },
      { name: 'AWS S3, EC2, RDS, and DynamoDB setup', completed: false },
      { name: 'Serverless architecture & GCP Cloud Run keys', completed: false }
    ],
    progress: 0
  },
  {
    id: 'ml',
    title: 'Machine Learning Fundamentals',
    code: 'MCA-2009',
    category: 'Advanced Electives',
    description: 'Implement supervised, unsupervised and reinforcement algorithms. Master Decision Trees, SVM, and Neural Networks.',
    topics: [
      { name: 'Linear Regression & Cost Minimization (SGD)', completed: false },
      { name: 'Logistic Regression & Sigmoid Decision boundaries', completed: false },
      { name: 'K-Means Clustering and PCA dimensionality reduction', completed: false },
      { name: 'Overfitting vs Underfitting (Regularization)', completed: false }
    ],
    progress: 0
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence & Neural Networks',
    code: 'MCA-2010',
    category: 'Advanced Electives',
    description: 'Study heuristic searching, game theory (alpha-beta pruning), expert systems, NLP, and Deep Learning Multi-Layer Perceptrons.',
    topics: [
      { name: 'A* Search and Minimax Algorithm', completed: false },
      { name: 'Alpha-Beta Pruning optimized heuristics', completed: false },
      { name: 'Artificial Neural Network Activation functions', completed: false },
      { name: 'Natural Language Processing and Tokenizers', completed: false }
    ],
    progress: 0
  },
  {
    id: 'web',
    title: 'Modern Web Technologies',
    code: 'MCA-2011',
    category: 'Programming & Web Technologies',
    description: 'Master client-side React + TypeScript, Tailwind CSS, secure authentication, API routers, and Node.js backend scalability.',
    topics: [
      { name: 'HTML5 Semantic web & CSS Flexbox/Grid', completed: true },
      { name: 'ES6+ JavaScript functions & Promises', completed: true },
      { name: 'React component lifecycles & Hooks logic', completed: false },
      { name: 'TypeScript Interface modeling & Compiler flags', completed: false }
    ],
    progress: 50
  }
];

export interface PyqItem {
  subjectId: string;
  marks: 2 | 5 | 8 | 16;
  question: string;
  answerHint: string;
  repeatedTimes: number;
}

export const pyqBank: PyqItem[] = [
  // DSA
  {
    subjectId: 'ds',
    marks: 2,
    question: 'Define asymptotic analysis of algorithms and identify the core notation types.',
    answerHint: 'Asymptotic analysis estimates execution efficiency relative to input scale. Core types: Big O (upper bound), Big Omega (lower bound), Big Theta (tight bound).',
    repeatedTimes: 5
  },
  {
    subjectId: 'ds',
    marks: 16,
    question: 'Detail Dijkstra’s single-source shortest path algorithm. Provide the pseudocode, dry run a 5-node graph, and state its time complexity.',
    answerHint: 'Dijkstra finds the shortest path using a greedy approach with a priority queue. Step 1: Initialize distances as infinity. Step 2: Loop through active vertices. Complexity is O((V + E) log V).',
    repeatedTimes: 4
  },
  // DBMS
  {
    subjectId: 'dbms',
    marks: 2,
    question: 'Check the difference between candidate key, primary key and super key.',
    answerHint: 'Super Key: Set of attributes uniquely identifying rows. Candidate Key: Minimal Super Key. Primary Key: One candidate selected by DBA.',
    repeatedTimes: 7
  },
  {
    subjectId: 'dbms',
    marks: 16,
    question: 'Describe 1NF, 2NF, 3NF, BCNF, and 4NF with appropriate functional dependency schema examples.',
    answerHint: '1NF: Atomic values. 2NF: 1NF + no partial functional dependency. 3NF: 2NF + no transitive dependency. BCNF: For X -> Y, X must be a super key. 4NF: BCNF + no multi-valued dependency.',
    repeatedTimes: 6
  },
  // Operating Systems
  {
    subjectId: 'os',
    marks: 8,
    question: 'How do you prevent Deadlocks in Operating Systems? Enlist the four Coffman conditions.',
    answerHint: 'Deadlock requires: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Prevent by breaking any condition or executing banker’s algorithm.',
    repeatedTimes: 5
  },
  {
    subjectId: 'os',
    marks: 16,
    question: 'Contrast Paging and Segmentation memory management techniques. Solve Page replacement on string 7,0,1,2,0,3,0,4 with 3 physical frames using FIFO and LRU.',
    answerHint: 'Paging divide logical memory to fixed-size pages. Segmentation uses variable-sized logical blocks. LRU results in 6 page faults, FIFO results in 15 page faults.',
    repeatedTimes: 4
  }
];

export const sampleCodingProblems: CodeProblem[] = [
  {
    id: 'code-1',
    title: 'Reverse a Singly Linked List',
    difficulty: 'Easy',
    description: 'Write a function `reverseList(head)` that takes the head of a singly linked list and reverses it in-place. Return the new head.',
    initialCode: `// Java implementation
class ListNode {
    int val;
    ListNode next;
    ListNode(int x) { val = x; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
    testCases: [
      { input: '[1,2,3,4,5]', expected: '[5,4,3,2,1]' }
    ],
    solutionExplanation: 'Utilizes three pointers: `prev` representing previously processed node, `curr` representing current active node, and `nextTemp` to cache remaining list before pointer inversion.'
  },
  {
    id: 'code-2',
    title: 'Find K-th Largest Element',
    difficulty: 'Medium',
    description: 'Given an unsorted array of integers, write a python function to find the K-th largest element. (Use Min-Heap optimization).',
    initialCode: `# Python implementation
import heapq

def findKthLargest(nums, k):
    # Initialize a min-heap pool
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]`,
    testCases: [
      { input: 'nums=[3,2,1,5,6,4], k=2', expected: '5' }
    ],
    solutionExplanation: 'Maintains a priority queue of size K containing largest observed nodes. Popper discards lower values, leaving K-th largest at root.'
  }
];

export const aptitudeQuestions = [
  {
    category: 'Quantitative Aptitude',
    topic: 'Time and Work',
    question: 'A can complete projects in 12 days and B can do it in 18 days. Working together, in how many days can they complete it?',
    options: ['5.2 days', '7.2 days', '6 days', '8 days'],
    answerIndex: 1,
    explanation: 'A’s 1-day rate = 1/12, B’s 1-day rate = 1/18. Joint rate = 1/12 + 1/18 = 5/36. Joint duration = 36/5 = 7.2 days.'
  },
  {
    category: 'Logical Reasoning',
    topic: 'Coding-Decoding',
    question: 'If MACHINE is coded as LBBIHOD, how is COMPUTER coded?',
    options: ['BPLOVSFD', 'BNLOVTSD', 'BMLKVSPD', 'DOPNVSFE'],
    answerIndex: 0,
    explanation: 'In computer coding pattern logic, each odd element shifts backward by 1 alphabet and even element forward by 1 alphabet.'
  },
  {
    category: 'Technical MCQ',
    topic: 'Relational ACID',
    question: 'Which transaction state handles successful write persistence permanently?',
    options: ['Aborted state', 'Partially Committed', 'Committed', 'Active'],
    answerIndex: 2,
    explanation: 'Once transactions commit, the changes become permanent in database files obeying the ACID durability mandate.'
  }
];

export const hrInterviewQuestions = [
  {
    question: 'Tell me about yourself.',
    bestApproach: 'Divide response into Present (active MCA focus & technical scope), Past (achievements, prior training), and Future (why this targeted corporate entry role suits your vision).'
  },
  {
    question: 'Why do you want to join our company as an MCA graduate?',
    bestApproach: 'Align your technical programming expertise (React, Node, Cloud, SQL) with their open products, clients and recent technological ventures.'
  },
  {
    question: 'How do you handle conflict in a technical team project?',
    bestApproach: 'Detail using the STAR schema (Situation, Task, Action, Result). Express objective code metrics, active code-reviews, and collaborative consensus instead of emotional arguments.'
  }
];

export const careerGuidelines: CareerPath[] = [
  {
    title: 'Software Developer (Full-Stack)',
    demand: 'Very High',
    description: 'Design and write client-facing interfaces, scalable microservice APIs, database integrations, and manage deployments.',
    skillsNeeded: ['React/TypeScript', 'Node.js/Express', 'PostgreSQL/NoSQL', 'Docker & Git'],
    avgSalary: '₹7.5L - ₹15L LPA',
    steps: [
      'Master Javascript/TypeScript basics and HTML5/CSS3 models.',
      'Study Advanced backend design, Express routes, and relational databases.',
      'Deploy full projects on Cloud Run, Vercel, or AWS with standard security configurations.',
      'Practice DS & Algorithms for high-level technical assessments.'
    ]
  },
  {
    title: 'AI / Machine Learning Engineer',
    demand: 'High',
    description: 'Construct data pipeline pipelines, neural architectures, training cycles, fine-tune models, and integrate predictions into scalable workflows.',
    skillsNeeded: ['Python & NumPy', 'PyTorch/TensorFlow', 'Linear Algebra & Calculus', 'Gemini APIs & LLMs'],
    avgSalary: '₹8.5L - ₹18L LPA',
    steps: [
      'Achieve fluent mastery in advanced vector calculations using NumPy and Scikit-Learn.',
      'Explore deep neural networks, CNNs, Transformers, and custom prompt operations.',
      'Build real LLM-backed integrations using GenAI agent development frames.',
      'Engage in Kaggle competitions to polish production-ready modelling.'
    ]
  },
  {
    title: 'Cloud & DevOps Engineer',
    demand: 'Very High',
    description: 'Architect container clustering systems, manage automated CI/CD tools, monitor logs, and secure public cloud infrastructure.',
    skillsNeeded: ['AWS/GCP Architectures', 'Docker & Kubernetes', 'Linux Systems/Bash', 'Terraform IAAC'],
    avgSalary: '₹8L - ₹16L LPA',
    steps: [
      'Learn standard Linux sysadmin tools, file permissions, and Bash scripts.',
      'Build container packages using Docker and integrate GitHub actions for continuous deployment.',
      'Obtain entry AWS Solutions Architect or GCP Cloud engineer credentials.',
      'Study Kubernetes virtualization structures.'
    ]
  }
];
