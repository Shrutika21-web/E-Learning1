import { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TextField, TextareaField, SelectField } from '../common/TextField';
import { validateVideo, hasErrors } from '../../utils/validators';
import { isValidYoutubeUrl } from '../../utils/youtube';

const EMPTY = { courseId: '', title: '', description: '', youtubeURL: '' };

export function VideoFormModal({ open, onClose, onSubmit, submitting, video, courses = [], serverErrors = {} }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (video) {
      setValues({
        courseId: String(video.courseId || ''),
        title: video.title || '',
        description: video.description || '',
        youtubeURL: video.youtubeURL || '',
      });
    } else {
      setValues(EMPTY);
    }
    setErrors({});
  }, [open, video]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [serverErrors]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateVideo(values, isValidYoutubeUrl);
    setErrors(validation);
    if (hasErrors(validation)) return;

    onSubmit({
      courseId: Number(values.courseId),
      title: values.title.trim(),
      description: values.description.trim() || undefined,
      youtubeURL: values.youtubeURL.trim(),
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={video ? 'Edit video' : 'Add video'} maxWidth={480}>
      <form onSubmit={handleSubmit} noValidate>
        <SelectField label="Course" name="courseId" value={values.courseId} onChange={set('courseId')} error={errors.courseId}>
          <option value="">Select a course…</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </SelectField>
        <TextField
          label="Video title"
          name="title"
          value={values.title}
          onChange={set('title')}
          error={errors.title}
          maxLength={150}
          placeholder="e.g. Introduction to MERN Stack"
        />
        <TextField
          label="YouTube URL"
          name="youtubeURL"
          value={values.youtubeURL}
          onChange={set('youtubeURL')}
          error={errors.youtubeURL}
          placeholder="https://www.youtube.com/watch?v=…"
        />
        <TextareaField
          label="Description"
          name="description"
          value={values.description}
          onChange={set('description')}
          error={errors.description}
          rows={3}
          placeholder="Optional summary of what this video covers"
        />

        <div className="row gap-sm" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={submitting}>
            {video ? 'Save changes' : 'Add video'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
