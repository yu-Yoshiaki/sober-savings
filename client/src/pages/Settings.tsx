import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect } from "react";

interface SettingsForm {
  name: string;
  dailyTarget: number;
  startDate: string;
}

export default function Settings() {
  const { settings, updateSettings, resetData } = useApp();
  
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<SettingsForm>({
    defaultValues: {
      name: settings.name,
      dailyTarget: settings.dailyTarget,
      startDate: settings.startDate.split('T')[0],
    }
  });

  // Update form when settings change externally (though rare in this single-user app)
  useEffect(() => {
    reset({
      name: settings.name,
      dailyTarget: settings.dailyTarget,
      startDate: settings.startDate.split('T')[0],
    });
  }, [settings, reset]);

  const onSubmit = (data: SettingsForm) => {
    updateSettings({
      name: data.name,
      dailyTarget: Number(data.dailyTarget),
      startDate: new Date(data.startDate).toISOString(),
    });
    toast.success("Settings updated successfully");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      resetData();
      toast.info("All data has been reset.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div>
        <h2 className="text-3xl font-serif font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Customize your journey and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Profile & Goals</CardTitle>
          <CardDescription>
            Set your baseline for savings calculations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" {...register("name")} />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dailyTarget">Daily Savings Target (¥)</Label>
                <Input 
                  id="dailyTarget" 
                  type="number" 
                  {...register("dailyTarget", { min: 0 })} 
                />
                <p className="text-xs text-muted-foreground">
                  How much did you spend on alcohol daily?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Quit Date</Label>
                <Input 
                  id="startDate" 
                  type="date" 
                  {...register("startDate")} 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={!isDirty}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="font-serif text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions for your data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="font-medium">Reset Application</p>
              <p className="text-sm text-muted-foreground">
                Clears all progress, settings, and history.
              </p>
            </div>
            <Button variant="destructive" onClick={handleReset}>
              Reset All Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
