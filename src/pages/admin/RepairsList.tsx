import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAdminRepairs, useUpdateRepair } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, Plus, Wrench, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  received: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  diagnosing: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  repairing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  delivered: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels: Record<string, string> = {
  received: 'Reçu',
  diagnosing: 'Diagnostic',
  repairing: 'En réparation',
  ready: 'Prêt',
  delivered: 'Livré',
  cancelled: 'Annulé',
};

const RepairsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const statusFilter = searchParams.get('status') || 'all';

  const { data: repairs, isLoading } = useAdminRepairs(statusFilter);
  const updateRepair = useUpdateRepair();

  const filteredRepairs = repairs?.filter(
    (repair) =>
      repair.repair_number.toLowerCase().includes(search.toLowerCase()) ||
      repair.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      repair.customer_phone.includes(search) ||
      (repair.device_brand?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (repair.device_model?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const handleStatusChange = async (repairId: string, newStatus: string) => {
    try {
      await updateRepair.mutateAsync({ id: repairId, status: newStatus });
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Réparations</h1>
          <p className="text-muted-foreground">Gérez toutes les réparations GSM</p>
        </div>
        <Link to="/admin/reparations/nouvelle">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle réparation
          </Button>
        </Link>
      </div>

      <Card className="glass">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro, client, appareil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(v) => setSearchParams({ status: v })}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="received">Reçu</SelectItem>
                <SelectItem value="diagnosing">Diagnostic</SelectItem>
                <SelectItem value="repairing">En réparation</SelectItem>
                <SelectItem value="ready">Prêt</SelectItem>
                <SelectItem value="delivered">Livré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Appareil</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Coût estimé</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : filteredRepairs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucune réparation trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRepairs?.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell>
                        <span className="font-mono font-medium">{repair.repair_number}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{repair.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{repair.customer_phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {repair.device_brand} {repair.device_model}
                          </p>
                          <p className="text-sm text-muted-foreground">{repair.device_type}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(repair.created_at), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        {repair.estimated_cost ? (
                          <span className="font-medium">
                            {repair.estimated_cost.toFixed(3)} TND
                          </span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[repair.status]}>
                          {statusLabels[repair.status] || repair.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/admin/reparations/${repair.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir détails
                              </Link>
                            </DropdownMenuItem>
                            {repair.status === 'received' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(repair.id, 'diagnosing')}
                              >
                                <Wrench className="mr-2 h-4 w-4" />
                                Démarrer diagnostic
                              </DropdownMenuItem>
                            )}
                            {repair.status === 'diagnosing' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(repair.id, 'repairing')}
                              >
                                <Wrench className="mr-2 h-4 w-4" />
                                Démarrer réparation
                              </DropdownMenuItem>
                            )}
                            {repair.status === 'repairing' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(repair.id, 'ready')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marquer prêt
                              </DropdownMenuItem>
                            )}
                            {repair.status === 'ready' && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(repair.id, 'delivered')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Livré
                              </DropdownMenuItem>
                            )}
                            {!['delivered', 'cancelled'].includes(repair.status) && (
                              <DropdownMenuItem
                                onClick={() => handleStatusChange(repair.id, 'cancelled')}
                                className="text-destructive"
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                Annuler
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepairsList;
