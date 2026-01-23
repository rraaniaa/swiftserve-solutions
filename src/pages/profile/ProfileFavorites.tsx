import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";

const ProfileFavorites = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["user-favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*, products(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: async (favoriteId: string) => {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-favorites"] });
      toast({
        title: "Retiré des favoris",
        description: "Le produit a été retiré de vos favoris.",
      });
    },
  });

  const handleAddToCart = async (productId: string) => {
    await addToCart(productId);
    toast({
      title: "Ajouté au panier",
      description: "Le produit a été ajouté à votre panier.",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">
        Mes Favoris
      </h1>

      {favorites && favorites.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {favorites.map((favorite) => {
            const product = favorite.products;
            if (!product) return null;

            return (
              <div
                key={favorite.id}
                className="border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors group"
              >
                <Link to={`/produit/${product.slug}`} className="block">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Heart className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={`/produit/${product.slug}`}>
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-bold text-primary mt-1">
                    {product.price.toFixed(2)} DT
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={product.stock_quantity === 0}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => removeMutation.mutate(favorite.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">
            Aucun favori
          </h3>
          <p className="text-muted-foreground mb-4">
            Vous n'avez pas encore de produits favoris.
          </p>
          <Button asChild>
            <Link to="/boutique">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Découvrir la boutique
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileFavorites;
