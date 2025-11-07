# Marvinpedia - Private Knowledge Management System

Marvinpedia is a modern, personal knowledge management system built with Vue 3 and Vite. It serves as a **private knowledge base** designed for organizing, storing, and accessing technical documentation, code snippets, and learning materials across various technology domains.

## 🎯 Purpose

Marvinpedia is your personal digital brain for technical knowledge. Whether you're a developer, engineer, or technical professional, this system provides a centralized, organized space to:

- **Store** technical notes and documentation from your learning journey
- **Organize** knowledge by technology domains and topics
- **Access** quick reference materials and code examples
- **Maintain** a personal library of solutions and best practices
- **Share** knowledge privately when needed

## ✨ Key Features

### 📚 **Hierarchical Knowledge Organization**
- **Three-level navigation**: Homepage → Technology Topics → Individual Articles
- **Topic-based categorization**: Java, Spring, Angular, Kubernetes, Machine Learning, and more
- **Markdown-based content**: Easy to write, edit, and maintain
- **Front matter metadata**: Automatic categorization and discovery

### 🎨 **Interactive User Interface**
- **Flip card components**: Engaging hover effects for topic discovery
- **Responsive design**: Works seamlessly on desktop and mobile
- **Modern UI**: Clean, professional interface with smooth transitions
- **Syntax highlighting**: Code snippets with language-specific highlighting

### 🔧 **Technical Excellence**
- **Vue 3 Composition API**: Modern reactive framework
- **Dynamic content loading**: Automatic discovery of markdown files
- **TypeScript support**: Enhanced development experience
- **Vite-powered**: Fast development and optimized builds

## 🗂️ **Knowledge Domains**

Currently covers 8 major technology areas:

- **Java SE**: Core Java development concepts and patterns
- **Spring Framework**: Enterprise Java development, OAuth, JPA
- **Hibernate**: ORM framework documentation and best practices
- **Angular**: Frontend framework tutorials and component patterns
- **Kafka**: Distributed event streaming and messaging
- **Kubernetes**: Container orchestration and monitoring
- **CSS**: Web styling techniques and responsive design
- **Machine Learning**: Algorithms, concepts, and implementations

## 🚀 **Getting Started**

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

```sh
# Clone the repository
git clone <repository-url>
cd marvinpedia

# Install dependencies
npm install
```

### Development

```sh
# Start development server with hot reload
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build

```sh
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 **Adding Your Knowledge**

### Creating New Topics
1. Create a new folder in `src/components/markdown/`
2. Add markdown files with front matter:

```markdown
---
id: unique-id
name: "Article Title"
topic: "Technology Name"
fileName: "file-name"
---

# Your content here

## Code examples
```javascript
// Your code snippet
```

## Documentation
Your technical notes and explanations...
```

### Content Structure
- Each article requires YAML front matter with `id`, `name`, `topic`, and `fileName`
- Content is written in standard Markdown format
- Code blocks are automatically syntax-highlighted
- Articles are automatically discovered and added to navigation

## 🛠️ **Technology Stack**

- **Frontend**: Vue 3.5.12 + TypeScript
- **Routing**: Vue Router 4.0.13
- **Build Tool**: Vite 5.4.10
- **Markdown**: markdown-it 14.1.0 + front-matter
- **Syntax Highlighting**: highlight.js 11.11.1
- **Styling**: Modern CSS with responsive design

## 🎯 **Use Cases**

Perfect for:
- **Personal learning journal**: Document your programming journey
- **Code snippet library**: Store reusable code patterns
- **Technical reference**: Quick access to implementation details
- **Team knowledge sharing**: Share documentation with your team
- **Interview preparation**: Organize technical concepts and examples
- **Project documentation**: Maintain project-specific knowledge

## 🔒 **Privacy-Focused**

This is designed as a **private knowledge management system**:
- No external dependencies or data collection
- All content stored locally in your repository
- Complete control over your knowledge base
- Can be deployed privately or hosted on your infrastructure

## 📱 **Responsive Design**

- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Optimized layout with touch-friendly interactions
- **Mobile**: Streamlined interface with collapsible navigation

## 🤝 **Contributing**

This is a personal knowledge system, but contributions are welcome:
1. Fork the repository
2. Create a feature branch
3. Add your knowledge or improvements
4. Submit a pull request

## 📄 **License**

This project is open source and available under the MIT License.

---

**Marvinpedia** - Your personal knowledge companion for technical excellence.
