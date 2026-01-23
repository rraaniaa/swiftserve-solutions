import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  Search,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut, isAdmin } = useAuth();
  const { totalItems } = useCart();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/boutique", label: "Boutique" },
    { href: "/services", label: "Services" },
    { href: "/reparation", label: "Réparation" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                <span className="font-display font-bold text-primary-foreground text-lg md:text-xl">F</span>
              </div>
              <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-primary/60" />
              <div className="absolute -right-2 top-1/3 w-2 h-0.5 bg-accent/60" />
              <div className="absolute -right-2 bottom-1/3 w-2 h-0.5 bg-secondary/60" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg md:text-xl text-primary">FGS</span>
              <span className="block text-[10px] md:text-xs text-accent font-medium -mt-1">FOURNIGSM STORE</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/10 rounded-lg transition-all duration-200"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link to="/boutique">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="h-5 w-5" />
              </Button>
            </Link>

            <Link to="/panier">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-accent-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <Link to="/profil">
                <Button variant="glass" size="sm" className="hidden md:flex gap-2">
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name?.split(' ')[0] || 'Profil'}</span>
                </Button>
              </Link>
            ) : (
              <Link to="/connexion">
                <Button variant="glass" size="sm" className="hidden md:flex gap-2">
                  <User className="h-4 w-4" />
                  <span>Connexion</span>
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-3 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-4 py-3 text-base font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="pt-4 mt-2 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    <Link to="/profil" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="hero" className="w-full" size="lg">
                        <User className="h-4 w-4" />
                        Mon Profil
                      </Button>
                    </Link>
                    <Button variant="outline" className="w-full" size="lg" onClick={() => { signOut(); setIsMenuOpen(false); }}>
                      <LogOut className="h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                ) : (
                  <Link to="/connexion" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="hero" className="w-full" size="lg">
                      <User className="h-4 w-4" />
                      Connexion
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
