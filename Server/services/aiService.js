const courseService = require('./courseService');
const { AppError } = require('../middleware/errorMiddleware');

function normalize(value) {
  return String(value || '').toLowerCase();
}

function findRelevantCourse(question, courses) {
  const words = normalize(question).split(/[^a-z0-9]+/).filter((word) => word.length > 2);
  return courses
    .map((course) => ({
      course,
      score: words.reduce((score, word) => score + (normalize(`${course.courseName} ${course.description}`).includes(word) ? 1 : 0), 0),
    }))
    .sort((left, right) => right.score - left.score)[0];
}

function localAnswer(question, courses, currentCourse) {
  const normalizedQuestion = normalize(question);
  if (!courses.length) return 'I do not have any active course information to use right now.';

  const relevant = findRelevantCourse(question, courses);
  if (/(which|what).*(first|start|begin|learn)/.test(normalizedQuestion)) {
    return `A good starting point from the active catalog is ${courses[0].courseName}. ${courses[0].description || 'Review its available lessons to see whether it matches your goal.'}`;
  }

  if (relevant?.score > 0) {
    const course = relevant.course;
    if (/(fee|price|cost|₹|rupee)/.test(normalizedQuestion)) return `${course.courseName} has a listed fee of ${course.fees}.`;
    if (/(video|access|lesson|duration)/.test(normalizedQuestion)) return `${course.courseName} includes ${course.videoExpireDays} days of video access.`;
    return `${course.courseName}: ${course.description || 'There is no description available for this course.'} The active catalog lists ${course.videoExpireDays} days of video access.`;
  }

  if (currentCourse) return `You are viewing ${currentCourse}. I can answer questions about its catalog information, but the available data does not include prerequisites, career outcomes, or a complete learning sequence.`;
  return 'I can answer general learning questions when the Mistral assistant is configured. Without an AI key, I can only answer from the active course catalog, and that catalog does not contain enough information for this question.';
}

async function chat({ question, currentCourse }) {
  const courses = await courseService.getAssistantCourses();
  const catalog = courses.map((course) => ({
    name: course.courseName,
    description: course.description,
    videoAccessDays: course.videoExpireDays,
  }));
  const apiKey = process.env.MISTRAL_API_KEY;

  if (!apiKey) return { message: localAnswer(question, courses, currentCourse), source: 'catalog' };

  const response = await fetch(process.env.MISTRAL_API_URL || 'https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
      temperature: 0.2,
      messages: [
       {role: 'system', content : `You are EduManage Course Assistant.You help students with both course-related questions and general learning questions.For course-specific information, use the active course catalog provided to you.Do not invent course names, fees, course duration, or other course-specific information.For general programming and learning questions, use your general knowledge and give a helpful answer.For example, if a student asks:"I didn't learn JavaScript. What should I learn first?"Give a beginner-friendly JavaScript learning roadmap and explain what they should learn first.If a student asks:
"Should I learn JavaScript before React?"Explain the answer clearly.If a student asks:"Which course should I choose?"Use the available courses in the course catalog to recommend a course.If a student asks about JavaScript, React, Node.js, Python, HTML, CSS, MongoDB, SQL, or other programming concepts, explain the concept in simple language.Do not make up information about our specific courses.Keep answers simple, practical, and beginner-friendly.` },
       { role: 'user', content: JSON.stringify({ question, currentCourse: currentCourse || null, activeCourseCatalog: catalog }) },
      ],
    }),
  });
  if (!response.ok) throw new AppError('The course assistant is temporarily unavailable', 502);
  const data = await response.json();
  const message = data.choices?.[0]?.message?.content?.trim();
  if (!message) throw new AppError('The course assistant returned no answer', 502);
  return { message, source: 'ai' };
}

module.exports = { chat };