import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export const ThemeToggleButton = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary transition-colors"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-muted-foreground" />
      )}
    </button>
  );
};

export default ThemeToggleButton;
