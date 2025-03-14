"use client";

import { useState, useEffect } from "react";
import { 
  Button, 
  Input, 
  Spinner, 
  Divider, 
  Switch,
  Slider,
  Textarea,
  Chip
} from "@nextui-org/react";
import { Save, RefreshCw, AlertTriangle } from "lucide-react";

interface ServerSettingsProps {
  serverId: string;
  gameId: string;
  serverStatus: string;
  onRefresh: () => void;
}

interface SettingsGroup {
  name: string;
  description: string;
  settings: Setting[];
}

interface Setting {
  id: string;
  name: string;
  description: string;
  type: "text" | "number" | "boolean" | "slider" | "textarea";
  value: string | number | boolean;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  advanced?: boolean;
}

export default function ServerSettingsTab({ 
  serverId, 
  gameId, 
  serverStatus,
  onRefresh 
}: ServerSettingsProps) {
  const [settingsGroups, setSettingsGroups] = useState<SettingsGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, [serverId, gameId]);

  const fetchSettings = async () => {
    setIsLoading(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      const response = await fetch(`/api/servers/${serverId}/settings`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch server settings");
      }
      
      const data = await response.json();
      setSettingsGroups(data.settings);
    } catch (error) {
      console.error("Error fetching server settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (groupIndex: number, settingIndex: number, value: string | number | boolean) => {
    const updatedGroups = [...settingsGroups];
    updatedGroups[groupIndex].settings[settingIndex].value = value;
    setSettingsGroups(updatedGroups);
  };

  const saveSettings = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Flatten settings to a single object
      const settings = settingsGroups.reduce((acc, group) => {
        group.settings.forEach((setting) => {
          acc[setting.id] = setting.value;
        });
        return acc;
      }, {} as Record<string, any>);
      
      const response = await fetch(`/api/servers/${serverId}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ settings }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save settings");
      }
      
      setSaveSuccess(true);
      
      // After successful save, refresh server details in parent component
      onRefresh();
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error("Error saving server settings:", error);
      setSaveError(error.message || "An error occurred while saving settings");
      
      // Hide error message after 5 seconds
      setTimeout(() => {
        setSaveError(null);
      }, 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSetting = (setting: Setting, groupIndex: number, settingIndex: number) => {
    // Skip advanced settings unless showAdvanced is true
    if (setting.advanced && !showAdvanced) {
      return null;
    }
    
    switch (setting.type) {
      case "text":
        return (
          <Input
            key={setting.id}
            label={setting.name}
            placeholder={setting.description}
            value={setting.value as string}
            onValueChange={(value) => handleSettingChange(groupIndex, settingIndex, value)}
            className="w-full"
            isRequired={setting.required}
            description={setting.description}
            isDisabled={serverStatus === "ONLINE"}
          />
        );
      case "number":
        return (
          <Input
            key={setting.id}
            label={setting.name}
            placeholder={setting.description}
            value={String(setting.value)}
            onValueChange={(value) => handleSettingChange(groupIndex, settingIndex, parseInt(value) || 0)}
            type="number"
            min={setting.min}
            max={setting.max}
            step={setting.step || 1}
            className="w-full"
            isRequired={setting.required}
            description={setting.description}
            isDisabled={serverStatus === "ONLINE"}
          />
        );
      case "boolean":
        return (
          <div key={setting.id} className="flex flex-col gap-1">
            <Switch
              isSelected={setting.value as boolean}
              onValueChange={(value) => handleSettingChange(groupIndex, settingIndex, value)}
              aria-label={setting.name}
              isDisabled={serverStatus === "ONLINE"}
            >
              {setting.name}
            </Switch>
            <p className="text-small text-gray-500">{setting.description}</p>
          </div>
        );
      case "slider":
        return (
          <div key={setting.id} className="flex flex-col gap-1">
            <p className="font-medium">{setting.name}</p>
            <Slider
              label={setting.description}
              step={setting.step || 1}
              minValue={setting.min || 0}
              maxValue={setting.max || 100}
              value={setting.value as number}
              onChange={(value) => handleSettingChange(groupIndex, settingIndex, value as number)}
              className="max-w-md"
              showOutline={true}
              isDisabled={serverStatus === "ONLINE"}
            />
          </div>
        );
      case "textarea":
        return (
          <Textarea
            key={setting.id}
            label={setting.name}
            placeholder={setting.description}
            value={setting.value as string}
            onValueChange={(value) => handleSettingChange(groupIndex, settingIndex, value)}
            className="w-full"
            isRequired={setting.required}
            description={setting.description}
            minRows={3}
            maxRows={5}
            isDisabled={serverStatus === "ONLINE"}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Server Settings</h3>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<RefreshCw size={16} />}
            onPress={fetchSettings}
            isDisabled={isLoading || isSaving}
          >
            Refresh
          </Button>
          <Button
            color="primary"
            startContent={<Save size={16} />}
            onPress={saveSettings}
            isLoading={isSaving}
            isDisabled={isLoading || serverStatus === "ONLINE"}
          >
            Save Settings
          </Button>
        </div>
      </div>
      
      {serverStatus === "ONLINE" && (
        <div className="flex p-3 bg-warning-50 text-warning-800 rounded-lg items-center gap-2 text-sm">
          <AlertTriangle size={16} />
          <p>Server must be stopped to modify settings</p>
        </div>
      )}
      
      {saveSuccess && (
        <div className="flex p-3 bg-success-50 text-success-800 rounded-lg items-center gap-2 text-sm">
          <Save size={16} />
          <p>Settings saved successfully</p>
        </div>
      )}
      
      {saveError && (
        <div className="flex p-3 bg-danger-50 text-danger-800 rounded-lg items-center gap-2 text-sm">
          <AlertTriangle size={16} />
          <p>{saveError}</p>
        </div>
      )}
      
      <div className="flex justify-end">
        <Switch
          isSelected={showAdvanced}
          onValueChange={setShowAdvanced}
        >
          Show Advanced Settings
        </Switch>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size="lg" />
        </div>
      ) : settingsGroups.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg">No settings available for this server</p>
        </div>
      ) : (
        settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-4">
            <h4 className="text-base font-medium">{group.name}</h4>
            <p className="text-sm text-gray-500">{group.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {group.settings.map((setting, settingIndex) => (
                renderSetting(setting, groupIndex, settingIndex)
              ))}
            </div>
            
            {groupIndex < settingsGroups.length - 1 && <Divider className="my-4" />}
          </div>
        ))
      )}
    </div>
  );
}
