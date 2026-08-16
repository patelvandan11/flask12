import { NextResponse } from 'next/server';
import resumeData from '@/data/resume.json';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userMessages = body.messages || [];

    const apiKey = (process.env.OPENAI_API_KEY || '').trim();

    const systemPrompt = `You are Vandan Patel's personal AI Assistant embedded on his portfolio website.
Your goal is to represent Vandan Patel and answer questions from recruiters, engineers, and site visitors about Vandan's experience, skills, projects, education, articles, and contact info.

Here is Vandan Patel's official structured profile data from resume.json:
${JSON.stringify(resumeData, null, 2)}

Guidelines:
- Be friendly, professional, articulate, and concise.
- Answer accurately based strictly on Vandan's profile data.
- If asked how to contact Vandan, provide email (${resumeData.email}) and phone (${resumeData.phone}).
- If asked about projects, highlight key innovations like Meivan SaaS, AI Research Assistant, Market Intelligence Agent, and DeepFake Detection.
- Format responses nicely with markdown list items or bold text where appropriate.`;

    if (apiKey && !apiKey.startsWith('your_openai')) {
      const formattedMessages = [
        { role: 'system', content: systemPrompt },
        ...userMessages.slice(-6).map((msg: { role?: string; content?: string }) => ({
          role: msg.role || 'user',
          content: msg.content || '',
        })),
      ];

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (resp.ok) {
        const result = await resp.json();
        const reply = result.choices?.[0]?.message?.content || '';
        return NextResponse.json({ reply, source: 'openai' });
      } else {
        const errorText = await resp.text();
        const lastUserMsg = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
        const reply = generateLocalResponse(lastUserMsg, errorText);
        return NextResponse.json({ reply, source: 'fallback', api_error: errorText });
      }
    }

    const lastUserMsg = userMessages.length > 0 ? userMessages[userMessages.length - 1].content : '';
    const reply = generateLocalResponse(lastUserMsg);
    return NextResponse.json({ reply, source: 'local_assistant' });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}

function generateLocalResponse(query: string, apiErr?: string): string {
  const q = (query || '').toLowerCase();
  let prefix = '';
  if (apiErr) {
    prefix = '*(Note: OpenAI API key error detected. Using portfolio fallback mode.)*\n\n';
  }

  if (/skill|stack|technology|programming|python|language/.test(q)) {
    const skills = resumeData.technical_skills || {};
    const langs = (skills.programming_languages || []).join(', ');
    const frameworks = (skills.frameworks || []).join(', ');
    const lib = (skills.ai_ml_libraries || []).slice(0, 8).join(', ');
    return (
      prefix +
      `**Vandan's Technical Skills:**\n- **Programming Languages:** ${langs}\n- **Frameworks:** ${frameworks}\n- **AI/ML Libraries:** ${lib}\n- **Core Expertise:** Generative AI, RAG Systems, AI Agents, Deep Learning, and Computer Vision.`
    );
  } else if (/experience|work|job|intern|company|esparkbiz|corp8/.test(q)) {
    const exps = resumeData.work_experience || [];
    let out = "**Vandan's Work Experience:**\n";
    for (const item of exps) {
      out += `- **${item.role}** at **${item.company}** (${item.duration})\n  ${item.details}\n\n`;
    }
    return prefix + out.trim();
  } else if (/project|build|developed|portfolio|meivan|rag|deepfake/.test(q)) {
    const projs = resumeData.featured_projects || [];
    let out = "**Vandan's Key Projects:**\n";
    for (const p of projs.slice(0, 4)) {
      out += `- **${p.title}**: ${p.description}\n`;
    }
    out += '\nYou can view all project details on the [Projects page](/projects).';
    return prefix + out;
  } else if (/contact|email|phone|reach|hire|linkedin/.test(q)) {
    return (
      prefix +
      `**Contact Vandan Patel:**\n- **Email:** [${resumeData.email}](mailto:${resumeData.email})\n- **Phone:** ${resumeData.phone}\n- **Location:** ${resumeData.location}\n- **LinkedIn:** [LinkedIn Profile](${resumeData.links?.linkedin})`
    );
  } else if (/education|degree|cgpa|college|university|gpa/.test(q)) {
    return (
      prefix +
      `**Education:**\n- **${resumeData.degree}**\n- **Institution:** ${resumeData.institution}\n- **Graduation:** ${resumeData.graduation_year}\n- **CGPA:** ${resumeData.cgpa}`
    );
  } else {
    return (
      prefix +
      `I am Vandan's AI Portfolio Assistant. Feel free to ask me any question about Vandan Patel's technical skills, work experience, projects, education, or contact details!`
    );
  }
}
