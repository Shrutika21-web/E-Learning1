// Every rule here mirrors the backend's express-validator rules exactly
// (see Server/validators/*.js) so users see the same errors before submitting
// that the API would otherwise return.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin({ email, password }) {
  const errors = {};
  if (!email?.trim()) errors.email = 'Email is required';
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Email must be a valid email address';

  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters long';

  return errors;
}

export function validateRegistration({ fullName, email, password, confirmPassword }) {
  const errors = validateLogin({ email, password });
  if (!fullName?.trim()) errors.fullName = 'Full name is required';
  else if (fullName.trim().length > 100) errors.fullName = 'Full name must be at most 100 characters';
  if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
  else if (confirmPassword !== password) errors.confirmPassword = 'Confirm password does not match password';
  return errors;
}

export function validateAdminCreation({ email, password, confirmPassword }) {
  const errors = validateLogin({ email, password });
  if (!confirmPassword) errors.confirmPassword = 'Confirm password is required';
  else if (confirmPassword !== password) errors.confirmPassword = 'Confirm password does not match password';
  return errors;
}

export function validateCourse({ courseName, fees, startDate, endDate, videoExpireDays }) {
  const errors = {};
  if (!courseName?.trim()) errors.courseName = 'courseName is required';
  else if (courseName.trim().length > 100) errors.courseName = 'courseName must be at most 100 characters';

  if (fees === '' || fees === null || fees === undefined) errors.fees = 'fees is required';
  else if (!Number.isInteger(Number(fees)) || Number(fees) < 0) {
    errors.fees = 'fees must be a whole number greater than or equal to 0';
  }

  if (!startDate) errors.startDate = 'startDate is required';
  if (!endDate) errors.endDate = 'endDate is required';
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    errors.endDate = 'endDate must not be before startDate';
  }

  if (videoExpireDays !== '' && videoExpireDays !== null && videoExpireDays !== undefined) {
    if (!Number.isInteger(Number(videoExpireDays)) || Number(videoExpireDays) < 1) {
      errors.videoExpireDays = 'videoExpireDays must be a positive integer';
    }
  }

  return errors;
}

export function validateVideo({ courseId, title, youtubeURL }, isValidYoutubeUrl) {
  const errors = {};
  if (!courseId) errors.courseId = 'Please select a course';
  if (!title?.trim()) errors.title = 'title is required';
  else if (title.trim().length > 150) errors.title = 'title must be at most 150 characters';

  if (!youtubeURL?.trim()) errors.youtubeURL = 'youtubeURL is required';
  else if (!isValidYoutubeUrl(youtubeURL.trim())) errors.youtubeURL = 'youtubeURL must be a valid YouTube URL';

  return errors;
}

export function validateEnrollment({ name, mobileNo }) {
  const errors = {};
  if (!name?.trim()) errors.name = 'name is required';
  else if (name.trim().length > 100) errors.name = 'name must be at most 100 characters';

  if (!mobileNo?.trim()) errors.mobileNo = 'mobileNo is required';
  else if (!/^\d{10}$/.test(mobileNo.trim())) errors.mobileNo = 'mobileNo must be exactly 10 digits';

  return errors;
}

export function validateChangePassword({ newPassword, confirmPassword }) {
  const errors = {};
  if (!newPassword) errors.newPassword = 'newPassword is required';
  else if (newPassword.length < 6) errors.newPassword = 'newPassword must be at least 6 characters long';

  if (!confirmPassword) errors.confirmPassword = 'confirmPassword is required';
  else if (confirmPassword !== newPassword) errors.confirmPassword = 'confirmPassword does not match newPassword';

  return errors;
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}
