import { Link } from 'react-router-dom';
import { useDashboardStats, useAdminOrders, useAdminRepairs } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Wrench,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  DollarSign,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  processing: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  shipped: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  delivered: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  received: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  diagnosing: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  repairing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ready: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmée',
  processing: 'En préparation',
  shipped: 'Expédiée',
  delivered: 'Livrée',
  cancelled: 'Annulée',
  received: 'Reçu',
  diagnosing: 'Diagnostic',
  repairing: 'En réparation',
  ready: 'Prêt',
};

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: recentOrders } = useAdminOrders();
  const { data: recentRepairs } = useAdminRepairs();

  const statCards = [
    {
      title: "Commandes aujourd'hui",
      value: stats?.todayOrdersCount || 0,
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Réparations actives',
      value: stats?.activeRepairsCount || 0,
      icon: Wrench,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Stock faible',
      value: stats?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      title: 'Revenu du mois',
      value: `${(stats?.monthRevenue || 0).toFixed(3)} TND`,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans votre espace d'administration FGS Store
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Commandes récentes</CardTitle>
            <Link to="/admin/commandes">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders?.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">{order.order_number}</span>
                      <Badge className={statusColors[order.status]}>
                        {statusLabels[order.status] || order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.customer_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{order.total.toFixed(3)} TND</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.created_at), 'dd MMM HH:mm', { locale: fr })}
                    </p>
                  </div>
                </div>
              ))}

              {(!recentOrders || recentOrders.length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  Aucune commande récente
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Repairs */}
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-display">Réparations en cours</CardTitle>
            <Link to="/admin/reparations">
              <Button variant="ghost" size="sm">
                Voir tout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRepairs
                ?.filter((r) => !['delivered', 'cancelled'].includes(r.status))
                .slice(0, 5)
                .map((repair) => (
                  <div
                    key={repair.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-medium">
                          {repair.repair_number}
                        </span>
                        <Badge className={statusColors[repair.status]}>
                          {statusLabels[repair.status] || repair.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {repair.device_brand} {repair.device_model} - {repair.customer_name}
                      </p>
                    </div>
                    <div className="text-right">
                      {repair.estimated_cost && (
                        <p className="font-medium">{repair.estimated_cost.toFixed(3)} TND</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(repair.created_at), 'dd MMM', { locale: fr })}
                      </p>
                    </div>
                  </div>
                ))}

              {(!recentRepairs ||
                recentRepairs.filter((r) => !['delivered', 'cancelled'].includes(r.status))
                  .length === 0) && (
                <p className="text-center text-muted-foreground py-8">
                  Aucune réparation en cours
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-display">Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/produits/nouveau">
              <Button>
                <Package className="mr-2 h-4 w-4" />
                Ajouter un produit
              </Button>
            </Link>
            <Link to="/admin/reparations/nouvelle">
              <Button variant="outline">
                <Wrench className="mr-2 h-4 w-4" />
                Nouvelle réparation
              </Button>
            </Link>
            <Link to="/admin/commandes?status=pending">
              <Button variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Commandes en attente ({stats?.pendingOrdersCount || 0})
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
