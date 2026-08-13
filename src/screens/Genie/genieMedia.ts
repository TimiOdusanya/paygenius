export function formatDuration(ms?: number): string {
  const total = Math.max(0, Math.round((ms || 0) / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export async function uriToDataUri(uri: string, mimeType: string): Promise<string> {
  if (uri.startsWith('data:')) return uri;
  const response = await fetch(uri);
  const blob = await response.blob();
  const dataUri = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.readAsDataURL(blob);
  });
  if (!dataUri.startsWith('data:') || dataUri.startsWith('data:;') || dataUri.startsWith('data:application/octet-stream')) {
    const base64 = dataUri.split(',')[1] || '';
    return `data:${mimeType};base64,${base64}`;
  }
  return dataUri;
}
