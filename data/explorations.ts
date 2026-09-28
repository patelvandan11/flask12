export interface BlockItem {
  id: string;
  label: string;
  subtext?: string;
  color?: 'mint' | 'yellow' | 'purple' | 'blue' | 'rose' | 'amber';
}

export interface SubsystemCard {
  id: string;
  title: string;
  icon: string;
  badgeColor: 'mint' | 'yellow' | 'purple' | 'blue' | 'rose' | 'amber';
  sections: {
    sectionTitle: string;
    blocks: BlockItem[];
  }[];
}

export interface ArchitectureDiagram {
  diagramType: 'components';
  runtimeLabel: string;
  title: string;
  subtitle: string;
  connectionLabel: string;
  subsystems: SubsystemCard[];
}

export interface WorkflowStep {
  id: string;
  label: string;
  type: 'reasoning' | 'tool' | 'process' | 'decision' | 'output' | 'input';
  icon?: string;
  subItems?: string[];
  loopBackLabel?: string;
  yesLabel?: string;
}

export interface AgenticWorkflowDiagram {
  diagramType: 'workflow';
  runtimeLabel: string;
  title: string;
  subtitle: string;
  legend: { label: string; color: 'mint' | 'purple' | 'blue' | 'yellow' }[];
  inputLabel: string;
  steps: WorkflowStep[];
  outputLabel: string;
}

export interface ExplorationItem {
  id: string;
  title: string;
  category: string;
  description: string;
  longDescription: string;
  url: string;
  githubUrl?: string;
  buttonText: string;
  featured?: boolean;
  tagline?: string;
  previewType: 'ai-sim' | 'meivan' | 'meivan-art' | 'deepfake' | 'default';
  badgeStyle: string;
  accentGradient: string;
  cardGlow: string;
  images: string[];
  features: string[];
  techStack: string[];
  stats?: { label: string; value: string }[];
  diagram: ArchitectureDiagram;
  workflowDiagram?: AgenticWorkflowDiagram;
}

