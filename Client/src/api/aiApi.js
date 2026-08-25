import api from './axios';

export function chat(question, currentCourse) {
  return api.post('/api/ai/chat', { question, currentCourse }).then((res) => res.data.data);
}
