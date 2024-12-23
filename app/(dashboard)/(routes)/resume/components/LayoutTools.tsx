import React, { useState, useCallback, useEffect, useRef } from "react";
import { useGlobalContext } from "@/context/global-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ColorPicker } from "./ColorPicker";
import { debounce } from "lodash";

interface LayoutState {
  font: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

const defaultState: LayoutState = {
  font: "Carlito",
  fontSize: 10.5,
  primaryColor: "#000000",
  secondaryColor: "#666666",
  margins: {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  }
};

const LayoutTools = () => {
  const { addFont, addFontSize, addColors, addMargins } = useGlobalContext();
  const [state, setState] = useState<LayoutState>(defaultState);
  const isInitialRender = useRef(true);

  // Initialize with default values
  useEffect(() => {
    if (isInitialRender.current) {
      addFont(defaultState.font);
      addFontSize(defaultState.fontSize);
      addColors({
        primary: defaultState.primaryColor,
        secondary: defaultState.secondaryColor
      });
      addMargins(defaultState.margins);
      isInitialRender.current = false;
    }
  }, [addFont, addFontSize, addColors, addMargins]);

  const updateLayout = useCallback(
    debounce((updates: Partial<LayoutState>) => {
      if (updates.font) addFont(updates.font);
      if (updates.fontSize) addFontSize(updates.fontSize);
      if (updates.primaryColor || updates.secondaryColor) {
        addColors({
          primary: updates.primaryColor || state.primaryColor,
          secondary: updates.secondaryColor || state.secondaryColor
        });
      }
      if (updates.margins) addMargins(updates.margins);
    }, 500),
    [addFont, addFontSize, addColors, addMargins, state]
  );

  const handleUpdate = useCallback((updates: Partial<LayoutState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      updateLayout(updates);
      return newState;
    });
  }, [updateLayout]);

  const handleMarginChange = (side: keyof typeof state.margins) => (value: number[]) => {
    const newMargins = {
      ...state.margins,
      [side]: value[0]
    };
    handleUpdate({ margins: newMargins });
  };

  return (
    <Card className="p-3 border-0">
      <CardHeader>
        <CardTitle>Layout Customization</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <Label htmlFor="Font">Font</Label>
          <Select value={state.font} onValueChange={(value) => handleUpdate({ font: value })}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Carlito">Carlito</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="Font Size">Font Size</Label>
          <Slider
            min={8}
            max={14}
            step={0.5}
            value={[state.fontSize]}
            onValueChange={(value) => handleUpdate({ fontSize: value[0] })}
          />
          <div className="text-center">{state.fontSize}pt</div>
        </div>

        <div className="space-y-2">
          <Label>Primary Color</Label>
          <ColorPicker 
            color={state.primaryColor} 
            onChange={(color) => handleUpdate({ primaryColor: color })} 
          />
        </div>

        <div className="space-y-2">
          <Label>Secondary Color</Label>
          <ColorPicker 
            color={state.secondaryColor} 
            onChange={(color) => handleUpdate({ secondaryColor: color })} 
          />
        </div>

        <div className="space-y-2">
          <Label>Margins</Label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(state.margins).map(([side, value]) => (
              <div key={side} className="space-y-2">
                <Label>{side.charAt(0).toUpperCase() + side.slice(1)}</Label>
                <Slider
                  min={0}
                  max={50}
                  step={1}
                  value={[value]}
                  onValueChange={handleMarginChange(side as keyof typeof state.margins)}
                />
                <div className="text-center">{value}px</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LayoutTools;