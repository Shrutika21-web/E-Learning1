import { useState } from 'react';
import { Button } from '../common/Button';
import { SendIcon, XIcon, TrashIcon, MessageCircleIcon } from '../common/Icons';
import { useToast } from '../../hooks/useToast';
import { extractErrorMessage } from '../../api/axios';
import * as aiApi from '../../api/aiApi';

const SUGGESTIONS = [
  'Which course should I learn first?',
  'What should I learn after JavaScript?',
  'Which course is best for full-stack development?',
];

const WELCOME = 'Hi, I\'m your Course Assistant. Ask me about the active courses and I\'ll help you choose what to learn next.';

export function CourseAssistant({ currentCourse }) {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: WELCOME }]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const submit = async (event) => {
    event?.preventDefault();
    const text = question.trim();
    if (!text || loading) return;
    setQuestion('');
    setMessages((current) => [...current, { role: 'user', text }]);
    setLoading(true);
    try {
      const result = await aiApi.chat(text, currentCourse);
      setMessages((current) => [...current, { role: 'assistant', text: result.message }]);
    } catch (error) {
      toast.error(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const clear = () => setMessages([{ role: 'assistant', text: WELCOME }]);

  return (
    <div className="course-assistant">
      {open && (
        <section className="assistant-panel" aria-label="Course Assistant">
          <header className="assistant-header">
            <div>
              <div className="assistant-title">Course Assistant</div>
              <div className="assistant-status">Ask anything about learning</div>
            </div>
            <div className="row gap-xs">
              <button className="assistant-icon-btn" type="button" onClick={clear} aria-label="Clear chat" title="Clear chat"><TrashIcon size={15} /></button>
              <button className="assistant-icon-btn" type="button" onClick={() => setOpen(false)} aria-label="Close assistant" title="Close assistant"><XIcon size={17} /></button>
            </div>
          </header>
          <div className="assistant-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`assistant-message ${message.role}`} key={`${message.role}-${index}`}>{message.text}</div>
            ))}
            {messages.length === 1 && !loading && (
              <div className="assistant-suggestions">
                {SUGGESTIONS.map((suggestion) => <button type="button" key={suggestion} onClick={() => setQuestion(suggestion)}>{suggestion}</button>)}
              </div>
            )}
            {loading && <div className="assistant-message assistant typing"><span /><span /><span /></div>}
          </div>
          <form className="assistant-form" onSubmit={submit}>
            <input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask anything about learning..." maxLength={1000} aria-label="Ask the Course Assistant" />
            <Button type="submit" variant="primary" size="sm" icon={SendIcon} aria-label="Send question" disabled={!question.trim() || loading} />
          </form>
        </section>
      )}
      <button className={`assistant-launcher ${open ? 'active' : ''}`} type="button" onClick={() => setOpen((value) => !value)} aria-label={open ? 'Close Course Assistant' : 'Open Course Assistant'} title="Course Assistant">
        {open ? <XIcon size={22} /> : <MessageCircleIcon size={23} />}
        {!open && <span>Course Assistant</span>}
      </button>
    </div>
  );
}
