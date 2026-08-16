import React from 'react';
import resumeData from '@/data/resume.json';
import { Mail, Phone, MapPin, Send, Github, Linkedin, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Contact | Vandan Patel',
  description: 'Get in touch with Vandan Patel for full-time roles, freelance projects, AI consulting, or research collaborations.',
};

export default function ContactPage() {
  const socialLinkClasses = "w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-text-secondaryLight dark:text-text-secondaryDark hover:text-cyber-cyan hover:border-cyber-cyan transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-cyan shadow-sm bg-white/40 dark:bg-white/5";

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-20">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-text-primaryLight dark:text-text-primaryDark">
          Get in <span className="bg-gradient-to-r from-cyber-cyan via-cyber-blue to-cyber-violet bg-clip-text text-transparent">Touch</span>
        </h1>
        <p className="text-text-secondaryLight dark:text-text-secondaryDark text-base max-w-2xl mx-auto leading-relaxed">
          Have a project idea, opportunity, or collaboration inquiry? Feel free to reach out directly.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Contact Info Side Card */}
        <div className="cyber-glass-card p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <h2 className="text-base font-bold text-text-primaryLight dark:text-text-primaryDark mb-3">Contact Information</h2>
            <p className="text-xs text-text-secondaryLight dark:text-text-secondaryDark leading-relaxed mb-6">
              I&apos;m open to full-time roles, freelance projects, AI consulting, and research collaborations.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyber-cyan/15 border border-cyber-cyan/35 text-cyber-cyan flex items-center justify-center shadow-sm">
                  <Mail size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-wider">
                    Email
                  </span>
                  <a href={`mailto:${resumeData.email}`} className="font-semibold text-xs text-text-primaryLight dark:text-text-primaryDark hover:text-cyber-cyan transition-colors underline truncate block">
                    {resumeData.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyber-violet/15 border border-cyber-violet/35 text-cyber-violet flex items-center justify-center shadow-sm">
                  <Phone size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-wider">
                    Phone
                  </span>
                  <a href={`tel:${resumeData.phone}`} className="font-semibold text-xs text-text-primaryLight dark:text-text-primaryDark hover:text-cyber-cyan transition-colors block">
                    {resumeData.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyber-emerald/15 border border-cyber-emerald/35 text-cyber-emerald flex items-center justify-center shadow-sm">
                  <MapPin size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-wider">
                    Location
                  </span>
                  <span className="font-semibold text-xs text-text-primaryLight dark:text-text-primaryDark block truncate">
                    {resumeData.location}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 mt-6">
            <div className="flex gap-3 justify-center">
              <a href={resumeData.links.github} target="_blank" rel="noopener noreferrer" className={socialLinkClasses} title="GitHub">
                <Github size={16} />
              </a>
              <a href={resumeData.links.linkedin} target="_blank" rel="noopener noreferrer" className={socialLinkClasses} title="LinkedIn">
                <Linkedin size={16} />
              </a>
              <a href={resumeData.links.medium} target="_blank" rel="noopener noreferrer" className={socialLinkClasses} title="Medium">
                <BookOpen size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form Card */}
        <div className="cyber-glass-card p-6 md:col-span-2">
          <form action="https://api.web3forms.com/submit" method="POST" className="space-y-4">
            <input type="hidden" name="access_key" value="5b038aeb-d553-42aa-b4ad-a244fd5aac2a" />
            <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

            <div>
              <label htmlFor="name" className="block text-xs font-bold text-text-secondaryLight dark:text-text-secondaryDark mb-1.5">
                Your Name
              </label>
              <input type="text" id="name" name="name" className="cyber-input" placeholder="e.g. John Doe" required />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold text-text-secondaryLight dark:text-text-secondaryDark mb-1.5">
                Email Address
              </label>
              <input type="email" id="email" name="email" className="cyber-input" placeholder="e.g. john@example.com" required />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-bold text-text-secondaryLight dark:text-text-secondaryDark mb-1.5">
                Message
              </label>
              <textarea id="message" name="message" className="cyber-input min-h-[120px] resize-y" placeholder="Write your message here..." required></textarea>
            </div>

            <button type="submit" className="cyber-btn-primary w-full py-3 text-sm mt-2">
              Send Message <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
