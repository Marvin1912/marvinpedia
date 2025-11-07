# Marvinpedia - Private Knowledge Management System

Marvinpedia is a modern, personal knowledge management system built with Vue 3 and Vite. It serves as a **private knowledge base** designed for organizing, storing, and accessing code snippets, learning materials, and technical notes across various technology domains.

## 🎯 Purpose

Marvinpedia is a personal digital brain for technical knowledge. Whether as a developer, engineer, or technical professional, this system provides a centralized, organized space to:

- **Store** technical notes and insights from a learning journey
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
