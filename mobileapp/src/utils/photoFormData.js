export function appendPhotoAsset(formData, asset) {
  if (!asset) return;
  const uri = asset.uri;
  const ext = (asset.mimeType?.split('/')[1] || uri.split('.').pop() || 'jpg').toLowerCase();
  formData.append('photo', {
    uri,
    name: asset.fileName || `photo.${ext}`,
    type: asset.mimeType || `image/${ext}`,
  });
}
