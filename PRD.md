# JVM Learning Platform

Create an interactive learning platform for Java Virtual Machine (JVM) concepts based on Oracle's official documentation.

**Experience Qualities**:
1. **Educational** - Clear, structured learning progression that builds understanding systematically
2. **Professional** - Clean, technical interface that reflects enterprise Java development standards
3. **Interactive** - Engaging exercises and examples that reinforce theoretical concepts

**Complexity Level**: Light Application (multiple features with basic state)
- Multiple learning modules with progress tracking, interactive examples, and structured curriculum following Oracle's JVM specification

## Essential Features

### Learning Module System
- **Functionality**: Organized curriculum covering JVM architecture, memory management, garbage collection, class loading, and performance tuning
- **Purpose**: Provide structured learning path following Oracle's official documentation
- **Trigger**: User selects a learning module from the main dashboard
- **Progression**: Module selection → Topic overview → Detailed content → Interactive examples → Quiz/exercises → Progress tracking → Next topic
- **Success criteria**: Users can navigate through modules and track completion progress

### Interactive Code Examples
- **Functionality**: Live code demonstrations showing JVM behavior, memory allocation, and garbage collection
- **Purpose**: Reinforce theoretical concepts with practical examples
- **Trigger**: User clicks on code example sections within modules
- **Progression**: Code display → Explanation overlay → Step-by-step execution → Memory visualization → User experimentation
- **Success criteria**: Examples load correctly and provide clear visual feedback

### Progress Tracking
- **Functionality**: Track completion of modules, save bookmarks, and show learning progress
- **Purpose**: Motivate continued learning and allow users to resume where they left off
- **Trigger**: Automatic tracking as user completes sections
- **Progression**: Content completion → Progress update → Visual feedback → Achievement unlocks → Next recommendations
- **Success criteria**: Progress persists between sessions and accurately reflects completion

### Study Notes System
- **Functionality**: Allow users to take and save personal notes on each topic
- **Purpose**: Enable active learning and create personalized reference material
- **Trigger**: User clicks note-taking button in any module
- **Progression**: Note creation → Rich text editing → Auto-save → Organization by topic → Search functionality
- **Success criteria**: Notes are saved persistently and easily retrievable

## Edge Case Handling
- **Empty Progress State**: Show welcome guide and recommended starting points for new users
- **Offline Access**: Cache essential content for basic offline browsing
- **Complex Topics**: Provide multiple explanation levels (beginner, intermediate, advanced)
- **Mobile Usage**: Responsive design that works well on smaller screens for reading

## Design Direction
The design should feel professional and academic, similar to Oracle's documentation style, with a clean, minimalist interface that prioritizes content readability and technical accuracy.

## Color Selection
Complementary (opposite colors) - Using Oracle's brand-inspired red and blue palette to create professional, technical atmosphere.

- **Primary Color**: Deep Oracle Red (oklch(0.45 0.15 25)) - Communicates authority and enterprise reliability
- **Secondary Colors**: 
  - Navy Blue (oklch(0.25 0.1 250)) - For secondary actions and technical highlights
  - Light Gray (oklch(0.95 0.02 250)) - For backgrounds and subtle sections
- **Accent Color**: Bright Blue (oklch(0.6 0.15 250)) - For CTAs, links, and progress indicators
- **Foreground/Background Pairings**:
  - Background (Light Gray #F8F9FA): Dark Gray text (oklch(0.2 0.02 250)) - Ratio 12.8:1 ✓
  - Card (White #FFFFFF): Dark Gray text (oklch(0.2 0.02 250)) - Ratio 15.3:1 ✓
  - Primary (Oracle Red): White text (oklch(1 0 0)) - Ratio 6.2:1 ✓
  - Secondary (Navy Blue): White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Accent (Bright Blue): White text (oklch(1 0 0)) - Ratio 4.7:1 ✓

## Font Selection
Use Inter for its excellent readability in technical documentation and professional appearance that aligns with enterprise software standards.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter Bold/32px/tight letter spacing
  - H2 (Module Titles): Inter Semibold/24px/normal spacing
  - H3 (Section Headers): Inter Medium/20px/normal spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Code Text: JetBrains Mono/14px/monospace for code examples

## Animations
Subtle and purposeful animations that guide learning flow without distraction, emphasizing content transitions and progress feedback.

- **Purposeful Meaning**: Smooth transitions between learning modules communicate progression and maintain context
- **Hierarchy of Movement**: Focus animation on progress indicators, module transitions, and interactive elements

## Component Selection
- **Components**: 
  - Cards for module organization and content sections
  - Tabs for different topic areas within modules
  - Progress indicators for learning advancement
  - Accordion for FAQ and detailed explanations
  - Dialog for interactive examples and quizzes
  - Breadcrumb for navigation context
- **Customizations**: Custom progress visualization components, interactive code display panels
- **States**: Clear hover states for navigation, distinct completion states for modules, focused states for active learning content
- **Icon Selection**: Phosphor icons for technical concepts (Code, BookOpen, CheckCircle, PlayCircle)
- **Spacing**: Consistent 8px spacing system using Tailwind's scale for comfortable reading
- **Mobile**: Responsive sidebar that collapses to hamburger menu, stacked card layouts, touch-friendly interactive elements