export const explorations: ExplorationItem[] = [
  {
    id: 'ai-civilization-simulator',
    title: 'AI Civilization Simulator',
    category: 'AI Experiment',
    description:
      'An experimental AI civilization simulator exploring intelligent agents, decision-making, interactions, and evolving digital societies.',
    longDescription:
      'AI Civilization Simulator is an advanced multi-agent experiment designed to study emergent societal behavior, resource economics, and collective intelligence. Autonomous AI agents gather resources, craft tools, form governance policies, trade, and evolve within a procedurally generated world in real time.',
    url: 'https://ai-civilization-simulators.vercel.app/',
    githubUrl: 'https://github.com/patelvandan11/AI_Civilization_Simulator',
    buttonText: 'Explore',
    featured: true,
    tagline: 'Multi-Agent Autonomous Society Engine',
    previewType: 'ai-sim',
    badgeStyle: 'cyber-badge',
    accentGradient: 'from-indigo-600 via-indigo-500 to-purple-600',
    cardGlow: 'indigo',
    images: [
      '/images/AI_civic.png',
      '/images/ai_trip1.jpg',
      '/images/ai_trip2.jpg',
      '/images/aire.png',
    ],
    features: [
      'Autonomous Agent Planning & LLM Decision Trees',
      'Dynamic Resource Economy (Wood, Stone, Iron, Food, Gold)',
      'Emergent Social Governance & Multi-Agent Voting Protocols',
      'Procedurally Generated Map Biomes & Settlement Evolution',
      'Real-Time WebSockets Telemetry & Agent Memory Inspection',
    ],
    techStack: [
      'Python',
      'PyTorch',
      'LangGraph',
      'LangChain',
      'React.js',
      'Next.js',
      'Tailwind CSS',
      'WebSockets',
    ],
    stats: [
      { label: 'Active Agents', value: '1,024' },
      { label: 'Society Equilibrium', value: '98.4%' },
      { label: 'Simulation Engine', value: 'RL + LLM' },
    ],
    diagram: {
      diagramType: 'components',
      runtimeLabel: 'Agent Runtime & Society Engine',
      title: 'Components of AI Civilization Agents',
      subtitle: 'Multi-Agent Reasoning, Memory, Governance & World Economy Loop',
      connectionLabel: 'has access to',
      subsystems: [
        {
          id: 'llm_core',
          title: 'LLM & Agent Reasoning',
          icon: 'brain',
          badgeColor: 'mint',
          sections: [
            {
              sectionTitle: 'Reasoning Engine',
              blocks: [
                { id: 'b1', label: 'Planning', subtext: 'RL Goal Trees', color: 'mint' },
                { id: 'b2', label: 'Reflection', subtext: 'Experience Analysis', color: 'mint' },
              ],
            },
            {
              sectionTitle: 'Prompt (Instructions)',
              blocks: [
                { id: 'b3', label: 'Survival Task', subtext: 'Resource Objectives', color: 'mint' },
                { id: 'b4', label: 'Persona & Role', subtext: 'Societal Archetype', color: 'mint' },
              ],
            },
          ],
        },
        {
          id: 'memory_tools',
          title: 'Memory & Action Tools',
          icon: 'tools',
          badgeColor: 'purple',
          sections: [
            {
              sectionTitle: 'Memory Engine',
              blocks: [
                { id: 'm1', label: 'Short-term Memory', subtext: 'Recent Perception', color: 'yellow' },
                { id: 'm2', label: 'Long-term Memory', subtext: 'Vector DB Tree', color: 'yellow' },
              ],
            },
            {
              sectionTitle: 'Action Tools',
              blocks: [
                { id: 't1', label: 'Resource Market', subtext: 'Gathering & Crafting', color: 'purple' },
                { id: 't2', label: 'Governance Tool', subtext: 'Voting & Laws', color: 'purple' },
              ],
            },
          ],
        },
      ],
    },
    workflowDiagram: {
      diagramType: 'workflow',
      runtimeLabel: 'Agentic Workflow',
      title: 'Multi-Agent Planning Pattern',
      subtitle: 'Task Planning, Tool Execution & Decision Loop',
      legend: [
        { label: 'Reasoning', color: 'mint' },
        { label: 'Tool Use', color: 'purple' },
        { label: 'Decision', color: 'blue' },
      ],
      inputLabel: 'User Query / World Seed',
      outputLabel: 'World Sync Response',
      steps: [
        { id: 's1', label: 'Make a Plan', type: 'reasoning', icon: 'brain' },
        { id: 's2', label: 'Plan', type: 'process', icon: 'list', subItems: ['Gather Resources', 'Craft Equipment', 'Form Governance'] },
        { id: 's3', label: 'Execute Task', type: 'reasoning', icon: 'cpu' },
        { id: 's4', label: 'Tools', type: 'tool', icon: 'wrench' },
        { id: 's5', label: 'Results', type: 'process', icon: 'chart' },
        { id: 's6', label: 'All tasks completed?', type: 'decision', loopBackLabel: 'NO', yesLabel: 'YES' },
        { id: 's7', label: 'Generate response', type: 'reasoning', icon: 'sparkles' },
      ],
    },
  },
  {
    id: 'meivan',
    title: 'Meivan',
    category: 'Product / SaaS',
    description:
      'Meivan is building tools for modern AI applications and workflows. Its first product, Meivan Guard, brings policy-based control to AI and application workflows.',
    longDescription:
      'Meivan is a SaaS platform engineered to bring production-grade security, policy control, and latency monitoring to modern LLM applications. Its core product, Meivan Guard, intercepts AI requests to enforce custom guardrails, prevent prompt injections, redact PII, and maintain 100% compliance across workflows.',
    url: 'https://meivan.vercel.app/',
    githubUrl: 'https://github.com/patelvandan11',
    buttonText: 'Visit Meivan',
    featured: false,
    tagline: 'Policy-Based Control for AI Workflows',
    previewType: 'meivan',
    badgeStyle: 'cyber-badge-teal',
    accentGradient: 'from-sky-600 via-teal-500 to-emerald-600',
    cardGlow: 'teal',
    images: [
      '/images/full1.png',
      '/images/mia.png',
      '/images/aire.png',
      '/images/image.png',
    ],
    features: [
      'Policy-Based Guardrails via YAML/JSON Configuration',
      'Sub-5ms Ultra-Low Latency Request Interceptor',
      'Automated Prompt Injection & Hallucination Prevention',
      'Real-Time Security Audit Telemetry & Violation Dashboard',
      'Plug-and-Play Developer SDKs for Python & TypeScript',
    ],
    techStack: [
      'FastAPI',
      'Python',
      'TypeScript',
      'React.js',
      'Next.js',
      'PostgreSQL',
      'Docker',
      'Tailwind CSS',
    ],
    stats: [
      { label: 'Latency Overhead', value: '3.8 ms' },
      { label: 'Policy Violations', value: '0 Blocked' },
      { label: 'Compliance Rating', value: '100%' },
    ],
    diagram: {
      diagramType: 'components',
      runtimeLabel: 'Meivan Guard Runtime',
      title: 'Components of Meivan AI Guardrails',
      subtitle: 'Real-Time Interception, Policy Evaluation & Security Telemetry',
      connectionLabel: 'evaluates against',
      subsystems: [
        {
          id: 'interceptor_core',
          title: 'Request Interceptor',
          icon: 'shield',
          badgeColor: 'blue',
          sections: [
            {
              sectionTitle: 'Interceptor Middleware',
              blocks: [
                { id: 'i1', label: 'HTTPS Parser', subtext: 'Sub-5ms Overhead', color: 'blue' },
                { id: 'i2', label: 'Latency Monitor', subtext: 'Real-time Metrics', color: 'blue' },
              ],
            },
            {
              sectionTitle: 'Prompt Sanitizer',
              blocks: [
                { id: 's1', label: 'PII Redactor', subtext: 'Pattern Masking', color: 'mint' },
                { id: 's2', label: 'Injection Shield', subtext: 'Adversarial Defense', color: 'mint' },
              ],
            },
          ],
        },
        {
          id: 'policy_telemetry',
          title: 'Policy Engine & Audit',
          icon: 'database',
          badgeColor: 'purple',
          sections: [
            {
              sectionTitle: 'Policy Rules',
              blocks: [
                { id: 'pr1', label: 'YAML/JSON Engine', subtext: 'Custom Rules', color: 'yellow' },
                { id: 'pr2', label: 'Credential Rules', subtext: 'DLP Guardrails', color: 'yellow' },
              ],
            },
            {
              sectionTitle: 'Audit Pipeline',
              blocks: [
                { id: 'au1', label: 'Violation Logger', subtext: 'Event Tracking', color: 'purple' },
                { id: 'au2', label: 'Telemetry Stream', subtext: 'Dashboard WebSockets', color: 'purple' },
              ],
            },
          ],
        },
      ],
    },
    workflowDiagram: {
      diagramType: 'workflow',
      runtimeLabel: 'Security Workflow',
      title: 'Meivan Interceptor Pattern',
      subtitle: 'Request Parsing, Policy Validation & Sanitized LLM Output',
      legend: [
        { label: 'Inspection', color: 'mint' },
        { label: 'Policy Engine', color: 'purple' },
        { label: 'Decision', color: 'blue' },
      ],
      inputLabel: 'Client Prompt Payload',
      outputLabel: 'Sanitized Output',
      steps: [
        { id: 'w1', label: 'Intercept Payload', type: 'reasoning', icon: 'shield' },
        { id: 'w2', label: 'Evaluate Policy', type: 'process', icon: 'list', subItems: ['Prompt Injection Shield', 'PII Redaction', 'DLP Guardrails'] },
        { id: 'w3', label: 'Enforce Guardrails', type: 'reasoning', icon: 'lock' },
        { id: 'w4', label: 'Policy Rules', type: 'tool', icon: 'database' },
        { id: 'w5', label: 'Audit Telemetry', type: 'process', icon: 'chart' },
        { id: 'w6', label: 'Payload Compliant?', type: 'decision', loopBackLabel: 'REDACT', yesLabel: 'PASS' },
        { id: 'w7', label: 'Forward to LLM', type: 'reasoning', icon: 'sparkles' },
      ],
    },
  },
  {
    id: 'meivan-art',
    title: 'Meivan Art',
    category: 'Creative / Art',
    description:
      'A creative space for painting, artwork, and visual experimentation.',
    longDescription:
      'Meivan Art is an interactive digital canvas and creative workspace. It serves as an experimental studio for procedural shader graphics, digital painting, generative art algorithms, color theory explorations, and visual art exhibitions.',
    url: 'https://meivan-art.vercel.app/',
    githubUrl: 'https://github.com/patelvandan11',
    buttonText: 'Explore Art',
    featured: false,
    tagline: 'Visual Canvas & Artistic Experiments',
    previewType: 'meivan-art',
    badgeStyle: 'cyber-badge-violet',
    accentGradient: 'from-purple-600 via-pink-500 to-rose-600',
    cardGlow: 'purple',
    images: [
      '/images/gridAIchemy.png',
      '/images/art1.jpg',
      '/images/art2.jpg',
      '/images/art3.jpg',
    ],
    features: [
      'Interactive Generative Canvas Shaders & Brush Physics',
      'Algorithmic Color Palette Harmony Generator',
      'Curated Digital Exhibition & High-Res Artwork Showcase',
      'Procedural Geometry & Fluid Dynamics Experiments',
      'Responsive Touch & Stylus Canvas Support',
    ],
    techStack: [
      'Next.js',
      'HTML5 Canvas',
      'WebGL',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
    ],
    stats: [
      { label: 'Art Series', value: '04 Series' },
      { label: 'Render Engine', value: 'Canvas / WebGL' },
      { label: 'Mode', value: 'Experimental' },
    ],
    diagram: {
      diagramType: 'components',
      runtimeLabel: 'Generative Canvas Studio Runtime',
      title: 'Components of Meivan Art Studio',
      subtitle: 'Stylus Input, Brush Physics, Color Theory & WebGL Shaders',
      connectionLabel: 'renders matrix into',
      subsystems: [
        {
          id: 'input_dynamics',
          title: 'Input & Brush Physics',
          icon: 'brush',
          badgeColor: 'rose',
          sections: [
            {
              sectionTitle: 'Stylus Handler',
              blocks: [
                { id: 'in1', label: 'Touch Position', subtext: 'X/Y Vector', color: 'rose' },
                { id: 'in2', label: 'Pressure Sensing', subtext: 'Stylus Force', color: 'rose' },
              ],
            },
            {
              sectionTitle: 'Brush Dynamics',
              blocks: [
                { id: 'pd1', label: 'Fluid Drag', subtext: 'Particle Physics', color: 'mint' },
                { id: 'pd2', label: 'Stroke Texture', subtext: 'Organic Splatter', color: 'mint' },
              ],
            },
          ],
        },
        {
          id: 'color_shader',
          title: 'Shaders & Canvas Viewport',
          icon: 'sparkles',
          badgeColor: 'purple',
          sections: [
            {
              sectionTitle: 'Color Theory Engine',
              blocks: [
                { id: 'ct1', label: 'Harmonic Swatches', subtext: 'Algorithmic Palette', color: 'yellow' },
                { id: 'ct2', label: 'Gradient Mesh', subtext: 'Color Diffusion', color: 'yellow' },
              ],
            },
            {
              sectionTitle: 'Render Pipeline',
              blocks: [
                { id: 'rp1', label: 'WebGL Shader', subtext: 'Fragment Program', color: 'purple' },
                { id: 'rp2', label: 'Canvas Viewport', subtext: '60 FPS Display', color: 'purple' },
              ],
            },
          ],
        },
      ],
    },
    workflowDiagram: {
      diagramType: 'workflow',
      runtimeLabel: 'Canvas Shader Workflow',
      title: 'Generative Shader Pattern',
      subtitle: 'Brush Motion, Shader Matrix & Frame Render',
      legend: [
        { label: 'Brush Physics', color: 'mint' },
        { label: 'Color Engine', color: 'purple' },
        { label: 'Decision', color: 'blue' },
      ],
      inputLabel: 'Stylus Gesture',
      outputLabel: 'Canvas Render Output',
      steps: [
        { id: 'a1', label: 'Calculate Motion', type: 'reasoning', icon: 'brush' },
        { id: 'a2', label: 'Stroke Matrix', type: 'process', icon: 'list', subItems: ['Drag Calculation', 'Particle Splatter', 'Gradient Mesh'] },
        { id: 'a3', label: 'Apply Shader', type: 'reasoning', icon: 'sparkles' },
        { id: 'a4', label: 'Color Palette', type: 'tool', icon: 'palette' },
        { id: 'a5', label: 'Frame Buffer', type: 'process', icon: 'eye' },
        { id: 'a6', label: 'FPS Target Met?', type: 'decision', loopBackLabel: 'RE-RENDER', yesLabel: 'DISPLAY' },
        { id: 'a7', label: 'Render Viewport', type: 'reasoning', icon: 'zap' },
      ],
    },
  },
  {
    id: 'deepfake-detection',
    title: 'DeepFake Face Detection',
    category: 'AI & Vision',
    description:
      'A hybrid deep learning application using MTCNN face detection and GRU sequence analysis to detect manipulated video frames and deepfakes in real time.',
    longDescription:
      'DeepFake Face Detection is a computer vision application utilizing a hybrid neural architecture. It combines MTCNN for frame-by-frame face extraction and landmark alignment with a Gated Recurrent Unit (GRU) to analyze temporal frame sequences for deepfake classification.',
    url: 'https://deep-fake-face-detection-alpha.vercel.app/',
    githubUrl: 'https://github.com/patelvandan11/DeepFake_Face_Detection',
    buttonText: 'Explore Detection',
    featured: false,
    tagline: 'MTCNN & GRU Video Frame Analysis',
    previewType: 'deepfake',
    badgeStyle: 'cyber-badge-amber',
    accentGradient: 'from-amber-600 via-orange-500 to-red-600',
    cardGlow: 'amber',
    images: [
      '/images/unmasked.png',
      '/images/CNN.png',
      '/images/i.png',
      '/images/aire.png',
    ],
    features: [
      'Multi-Task Cascaded CNN (MTCNN) 5-Point Facial Landmark Detection',
      'Recurrent GRU Temporal Sequence Classifier for Video Frames',
      'Tested & Benchmark-Trained on DFDC & Celeb-DF Datasets',
      'Real-Time Anomaly Detection & Facial Feature Heatmaps',
      'FastAPI Backend & Interactive Streamlit / Web Interface',
    ],
    techStack: [
      'PyTorch',
      'OpenCV',
      'MTCNN',
      'GRU',
      'Python',
      'FastAPI',
      'Streamlit',
      'Tailwind CSS',
    ],
    stats: [
      { label: 'Model Accuracy', value: '98.6%' },
      { label: 'Sequence Model', value: 'MTCNN + GRU' },
      { label: 'Dataset', value: 'DFDC / Celeb-DF' },
    ],
    diagram: {
      diagramType: 'components',
      runtimeLabel: 'Vision & Neural Sequence Runtime',
      title: 'Components of DeepFake Detection Pipeline',
      subtitle: 'MTCNN Facial Landmark Extractor & GRU Recurrent Classifier',
      connectionLabel: 'feeds 30-frame tensor to',
      subsystems: [
        {
          id: 'spatial_extractor',
          title: 'Spatial Extractor (MTCNN)',
          icon: 'scan',
          badgeColor: 'amber',
          sections: [
            {
              sectionTitle: 'Frame Parser',
              blocks: [
                { id: 'f1', label: 'RGB Video Stream', subtext: 'DFDC / Celeb-DF', color: 'amber' },
                { id: 'f2', label: '224x224 Crop', subtext: 'Frame Resizer', color: 'amber' },
              ],
            },
            {
              sectionTitle: 'Facial Landmarks',
              blocks: [
                { id: 'fl1', label: 'Bounding Box', subtext: 'Face Detection', color: 'mint' },
                { id: 'fl2', label: '5 Keypoints', subtext: 'Eyes, Nose, Mouth', color: 'mint' },
              ],
            },
          ],
        },
        {
          id: 'temporal_classifier',
          title: 'Temporal Model (GRU)',
          icon: 'cpu',
          badgeColor: 'purple',
          sections: [
            {
              sectionTitle: 'Sequence Tensor',
              blocks: [
                { id: 'st1', label: '30-Frame Vector', subtext: 'Temporal Matrix', color: 'yellow' },
                { id: 'st2', label: 'Feature Normalizer', subtext: 'Z-Score Scaling', color: 'yellow' },
              ],
            },
            {
              sectionTitle: 'Classification Engine',
              blocks: [
                { id: 'ce1', label: 'GRU Recurrent Net', subtext: 'Temporal Patterns', color: 'purple' },
                { id: 'ce2', label: 'Authenticity Rating', subtext: '98.6% Accuracy Score', color: 'purple' },
              ],
            },
          ],
        },
      ],
    },
    workflowDiagram: {
      diagramType: 'workflow',
      runtimeLabel: 'Neural Vision Workflow',
      title: 'MTCNN + GRU Planning Pattern',
      subtitle: 'Frame Extraction, Landmark Detection & Recurrent Classification',
      legend: [
        { label: 'Extraction', color: 'mint' },
        { label: 'GRU Model', color: 'purple' },
        { label: 'Decision', color: 'blue' },
      ],
      inputLabel: 'Video Stream Input',
      outputLabel: 'Detection Score Output',
      steps: [
        { id: 'd1', label: 'Extract RGB Frames', type: 'reasoning', icon: 'video' },
        { id: 'd2', label: 'MTCNN Bounding Box', type: 'process', icon: 'list', subItems: ['Face Crop 224x224', '5 Facial Keypoints', 'Landmark Alignment'] },
        { id: 'd3', label: 'GRU Sequence Check', type: 'reasoning', icon: 'scan' },
        { id: 'd4', label: '30-Frame Tensor', type: 'tool', icon: 'cpu' },
        { id: 'd5', label: 'Temporal Variance', type: 'process', icon: 'chart' },
        { id: 'd6', label: 'Score Confidence?', type: 'decision', loopBackLabel: 'RE-EXTRACT', yesLabel: 'CLASSIFY' },
        { id: 'd7', label: 'Classify Authenticity', type: 'reasoning', icon: 'check' },
      ],
    },
  },
];
