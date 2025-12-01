import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';

interface ProductTagProps {
  name: string;
  productId: number;
  className?: string;
}

/**
 * Reusable component for displaying a product name as a clickable tag/chip
 * Navigates to the product listing page when clicked
 */
export function ProductTag({ name, productId, className = '' }: ProductTagProps) {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent click handlers
    navigate(`/listings/${productId}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 
        text-xs font-medium 
        bg-primary-100 text-primary-700 
        rounded-full 
        hover:bg-primary-200 
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1
        ${className}
      `}
      aria-label={`View product: ${name}`}
    >
      <Package className="h-3 w-3" />
      <span className="truncate max-w-[120px]">{name}</span>
    </button>
  );
}

