import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { fileTypeFromFile } from "file-type";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "postImage") {
      cb(null, path.join(__dirname, "../../uploads/posts"));
    } else {
      cb(null, path.join(__dirname, "../../uploads/profiles"));
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === "postImage") {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `post-${uniqueSuffix}${path.extname(file.originalname)}`);
    } else {
      // Save as a TEMP file so the existing profile picture is never
      // touched until validation passes. validateImageContent renames it.
      cb(
        null,
        `temp-${req.params.id}-${Date.now()}${path.extname(file.originalname)}`,
      );
    }
  },
});

// First-pass filter: rejects obviously wrong extensions and MIME types declared by the client.
// NOTE: This alone is not enough — both can be spoofed by renaming a file.
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

/**
 * Second-pass middleware: validates the actual file content using magic bytes.
 *
 * Must be used AFTER the multer upload middleware in your route, e.g.:
 *   router.post("/upload", upload.single("postImage"), validateImageContent, handler)
 *
 * Magic bytes are the first few bytes baked into every real image file by the
 * format itself — they cannot be faked by simply renaming a file's extension.
 *
 * For profile pictures, the file is initially saved with a temp name so that
 * the existing profile picture is never overwritten until validation passes.
 * On success the temp file is renamed to the real final name. On failure only
 * the temp file is deleted — the existing profile picture is left untouched.
 */
export const validateImageContent = async (req, res, next) => {
  // Nothing uploaded — skip validation
  if (!req.file && !req.files) return next();

  // Normalise to a flat array whether multer used .single(), .array(), or .fields()
  const files = req.files
    ? Array.isArray(req.files)
      ? req.files
      : Object.values(req.files).flat()
    : [req.file];

  for (const file of files) {
    if (!file) continue;

    let type;
    try {
      type = await fileTypeFromFile(file.path);
    } catch {
      // If we can't even read the file, treat it as invalid
      await fs.unlink(file.path).catch(() => {});
      return res.status(400).json({ message: "Could not read uploaded file." });
    }

    if (!type || !ALLOWED_MIME_TYPES.has(type.mime)) {
      // Delete the TEMP file only — the existing profile picture is untouched
      await fs.unlink(file.path).catch(() => {});
      return res.status(400).json({
        message:
          "Invalid file: the content does not match a supported image format (jpeg, jpg, png, gif, webp).",
      });
    }

    // Validation passed — rename temp file to the real final filename
    if (file.fieldname === "profilePicture") {
      const dir = path.dirname(file.path);
      const ext = path.extname(file.originalname).toLowerCase();
      const finalFilename = `profile-${req.params.id}${ext}`;
      const finalPath = path.join(dir, finalFilename);

      await fs.rename(file.path, finalPath);

      // Update req.file so the controller sees the correct filename and path
      file.filename = finalFilename;
      file.path = finalPath;
    }
  }

  next();
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
