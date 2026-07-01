import hashlib
from io import BytesIO
from PIL import Image
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.core.exceptions import ValidationError

MIN_WIDTH = 800
MIN_HEIGHT = 600
MAX_FILE_SIZE_MB = 8
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP"}


def validate_and_process_image(uploaded_file):
    """
    Validates format, resolution, and file size. Strips EXIF metadata.
    Returns (processed_file, sha256_hash) or raises ValidationError.
    """
    if uploaded_file.size > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise ValidationError(f"Image exceeds {MAX_FILE_SIZE_MB}MB limit.")

    try:
        img = Image.open(uploaded_file)
        img.verify()
        uploaded_file.seek(0)
        img = Image.open(uploaded_file)
    except Exception:
        raise ValidationError("File is not a valid image.")

    if img.format not in ALLOWED_FORMATS:
        raise ValidationError(f"Format {img.format} not allowed. Use JPEG, PNG, or WebP.")

    width, height = img.size
    if width < MIN_WIDTH or height < MIN_HEIGHT:
        raise ValidationError(
            f"Image resolution too low ({width}x{height}). Minimum is {MIN_WIDTH}x{MIN_HEIGHT}."
        )

    # Strip EXIF: rebuild image without metadata
    clean_img = Image.new(img.mode, img.size)
    clean_img.putdata(list(img.getdata()))

    buffer = BytesIO()
    save_format = img.format if img.format != "JPEG" else "JPEG"
    clean_img.save(buffer, format=save_format, quality=90 if save_format == "JPEG" else None)
    buffer.seek(0)

    file_hash = hashlib.sha256(buffer.getvalue()).hexdigest()
    buffer.seek(0)

    processed_file = InMemoryUploadedFile(
        buffer, None, uploaded_file.name, uploaded_file.content_type,
        buffer.getbuffer().nbytes, None
    )

    return processed_file, file_hash


def check_duplicate(file_hash, landlord_id):
    """
    Returns True if this image hash already exists under a DIFFERENT landlord.
    Same-landlord reuse across their own listings is allowed.
    """
    from .models import PropertyImage
    return PropertyImage.objects.filter(image_hash=file_hash).exclude(
        property__landlord_id=landlord_id
    ).exists()
