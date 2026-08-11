from flask import Flask, render_template, url_for, request, jsonify
import json
import os
import requests
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Load environment variables from .env file if present
env_path = os.path.join(BASE_DIR, '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

app = Flask(__name__,
    template_folder=os.path.join(BASE_DIR, 'templates'),
    static_folder=os.path.join(BASE_DIR, 'static'))

def load_resume_data():
    resume_path = os.path.join(BASE_DIR, 'resume.json')
    if os.path.exists(resume_path):
        with open(resume_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}

@app.route('/')
def home():
    with open(os.path.join(BASE_DIR, 'data.json'), encoding='utf-8') as f:
        projects = json.load(f)
    return render_template('home.html', projects=projects)
 
@app.route('/projects', methods=['GET', 'POST'])
def projects():
    with open(os.path.join(BASE_DIR, 'data.json'), encoding='utf-8') as f:
        projects = json.load(f)
    return render_template('projects.html', projects=projects)
 

@app.route('/karl_pearson')
def karl_pearson():
    return render_template('karl_pearson.html')

@app.route('/karl_pearson_out', methods=['POST'])
def karl_pearson_out():
    try:
        n = int(request.form['n'])
        x_values = [float(x) for x in request.form['x'].split(',')]
        y_values = [float(y) for y in request.form['y'].split(',')]

        if len(x_values) != n or len(y_values) != n:
            raise ValueError("The number of values does not match 'n'")

        x_sum = sum(x_values)
        y_sum = sum(y_values)
        xy_sum = sum(x * y for x, y in zip(x_values, y_values))
        x_squared_sum = sum(x ** 2 for x in x_values)
        y_squared_sum = sum(y ** 2 for y in y_values)

        numerator = n * xy_sum - x_sum * y_sum
        denominator = ((n * x_squared_sum - x_sum ** 2) * (n * y_squared_sum - y_sum ** 2)) ** 0.5

        if denominator == 0:
            raise ZeroDivisionError("Denominator is zero, correlation cannot be calculated.")

        result = numerator / denominator
        return render_template('karl_pearson_out.html', result=result)
    
    except Exception as e:
        error_message = str(e)
        return render_template('error.html', error_message=error_message)

@app.route('/about')
def about():
    return render_template("about.html")

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/blog')
def blog():
    with open(os.path.join(BASE_DIR, 'Blog.json'), encoding='utf-8') as f:
        posts = json.load(f)
    return render_template("blog.html", posts=posts)

@app.route('/resume.json')
def get_resume():
    return jsonify(load_resume_data())

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json() or {}
        user_messages = data.get('messages', [])
        
        # Read API key directly from environment / .env file
        api_key = os.environ.get('OPENAI_API_KEY', '').strip()
        resume_data = load_resume_data()

        system_prompt = f"""You are Vandan Patel's personal AI Assistant embedded on his portfolio website.
Your goal is to represent Vandan Patel and answer questions from recruiters, engineers, and site visitors about Vandan's experience, skills, projects, education, articles, and contact info.

Here is Vandan Patel's official structured profile data from resume.json:
{json.dumps(resume_data, indent=2)}

Guidelines:
- Be friendly, professional, articulate, and concise.
- Answer accurately based strictly on Vandan's profile data.
- If asked how to contact Vandan, provide email (vandan11patel@gmail.com) and phone (+91 96647 92015).
- If asked about projects, highlight key innovations like Meivan SaaS, AI Research Assistant, Market Intelligence Agent, and DeepFake Detection.
- Format responses nicely with markdown list items or bold text where appropriate.
"""

        # If OpenAI API Key is loaded from .env or environment
        if api_key and not api_key.startswith('your_openai'):
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            
            formatted_messages = [{"role": "system", "content": system_prompt}]
            for msg in user_messages[-6:]: # Keep recent context window
                formatted_messages.append({
                    "role": msg.get("role", "user"),
                    "content": msg.get("content", "")
                })

            payload = {
                "model": "gpt-4o-mini",
                "messages": formatted_messages,
                "temperature": 0.7,
                "max_tokens": 500
            }

            resp = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, timeout=15)
            if resp.status_code == 200:
                result = resp.json()
                reply = result['choices'][0]['message']['content']
                return jsonify({"reply": reply, "source": "openai"})
            else:
                error_body = resp.json() if resp.text else {}
                err_msg = error_body.get('error', {}).get('message', 'OpenAI API call failed')
                reply = generate_local_response(user_messages[-1]['content'] if user_messages else '', resume_data, err_msg)
                return jsonify({"reply": reply, "source": "fallback", "api_error": err_msg})
        
        # Local Intelligent Fallback Engine
        last_user_msg = user_messages[-1]['content'] if user_messages else ''
        reply = generate_local_response(last_user_msg, resume_data)
        return jsonify({"reply": reply, "source": "local_assistant"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def generate_local_response(query, resume, api_err=None):
    q = query.lower()
    prefix = ""
    if api_err:
        prefix = "*(Note: OpenAI API key error detected. Using portfolio fallback mode.)*\n\n"

    if any(k in q for k in ["skill", "stack", "technology", "programming", "python", "language"]):
        skills = resume.get("technical_skills", {})
        langs = ", ".join(skills.get("programming_languages", []))
        frameworks = ", ".join(skills.get("frameworks", []))
        lib = ", ".join(skills.get("ai_ml_libraries", [])[:8])
        return prefix + f"**Vandan's Technical Skills:**\n- **Programming Languages:** {langs}\n- **Frameworks:** {frameworks}\n- **AI/ML Libraries:** {lib}\n- **Core Expertise:** Generative AI, RAG Systems, AI Agents, Deep Learning, and Computer Vision."

    elif any(k in q for k in ["experience", "work", "job", "intern", "company", "esparkbiz", "corp8"]):
        exps = resume.get("work_experience", [])
        out = "**Vandan's Work Experience:**\n"
        for item in exps:
            out += f"- **{item['role']}** at **{item['company']}** ({item['duration']})\n  {item['details']}\n\n"
        return prefix + out.strip()

    elif any(k in q for k in ["project", "build", "developed", "portfolio", "meivan", "rag", "deepfake"]):
        projs = resume.get("featured_projects", [])
        out = "**Vandan's Key Projects:**\n"
        for p in projs[:4]:
            out += f"- **{p['title']}**: {p['description']}\n"
        out += "\nYou can view all project details on the [Projects page](/projects)."
        return prefix + out

    elif any(k in q for k in ["contact", "email", "phone", "reach", "hire", "linkedin"]):
        return prefix + f"**Contact Vandan Patel:**\n- **Email:** [{resume.get('email')}](mailto:{resume.get('email')})\n- **Phone:** {resume.get('phone')}\n- **Location:** {resume.get('location')}\n- **LinkedIn:** [LinkedIn Profile]({resume.get('links', {}).get('linkedin')})"

    elif any(k in q for k in ["education", "degree", "cgpa", "college", "university", "gpa"]):
        return prefix + f"**Education:**\n- **{resume.get('degree')}**\n- **Institution:** {resume.get('institution')}\n- **Graduation:** {resume.get('graduation_year')}\n- **CGPA:** {resume.get('cgpa')}"

    else:
        return prefix + f"I am Vandan's AI Portfolio Assistant. Feel free to ask me any question about Vandan Patel's technical skills, work experience, projects, education, or contact details!"


if __name__ == '__main__':
    app.run(debug=True)
