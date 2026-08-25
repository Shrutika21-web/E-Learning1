const { pool } = require('../config/db');
const { AppError } = require('../middleware/errorMiddleware');
const courseService = require('./courseService');

function mapVideoRow(row) {
  return {
    videoId: row.video_id,
    courseId: row.course_id,
    title: row.title,
    description: row.description,
    youtubeURL: row.youtube_url,
    addedAt: row.added_at,
  };
}

async function getAllVideos(courseId) {
  let sql = `SELECT video_id, course_id, title, description, youtube_url, added_at FROM videos`;
  const params = [];

  if (courseId) {
    sql += ' WHERE course_id = ?';
    params.push(courseId);
  }

  sql += ' ORDER BY added_at DESC';

  const [rows] = await pool.execute(sql, params);
  return rows.map(mapVideoRow);
}

async function getVideoById(videoId) {
  const [rows] = await pool.execute(
    `SELECT video_id, course_id, title, description, youtube_url, added_at
     FROM videos WHERE video_id = ?`,
    [videoId]
  );
  return rows.length ? mapVideoRow(rows[0]) : null;
}

async function addVideo({ courseId, title, description, youtubeURL }) {
  const course = await courseService.getCourseById(courseId);
  if (!course) {
    throw new AppError('Cannot add video: course does not exist', 404);
  }

  const [result] = await pool.execute(
    `INSERT INTO videos (course_id, title, description, youtube_url)
     VALUES (?, ?, ?, ?)`,
    [courseId, title, description || null, youtubeURL]
  );

  return getVideoById(result.insertId);
}

async function updateVideo(videoId, { courseId, title, description, youtubeURL }) {
  const existingVideo = await getVideoById(videoId);
  if (!existingVideo) {
    throw new AppError('Video not found', 404);
  }

  const course = await courseService.getCourseById(courseId);
  if (!course) {
    throw new AppError('Cannot update video: course does not exist', 404);
  }

  await pool.execute(
    `UPDATE videos SET course_id = ?, title = ?, description = ?, youtube_url = ?
     WHERE video_id = ?`,
    [courseId, title, description || null, youtubeURL, videoId]
  );

  return getVideoById(videoId);
}

async function deleteVideo(videoId) {
  const existingVideo = await getVideoById(videoId);
  if (!existingVideo) {
    throw new AppError('Video not found', 404);
  }

  await pool.execute('DELETE FROM videos WHERE video_id = ?', [videoId]);
  return true;
}

module.exports = { getAllVideos, getVideoById, addVideo, updateVideo, deleteVideo };
