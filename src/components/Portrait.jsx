import { profile } from '../data/profile'

// Renders the real photo from profile.photo, or an initials monogram until one
// is set. Never falls back to a stock/template image.
function Portrait({ className = '', alt, loading }) {
  const { photo, initials } = profile

  if (photo?.src) {
    return (
      <img
        src={photo.src}
        width={photo.width}
        height={photo.height}
        alt={alt}
        loading={loading}
        className={`object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex items-center justify-center bg-[linear-gradient(135deg,#1b1b29,#111116_55%,#171724)] ${className}`}
    >
      <span
        aria-hidden="true"
        className="font-display text-7xl font-extrabold tracking-tight text-[#A5B4FC]/80"
      >
        {initials}
      </span>
    </div>
  )
}

export default Portrait
