import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import {
  User,
  Package,
  Heart,
  Wrench,
  Settings,
  LogOut,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileLayout = () => {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  const menuItems = [
    { href: "/profil", label: "Mon Profil", icon: User, exact: true },
    { href: "/profil/commandes", label: "Mes Commandes", icon: Package },
    { href: "/profil/favoris", label: "Mes Favoris", icon: Heart },
    { href: "/profil/reparations", label: "Mes Réparations", icon: Wrench },
    { href: "/profil/parametres", label: "Paramètres", icon: Settings },
  ];

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return location.pathname === href;
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-foreground transition-colors">
              Accueil
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">Mon Compte</span>
          </nav>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Sidebar */}
            <aside className="space-y-6">
              {/* User Card */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.full_name || "Avatar"}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-primary" />
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {profile?.full_name || "Client"}
                    </h2>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="bg-card border border-border rounded-xl p-2">
                <ul className="space-y-1">
                  {menuItems.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                          isActive(item.href, item.exact)
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border mt-2 pt-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => signOut()}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Déconnexion
                  </Button>
                </div>
              </nav>
            </aside>

            {/* Content */}
            <div className="bg-card border border-border rounded-xl p-6">
              <Outlet />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileLayout;
