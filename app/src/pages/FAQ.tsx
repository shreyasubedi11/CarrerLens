const faqs = [
  {
    question: "What is CareerLens?",
    answer:
      "CareerLens is an AI-powered career assistant that helps you optimize your resume, analyze ATS compatibility, compare your resume with job descriptions, and receive personalized suggestions to improve your chances of landing interviews.",
  },
  {
    question: "What is an ATS?",
    answer:
      "ATS stands for Applicant Tracking System. It is software used by many employers to scan, filter, and rank resumes before they reach recruiters. Using ATS-friendly formatting and relevant keywords can significantly improve your chances of being shortlisted.",
  },
  
  {
    question: "How is the ATS score calculated?",
    answer:
      "CareerLens analyzes your resume based on factors such as formatting, keyword relevance, section organization, readability, and other ATS best practices. The score is an estimate designed to help you identify areas for improvement.",
  },
  {
    question: "How does Resume Analysis work?",
    answer:
      "Simply upload your resume, and CareerLens uses AI to evaluate its strengths and weaknesses. You'll receive an ATS score along with detailed recommendations to improve formatting, content, and keyword optimization.",
  },
  {
    question: "How does Job Match work?",
    answer:
      "Paste a job description and upload your resume. CareerLens compares your resume against the job requirements, identifies matching skills, highlights missing keywords, and provides suggestions to improve your match score.",
  },
  {
    question: "Which file formats are supported?",
    answer:
      "Currently, CareerLens supports PDF files for upload and analysis.",
  },
  {
    question: "Can I analyze multiple resumes?",
    answer:
      "Yes. You can upload and analyze multiple resumes to compare versions and improve each one individually.",
  },
  {
    question: "Why is my ATS score low?",
    answer:
      "A low score may result from missing keywords, poor formatting, incomplete sections, lack of measurable achievements, or using designs that are difficult for ATS software to read.",
  },
  {
    question: "How can I improve my resume?",
    answer:
      "Follow the AI recommendations by adding relevant skills, tailoring your resume to the job description, improving formatting, quantifying achievements, and keeping your resume concise and ATS-friendly.",
  },
  {
    question: "Is my resume stored or shared?",
    answer:
      "Your resume is processed securely for analysis. CareerLens does not share your resume with third parties without your permission.",
  },
  {
    question: "Is CareerLens free?",
    answer:
      "CareerLens offers a free plan with essential AI features. Premium plans unlock additional analyses, higher usage limits, advanced resume insights, and enhanced job matching.",
  },
  {
   
  question: "How do I upgrade my plan?",
  answer:
    "To upgrade your plan, sign in to your CareerLens account and navigate to your Profile page. Click the 'Upgrade Plan' button, select the subscription that best fits your needs, and complete the payment process. Once your payment is successful, your account will be upgraded automatically, giving you immediate access to premium features.",
},
  
  {
    question: "Who should use CareerLens?",
    answer:
      "CareerLens is designed for students, fresh graduates, job seekers, professionals looking to switch careers, and anyone who wants to create stronger, ATS-friendly resumes.",
  },
  {
    question:"What types of resume templates are available on CareerLens",
    answer:
      " Mero CV offers 25 professionally designed resume templates across five categories to suit various career needs, Entry-Level: Perfect for students and recent graduates starting their careers. ",
  },
];
const FAQ = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-30 text-white">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-gradient">
          Find answers to the most common questions about CareerLens.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-semibold text-lg hover:bg-white/10 transition">
              {faq.question}

              <span className="text-2xl transition-transform duration-300 group-open:rotate-45">
                +
              </span>
            </summary>

            <div className="border-t border-white/10 px-5 py-4">
              <p className="text-white/60 leading-7">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default FAQ;