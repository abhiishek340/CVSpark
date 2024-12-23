"use client";

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
      toast.success('Saved as default template');
    } else {
      toast.error('Failed to save default template');
    }
  };

  const handleResetAllToDefault = async () => {
    await loadDefaultResume();
    toast.success('Reset to default template');
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-medium text-gray-700">Template Actions</h4>
      <div className="flex gap-2">
        <Button 
          onClick={handleSaveAllAsDefault}
          variant="outline"
          size="sm"
          className="flex-1 text-xs h-8"
        >
          <Save className="w-3 h-3 mr-1" />
          Save as Default
        </Button>
        <Button 
          onClick={handleResetAllToDefault}
          variant="outline"
          size="sm"
          className="flex-1 text-xs h-8"
        >
          <RotateCcw className="w-3 h-3 mr-1" />
          Reset
        </Button>
      </div>
    </div>
  );
}; 