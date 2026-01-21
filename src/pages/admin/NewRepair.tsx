import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCreateRepair } from '@/hooks/useAdmin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, User, Smartphone, Save } from 'lucide-react';
import { toast } from 'sonner';

const deviceTypes = [
  'Smartphone',
  'Tablette',
  'Ordinateur portable',
  'Console de jeux',
  'Smartwatch',
  'Autre',
];

const NewRepair = () => {
  const navigate = useNavigate();
  const createRepair = useCreateRepair();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    device_type: '',
    device_brand: '',
    device_model: '',
    problem_description: '',
    estimated_cost: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_phone || !formData.device_type || !formData.problem_description) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      await createRepair.mutateAsync({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || null,
        device_type: formData.device_type,
        device_brand: formData.device_brand || null,
        device_model: formData.device_model || null,
        problem_description: formData.problem_description,
        estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
        status: 'received',
      });

      toast.success('Réparation créée avec succès');
      navigate('/admin/reparations');
    } catch (error) {
      toast.error('Erreur lors de la création de la réparation');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/reparations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-display font-bold">Nouvelle réparation</h1>
          <p className="text-muted-foreground">Enregistrer une nouvelle demande de réparation</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Info */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Informations client
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Nom complet *</Label>
                <Input
                  id="customer_name"
                  placeholder="Nom du client"
                  value={formData.customer_name}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_phone">Téléphone *</Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  placeholder="+216 XX XXX XXX"
                  value={formData.customer_phone}
                  onChange={(e) => handleChange('customer_phone', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer_email">Email</Label>
                <Input
                  id="customer_email"
                  type="email"
                  placeholder="email@exemple.com"
                  value={formData.customer_email}
                  onChange={(e) => handleChange('customer_email', e.target.value)}
                />
              </div>
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
              <div className="space-y-2">
                <Label htmlFor="device_type">Type d'appareil *</Label>
                <Select
                  value={formData.device_type}
                  onValueChange={(v) => handleChange('device_type', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="device_brand">Marque</Label>
                  <Input
                    id="device_brand"
                    placeholder="Apple, Samsung..."
                    value={formData.device_brand}
                    onChange={(e) => handleChange('device_brand', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="device_model">Modèle</Label>
                  <Input
                    id="device_model"
                    placeholder="iPhone 14, Galaxy S23..."
                    value={formData.device_model}
                    onChange={(e) => handleChange('device_model', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_cost">Coût estimé (TND)</Label>
                <Input
                  id="estimated_cost"
                  type="number"
                  step="0.001"
                  placeholder="0.000"
                  value={formData.estimated_cost}
                  onChange={(e) => handleChange('estimated_cost', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Description */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-lg font-display">Description du problème</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Décrivez le problème rencontré par le client..."
              rows={5}
              value={formData.problem_description}
              onChange={(e) => handleChange('problem_description', e.target.value)}
              required
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link to="/admin/reparations">
            <Button variant="outline">Annuler</Button>
          </Link>
          <Button type="submit" disabled={createRepair.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {createRepair.isPending ? 'Création...' : 'Créer la réparation'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewRepair;
