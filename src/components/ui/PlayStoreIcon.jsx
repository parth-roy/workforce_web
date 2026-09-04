export default function PlayStoreIcon({ size = 20, className = '' }) {
  return (
    <img
      src="/playstore.png"
      alt="Google Play Store"
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      style={{ width: size, height: size }}
      className={`object-contain shrink-0 ${className}`}
    />
  );
}
