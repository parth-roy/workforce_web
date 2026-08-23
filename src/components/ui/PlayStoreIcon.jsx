export default function PlayStoreIcon({ size = 20, className = '' }) {
  return (
    <img src="/playstore.png" alt="Google Play Store" style={{ width: size, height: size }} className={`object-contain ${className}`} />
  );
}
