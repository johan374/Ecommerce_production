import React from 'react';
import { Github, Linkedin, Mail, Download, Code, Database, Layout, Globe,  ArrowLeft } from 'lucide-react';
import yo from '../../../public/assets/yo'
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="relative bg-gray-900 pt-16">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-75" />
        {/* Back button container - positioned absolutely */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            to="/" 
            className="flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg
                      text-white hover:bg-white/20 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>
      {/* Main content */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="text-center mb-16">
        <img
            src={yo}
            alt="Profile picture"
            className="w-32 h-32 rounded-full mx-auto mb-6 border-2 border-white" // Changed from w-56 h-56 and border-4
        />
          <h1 className="text-4xl font-bold text-white mb-4">Johan isidro Benoit</h1>
          <p className="text-xl text-gray-300 mb-6">Full Stack Developer | React & Django Specialist</p>
          
          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-8">
            {/* GitHub Profile */}
            <a 
                href="https://github.com/johan374" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
                title="GitHub Profile"
            >
                <Github className="w-6 h-6" />
            </a>

            {/* Add Repository Link */}
            <a 
                href="https://github.com/johan374/E-commerce" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
                title="Project Repository"
            >
                <Code className="w-6 h-6" />
            </a>

            {/* Rest of your social links */}
            <a 
                href="https://linkedin.com/in/johanisidro" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-white transition-colors"
            >
                <Linkedin className="w-6 h-6" />
            </a>
            <a 
                href="mailto:johanbenoit12@gmail.com" 
                className="text-gray-300 hover:text-white transition-colors"
            >
                <Mail className="w-6 h-6" />
            </a>
            </div>
          
          {/* CV Download */}
          <a 
            href="/documents/cv/Johan_Isidro_CV.pdf" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download CV
          </a>
        </div>

        {/* About This Project */}
        <div className="bg-white rounded-lg shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About This Project</h2>
          <p className="text-gray-600 mb-6">
            This full-stack e-commerce platform showcases my expertise in building modern web applications 
            using React and Django. It demonstrates my ability to create intuitive user interfaces, 
            implement complex backend functionality, and work with databases while maintaining clean, 
            maintainable code.
          </p>
          
          {/* Technologies Used */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Technologies Used</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <Code className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Frontend</h4>
                <p className="text-gray-600">React, TailwindCSS, JavaScript</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Database className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Backend</h4>
                <p className="text-gray-600">python, Django, DRF, PostgreSQL</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <Layout className="w-6 h-6 text-blue-600 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">Architecture</h4>
                <p className="text-gray-600">RESTful API, MVC Pattern</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Globe className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Full Stack Integration</h3>
            <p className="text-gray-600">
              Seamless integration between React frontend and Django backend with RESTful APIs.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Layout className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern UI/UX</h3>
            <p className="text-gray-600">
              Responsive design with Tailwind CSS and dynamic content management.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Database className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Robust Backend</h3>
            <p className="text-gray-600">
              Django REST Framework with PostgreSQL for reliable data management.
            </p>
          </div>
        </div>

        {/* Contact Call-to-Action */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-white mb-4">Let's Work Together</h2>
          <p className="text-gray-300 mb-8">
            I'm open to new opportunities and would love to discuss how I can contribute to your team with my full-stack expertise.
          </p>
          <a 
            href="mailto:johanbenoit12@gmail.com"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Mail className="w-5 h-5 mr-2" />
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}

export default About;