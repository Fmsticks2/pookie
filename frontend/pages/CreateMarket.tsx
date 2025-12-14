import React, { useState } from 'react';
import { Card, Button, Input, Select, Textarea, Modal } from '../components/UI';
import { MarketCard } from '../components/MarketCard';
import { MarketCategory, MarketStatus } from '../types';
import { api } from '../services/api';
import { Plus, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CreateMarket = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [formData, setFormData] = useState({
      question: '',
      category: MarketCategory.CRYPTO,
      endDate: '',
      minBet: 10,
      description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        await api.createMarket(formData);
        // Simulate success and redirect
        navigate('/');
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  // Mock market object for preview
  const previewMarket = {
    id: 'preview',
    ...formData,
    status: MarketStatus.ACTIVE,
    poolTotal: 0,
    poolYes: 0,
    poolNo: 0,
    participants: 0,
    image: `https://picsum.photos/400/200?random=${Date.now()}`
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Create New Market</h1>
            <p className="text-zinc-400">Deploy a new prediction market on Pookie protocol.</p>
        </div>

        <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Question</label>
                    <Input 
                        placeholder="e.g. Will Bitcoin reach $100k?" 
                        value={formData.question}
                        onChange={e => setFormData({...formData, question: e.target.value})}
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Category</label>
                        <Select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value as MarketCategory})}
                        >
                            {Object.values(MarketCategory).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">End Date (UTC)</label>
                        <Input 
                            type="datetime-local"
                            value={formData.endDate}
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Resolution Rules</label>
                    <Textarea 
                        placeholder="Describe exact conditions for YES/NO resolution..."
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        required
                    />
                </div>

                <div className="bg-surfaceHighlight/50 border border-border rounded-lg p-4 flex gap-3 text-sm text-zinc-400">
                    <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <p>Creating a market requires a small deposit to prevent spam. This deposit is returned when the market resolves correctly.</p>
                </div>

                <div className="pt-4 flex gap-4">
                    <Button type="button" variant="outline" className="flex-1" onClick={() => setPreviewOpen(true)}>
                        <Eye className="w-4 h-4 mr-2" /> Preview
                    </Button>
                    <Button type="submit" className="flex-[2]" isLoading={loading}>
                        <Plus className="w-4 h-4 mr-2" /> Deploy Market
                    </Button>
                </div>
            </form>
        </Card>

        <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Market Preview">
            <div className="space-y-6">
                <p className="text-zinc-400 text-sm">This is how your market will appear on the discovery page.</p>
                <div className="max-w-sm mx-auto">
                    <MarketCard market={previewMarket} />
                </div>
                <div className="flex justify-end">
                    <Button onClick={() => setPreviewOpen(false)}>Close Preview</Button>
                </div>
            </div>
        </Modal>
    </div>
  );
};