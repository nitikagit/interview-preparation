import Link from 'next/link';
import AppLogo from './AppLogo';

const Header = () => {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <AppLogo />
          <span className="text-xl font-bold text-foreground">
            Interview Gennie
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
