import { cn } from "@/lib/utils";

interface LoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function LoginButton({ 
  onClick, 
  disabled, 
  children,
  className 
}: LoginButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all",
        "w-full py-6 border border-gray-300 bg-white hover:bg-gray-50",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}
