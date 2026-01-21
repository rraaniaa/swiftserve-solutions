import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminRepair, useUpdateRepair } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Smartphone,
  Wrench,
  Printer,
  Save,
  Clock,
  DollarSign,
} from 'lucide-react';
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

const RepairDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data: repair, isLoading } = useAdminRepair(id!);
  const updateRepair = useUpdateRepair();

  const [technicianNotes, setTechnicianNotes] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [finalCost, setFinalCost] = useState('');

  // Initialize form values when repair data loads
  useState(() => {
    if (repair) {
      setTechnicianNotes(repair.technician_notes || '');
      setEstimatedCost(repair.estimated_cost?.toString() || '');
      setFinalCost(repair.final_cost?.toString() || '');
    }
  });

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateRepair.mutateAsync({ id: id!, status: newStatus });
      toast.success('Statut mis à jour');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await updateRepair.mutateAsync({
        id: id!,
        technician_notes: technicianNotes,
        estimated_cost: estimatedCost ? parseFloat(estimatedCost) : null,
        final_cost: finalCost ? parseFloat(finalCost) : null,
      });
      toast.success('Informations sauvegardées');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!repair) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Réparation non trouvée</p>
        <Link to="/admin/reparations">
          <Button variant="outline" className="mt-4">
            Retour aux réparations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/admin/reparations">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold">{repair.repair_number}</h1>
              <Badge className={statusColors[repair.status]}>
                {statusLabels[repair.status] || repair.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {format(new Date(repair.created_at), "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Imprimer fiche
          </Button>
          <Select value={repair.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="received">Reçu</SelectItem>
              <SelectItem value="diagnosing">Diagnostic</SelectItem>
              <SelectItem value="repairing">En réparation</SelectItem>
              <SelectItem value="ready">Prêt</SelectItem>
              <SelectItem value="delivered">Livré</SelectItem>
              <SelectItem value="cancelled">Annulé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Informations client
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{repair.customer_name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{repair.customer_phone}</span>
            </div>
            {repair.customer_email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{repair.customer_email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Info */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" />
              Appareil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <p className="font-medium">{repair.device_type}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Marque / Modèle</p>
              <p className="font-medium">
                {repair.device_brand} {repair.device_model}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Problème signalé</p>
              <p className="text-sm mt-1">{repair.problem_description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-display flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Chronologie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Créé le</span>
              <span>{format(new Date(repair.created_at), 'dd/MM/yyyy HH:mm')}</span>
            </div>
            {repair.estimated_completion && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fin estimée</span>
                <span>
                  {format(new Date(repair.estimated_completion), 'dd/MM/yyyy')}
                </span>
              </div>
            )}
            {repair.completed_at && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Terminé le</span>
                <span>{format(new Date(repair.completed_at), 'dd/MM/yyyy HH:mm')}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technician Section */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Notes techniques & Coûts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Coût estimé (TND)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="estimatedCost"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={estimatedCost || repair.estimated_cost?.toString() || ''}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="finalCost">Coût final (TND)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="finalCost"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={finalCost || repair.final_cost?.toString() || ''}
                  onChange={(e) => setFinalCost(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="technicianNotes">Notes du technicien</Label>
            <Textarea
              id="technicianNotes"
              placeholder="Ajoutez vos observations, pièces utilisées, travail effectué..."
              rows={5}
              value={technicianNotes || repair.technician_notes || ''}
              onChange={(e) => setTechnicianNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleSaveNotes} disabled={updateRepair.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {updateRepair.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepairDetail;
