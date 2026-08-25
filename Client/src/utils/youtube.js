// Mirrors the backend's YOUTUBE_URL_REGEX exactly (validators/videoValidator.js)
// so the frontend rejects the same URLs the API would reject.
export const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)[\w-]+|youtu\.be\/[\w-]+)([&?][\w=&-]*)?$/i;

export function isValidYoutubeUrl(url) {
  return typeof url === 'string' && YOUTUBE_URL_REGEX.test(url.trim());
}

export function getYoutubeVideoId(url) {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([\w-]+)/,
    /youtube\.com\/embed\/([\w-]+)/,
    /youtube\.com\/shorts\/([\w-]+)/,
    /youtu\.be\/([\w-]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function getYoutubeThumbnail(url) {
  const id = getYoutubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

export function getYoutubeEmbedUrl(url) {
  const id = getYoutubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
