interface BadgeProps {
  label: string;
  variant?: 'green' | 'grey';
}

export default function Badge({ label, variant = 'green' }: BadgeProps) {
  if (variant === 'grey') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-muted">
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-groen-licht border border-groen/20 text-groen">
      {label}
    </span>
  );
}
