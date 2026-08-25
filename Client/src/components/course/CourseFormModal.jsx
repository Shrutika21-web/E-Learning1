import { useEffect, useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { TextField, TextareaField } from '../common/TextField';
import { validateCourse, hasErrors } from '../../utils/validators';
import { toInputDate } from '../../utils/formatDate';

const EMPTY = {
  courseName: '',
  description: '',
  fees: '',
  startDate: '',
  endDate: '',
  videoExpireDays: '',
};

export function CourseFormModal({ open, onClose, onSubmit, submitting, course, serverErrors = {} }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (course) {
      setValues({
        courseName: course.courseName || '',
        description: course.description || '',
        fees: course.fees ?? '',
        startDate: toInputDate(course.startDate),
        endDate: toInputDate(course.endDate),
        videoExpireDays: course.videoExpireDays ?? '',
      });
    } else {
      setValues(EMPTY);
    }
    setErrors({});
  }, [open, course]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, ...serverErrors }));
  }, [serverErrors]);

  const set = (key) => (e) => setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateCourse(values);
    setErrors(validation);
    if (hasErrors(validation)) return;

    onSubmit({
      courseName: values.courseName.trim(),
      description: values.description.trim() || undefined,
      fees: Number(values.fees),
      startDate: values.startDate,
      endDate: values.endDate,
      videoExpireDays: values.videoExpireDays ? Number(values.videoExpireDays) : undefined,
    });
  };

  return (
    <Modal open={open} onClose={onClose} title={course ? 'Edit course' : 'Add course'} maxWidth={520}>
      <form onSubmit={handleSubmit} noValidate>
        <TextField
          label="Course name"
          name="courseName"
          value={values.courseName}
          onChange={set('courseName')}
          error={errors.courseName}
          maxLength={100}
          placeholder="e.g. MERN Stack Development"
        />
        <TextareaField
          label="Description"
          name="description"
          value={values.description}
          onChange={set('description')}
          error={errors.description}
          placeholder="What will students learn in this course?"
          rows={3}
        />
        <div className="row gap-md">
          <div className="flex-1">
            <TextField
              label="Fees (₹)"
              name="fees"
              type="number"
              min="0"
              step="1"
              value={values.fees}
              onChange={set('fees')}
              error={errors.fees}
              placeholder="25000"
            />
          </div>
          <div className="flex-1">
            <TextField
              label="Video access (days)"
              name="videoExpireDays"
              type="number"
              min="1"
              step="1"
              value={values.videoExpireDays}
              onChange={set('videoExpireDays')}
              error={errors.videoExpireDays}
              placeholder="180"
              hint="Defaults to 180 if left blank"
            />
          </div>
        </div>
        <div className="row gap-md">
          <div className="flex-1">
            <TextField
              label="Start date"
              name="startDate"
              type="date"
              value={values.startDate}
              onChange={set('startDate')}
              error={errors.startDate}
            />
          </div>
          <div className="flex-1">
            <TextField
              label="End date"
              name="endDate"
              type="date"
              value={values.endDate}
              onChange={set('endDate')}
              error={errors.endDate}
            />
          </div>
        </div>

        <div className="row gap-sm" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
          <Button variant="outline" type="button" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={submitting}>
            {course ? 'Save changes' : 'Create course'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
