import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, FolderTree, ToggleLeft, ToggleRight, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAdminCategories, useDeleteCategory, useUpdateCategory } from '@/hooks/useCategories';
import { toast } from 'sonner';

const CategoriesList = () => {
  const { data: categories, isLoading } = useAdminCategories();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await deleteCategory.mutateAsync(deleteId);
      toast.success('Catégorie supprimée avec succès');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la suppression');
    } finally {
      setDeleteId(null);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateCategory.mutateAsync({ id, is_active: !currentStatus });
      toast.success(currentStatus ? 'Catégorie désactivée' : 'Catégorie activée');
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de la mise à jour');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Build parent-child hierarchy for display
  const parentCategories = categories?.filter(c => !c.parent_id) || [];
  const getChildren = (parentId: string) => categories?.filter(c => c.parent_id === parentId) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Catégories</h1>
          <p className="text-muted-foreground">Gérez les catégories de produits</p>
        </div>
        <Button asChild>
          <Link to="/admin/categories/nouveau">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle catégorie
          </Link>
        </Button>
      </div>

      {/* Categories Table */}
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">Ordre</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parentCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <FolderTree className="mx-auto h-12 w-12 mb-2 opacity-50" />
                  Aucune catégorie trouvée
                </TableCell>
              </TableRow>
            ) : (
              parentCategories.map((category) => (
                <>
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <span className="ml-1">{category.sort_order}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {category.image_url ? (
                          <img
                            src={category.image_url}
                            alt={category.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <FolderTree className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{category.name}</p>
                          {category.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {category.slug}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">Parent</Badge>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => toggleActive(category.id, category.is_active)}
                        className="flex items-center gap-1"
                      >
                        {category.is_active ? (
                          <>
                            <ToggleRight className="h-5 w-5 text-green-500" />
                            <span className="text-sm text-green-600">Actif</span>
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Inactif</span>
                          </>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link to={`/admin/categories/${category.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {/* Child categories */}
                  {getChildren(category.id).map((child) => (
                    <TableRow key={child.id} className="bg-muted/30">
                      <TableCell>
                        <div className="flex items-center text-muted-foreground pl-4">
                          <GripVertical className="h-4 w-4" />
                          <span className="ml-1">{child.sort_order}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3 pl-4">
                          <span className="text-muted-foreground">└</span>
                          {child.image_url ? (
                            <img
                              src={child.image_url}
                              alt={child.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <FolderTree className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <p className="font-medium">{child.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm text-muted-foreground">
                        {child.slug}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.name}</Badge>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleActive(child.id, child.is_active)}
                          className="flex items-center gap-1"
                        >
                          {child.is_active ? (
                            <>
                              <ToggleRight className="h-5 w-5 text-green-500" />
                              <span className="text-sm text-green-600">Actif</span>
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">Inactif</span>
                            </>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/categories/${child.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(child.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Les produits liés à cette catégorie seront désassociés.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriesList;
