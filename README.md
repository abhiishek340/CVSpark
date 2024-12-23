# 🌟 CVSpark - AI-Powered Resume Builder & Job Application Assistant

CVSpark is a modern web application that combines AI-powered resume tailoring with automated job applications. Built using Next.js and Firebase, it offers a seamless and intuitive way to craft professional resumes that stand out.

---

## 🚀 Features

✨ **AI-Powered Tailoring**: Automatically adapts your resume content to match job descriptions.

👁️‍🗨️ **Real-time Preview**: See changes instantly as you edit your resume.

🌙 **Dark Mode Support**: Comfortable editing experience in any lighting condition.

📑 **Multiple Sections**: Easily manage your experience, education, projects, and skills.

📄 **PDF Export**: Download your resume as a professionally formatted PDF.

☁️ **Cloud Storage**: Save and access your resumes anytime with Firebase integration.

📱 **Responsive Design**: Works seamlessly on desktop and mobile devices.

---

## 🛠️ Tech Stack

- **Frontend**:  
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)  
  ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=white)  
  ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)  
  ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

- **Backend & Services**:  
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)  
  ![Google Cloud AI](https://img.shields.io/badge/Google%20Cloud-AI%20API-blue?style=for-the-badge&logo=google-cloud)

- **PDF Generation**:  
  ![@react-pdf](https://img.shields.io/badge/React--PDF-DD0031?style=for-the-badge&logo=pdf&logoColor=white)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Firebase account
- Google Cloud account (for AI features)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/abhiishek340/CVSpark.git
   cd CVSpark
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:  
   Create a `.env.local` file with the following keys:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   GOOGLE_AI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📁 Project Structure

```
CVSpark/
├── app/                    # Next.js app router
│   ├── (dashboard)/       # Dashboard routes
│   └── api/               # API routes
├── components/
│   ├── ui/               # Reusable UI components
│   └── resume/           # Resume-specific components
├── lib/
│   ├── firebase.ts       # Firebase configuration
│   ├── gemini-service.ts # AI service integration
│   └── utils.ts          # Utility functions
├── context/              # Global state management
├── fonts/                # Custom font files
└── public/              # Static assets
```

---

## 🎨 Customization

- **Fonts**: Supports custom fonts like Carlito (Regular & Bold).
- **Colors**: Configurable color schemes with dark/light mode support.
- **Layout**: Adjustable margins and responsive design.

---

## 🔒 Security

- Firebase Authentication for user management.
- Secure API endpoints with proper authentication.
- Firestore security rules implemented.
- Environment variables for sensitive data.

---

## 🤝 Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📞 Support

For support, email [abhiishek340@gmail.com](mailto:your-email@example.com) or open an issue in the repository.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [React-PDF](https://react-pdf.org/)
