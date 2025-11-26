/**
 * Avatar component that renders user initials without network requests
 */
export function Avatar({ name, className = "w-10 h-10" }: { name: string; className?: string }) {
  // Extract initials from name
  const getInitials = (name: string): string => {
    if (!name || name.trim().length === 0) return "?";
    
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      // First letter of first name + first letter of last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    } else if (parts.length === 1) {
      // First two letters of single name
      return parts[0].substring(0, 2).toUpperCase();
    }
    return "?";
  };

  const initials = getInitials(name);

  return (
    <div
      className={`${className} rounded-full flex items-center justify-center text-white font-semibold text-sm bg-primary-600`}
      title={name}
    >
      {initials}
    </div>
  );
}

