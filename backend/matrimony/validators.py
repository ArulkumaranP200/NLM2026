from django.core.exceptions import ValidationError

ALLOWED_IMAGE_CONTENT_TYPES = {'image/jpeg', 'image/png', 'image/webp'}
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024


def validate_uploaded_image(image):
    if not image:
        return

    if image.size > MAX_IMAGE_SIZE_BYTES:
        raise ValidationError('Image must be 5 MB or smaller.')

    content_type = getattr(image, 'content_type', '')
    if content_type and content_type not in ALLOWED_IMAGE_CONTENT_TYPES:
        raise ValidationError('Only JPEG, PNG, and WebP images are allowed.')

    try:
        from PIL import Image

        img = Image.open(image)
        img.verify()
        image.seek(0)
    except Exception as exc:
        raise ValidationError('Invalid image file.') from exc
