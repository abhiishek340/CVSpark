import React from 'react';
import { Button } from "@/components/ui/button";
import { Save, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGlobalContext } from '@/context/global-context';

export const DefaultDataButtons = () => {
  const { saveAsDefault, loadDefaultResume } = useGlobalContext();

  const handleSaveAllAsDefault = async () => {
    const success = await saveAsDefault();
    if (success) {
      toast.success('All current data saved as default template');
    } else {
      toast.error('Failed to save default template');
    }
  };

  const handleResetAllToDefault = async () => {
    await loadDefaultResume();
    toast.success('Reset all sections to default template');
  };

  return (
    <div className="flex gap-2 bg-white p-4 rounded-lg shadow-sm mb-6">
      <Button 
        onClick={handleSaveAllAsDefault}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <Save className="w-4 h-4" />
        Save Current as Default Template
      </Button>
      <Button 
        onClick={handleResetAllToDefault}
        className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Default Template
      </Button>
    </div>
  );
};
