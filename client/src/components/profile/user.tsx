import { useEffect, useState, useCallback } from "react";
import { getCurrentUser, updateUserProfile } from "@/api/user";
import type { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  AlignLeft as BioIcon,
  Calendar as CalendarIcon,
  Link,
  Twitter,
  Linkedin,
  Github,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AvatarPicker from "./AvatarPicker";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// Enhanced User type with social links
interface EnhancedUser extends User {
  twitter?: string;
  linkedin?: string;
  github?: string;
  birthDate?: string;
  image?: string;
}

// Updated Ethiopian regions and major cities (as of 2025)
const regionsData = {
  regions: [
    { name: "Addis Ababa", cities: ["Addis Ababa"] },
    { name: "Dire Dawa", cities: ["Dire Dawa"] },
    { name: "Afar", cities: ["Semera", "Asaita", "Awash", "Dubti", "Gewane"] },
    {
      name: "Amhara",
      cities: [
        "Bahir Dar",
        "Gonder",
        "Dessie",
        "Debre Birhan",
        "Debre Markos",
        "Kombolcha",
        "Debre Tabor",
        "Woldiya",
        "Mota",
        "Finote Selam",
      ],
    },
    { name: "Benishangul-Gumuz", cities: ["Assosa"] },
    {
      name: "Central Ethiopia",
      cities: [
        "Hosaina",
        "Butajira",
        "Welkite",
        "Worabe",
        "Durame",
        "Alaba Kulito",
      ],
    },
    { name: "Gambela", cities: ["Gambela"] },
    { name: "Harari", cities: ["Harar"] },
    {
      name: "Oromia",
      cities: [
        "Adama",
        "Jimma",
        "Shashamane",
        "Bishoftu",
        "Nekemte",
        "Asella",
        "Sebeta",
        "Burayu",
        "Ambo",
        "Batu",
        "Waliso",
        "Meki",
      ],
    },
    { name: "Sidama", cities: ["Hawassa", "Yirgalem"] },
    { name: "Somali", cities: ["Jijiga", "Gode", "Degehabur", "Kebridahar"] },
    {
      name: "South Ethiopia",
      cities: [
        "Wolayta Sodo",
        "Arba Minch",
        "Dilla",
        "Sawla",
        "Jinka",
        "Konso",
        "Basketo",
      ],
    },
    {
      name: "South West Ethiopia Peoples'",
      cities: ["Mizan Teferi", "Bonga", "Teppi", "Maji"],
    },
    {
      name: "Tigray",
      cities: [
        "Mekelle",
        "Adigrat",
        "Shire",
        "Aksum",
        "Adwa",
        "Alamata",
        "Wukro",
      ],
    },
  ],
};

// Validation schema for editable fields only
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  phone: z.string().optional(),
  location: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function UserInfo() {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [initialUser, setInitialUser] = useState<EnhancedUser | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<FormData>({
    name: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      location: "",
      bio: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getCurrentUser();
        const enhancedUser: EnhancedUser = { ...res.user };
        setUser(enhancedUser);
        setInitialUser(enhancedUser);

        const initialValues: FormData = {
          name: enhancedUser.name || "",
          phone: enhancedUser.phone || "",
          location: enhancedUser.location || "",
          bio: enhancedUser.bio || "",
        };
        setInitialFormValues(initialValues);
        form.reset(initialValues);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load user info");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [form]);

  // Robust parse location function
  const parseLocation = useCallback(
    (location: string): { region: string; city: string } => {
      if (!location) return { region: "", city: "" };
      const parts = location.split(",").map((p) => p.trim());
      if (parts.length < 2) return { region: "", city: parts[0] || "" };
      const city = parts[0];
      const regionStr = parts.slice(1).join(", ");
      const foundRegion = regionsData.regions.find((r) => r.name === regionStr);
      if (foundRegion && foundRegion.cities.includes(city)) {
        return { region: regionStr, city };
      }
      // Fallback: set even if not in list
      return { region: regionStr, city };
    },
    []
  );

  // Always parse location when it changes
  useEffect(() => {
    if (user?.location !== undefined) {
      const { region, city } = parseLocation(user.location);
      setSelectedRegion(region);
      setSelectedCity(city);
    }
  }, [user?.location, parseLocation]);

  useEffect(() => {
    if (initialUser) {
      const formDirty = form.formState.isDirty;
      const imageChanged = user?.image !== initialUser.image;
      setHasChanges(formDirty || imageChanged);
    }
  }, [form.formState.isDirty, user?.image, initialUser]);

  const handleSave = async (data: FormData) => {
    if (!user) return;
    setSaving(true);

    try {
      console.log("[FRONTEND] Sending user update payload:", data);

      // Only send backend-supported fields
      const payload = {
        ...data,
        image: user.image,
      };

      const updated = await updateUserProfile(payload);

      console.log("[FRONTEND] Server responded with:", updated);

      const newUser = updated.user as EnhancedUser;
      setUser(newUser);
      setInitialUser(newUser);

      const newValues: FormData = {
        name: newUser.name || "",
        phone: newUser.phone || "",
        location: newUser.location || "",
        bio: newUser.bio || "",
      };
      setInitialFormValues(newValues);
      form.reset(newValues);
      setHasChanges(false);
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Hi {newUser.name}, your profile was updated! 🎉</span>
        </div>
      );
    } catch (err) {
      console.error("[FRONTEND] Error updating profile:", err);
      toast.error("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    } else {
      resetForm();
    }
  };

  const confirmCancel = () => {
    resetForm();
    setShowCancelConfirm(false);
  };

  const resetForm = () => {
    if (initialUser) {
      setUser(initialUser);
      form.reset(initialFormValues);
    }
    setHasChanges(false);
  };

  const avatarUrl =
    user?.image ||
    `https://api.dicebear.com/9.x/adventurer/svg?seed=${user?.name || "User"}`;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No user found.
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <UserIcon className="h-6 w-6" />
                Your Profile
              </CardTitle>
              {hasChanges && (
                <Badge
                  variant="destructive"
                  className="flex items-center gap-1"
                >
                  <AlertCircle className="h-3 w-3" />
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form
              onSubmit={form.handleSubmit(handleSave)}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4 p-6 bg-gradient-to-br from-muted to-muted/50 rounded-xl border">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full border-4 border-primary shadow-xl ring-2 ring-primary/20"
                  />
                  {hasChanges && user?.image !== initialUser?.image && (
                    <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                      <CheckCircle className="h-4 w-4 text-background" />
                    </div>
                  )}
                </div>
                <AvatarPicker
                  value={user.image}
                  onChange={(url) => setUser({ ...user, image: url })}
                />
                <p className="text-sm text-muted-foreground text-center">
                  Click to change your avatar
                </p>
              </div>

              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 rounded-xl p-1">
                  <TabsTrigger
                    value="basic"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg"
                  >
                    <UserIcon className="mr-2 h-4 w-4" /> Basic Info
                  </TabsTrigger>
                  <TabsTrigger
                    value="social"
                    className="data-[state=active]:bg-background data-[state=active]:shadow-md rounded-lg"
                  >
                    <Link className="mr-2 h-4 w-4" /> Social Links
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        {...form.register("name")}
                        className="h-11"
                      />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="birthDate"
                        className="flex items-center gap-1 text-sm font-medium"
                      >
                        <CalendarIcon className="h-4 w-4" />
                        Birth Date
                      </Label>
                      <Input
                        id="birthDate"
                        value={
                          user.birthDate
                            ? new Date(user.birthDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )
                            : "Not set"
                        }
                        disabled
                        className="h-11 bg-muted/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is managed by your account settings
                      </p>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-1 text-sm font-medium"
                      >
                        <Mail className="h-4 w-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="h-11 bg-muted/50 cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is your login email
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="phone"
                        className="flex items-center gap-1 text-sm font-medium"
                      >
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., +251 9xx xxx xxx"
                        {...form.register("phone")}
                        className="h-11"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label className="flex items-center gap-1 text-sm font-medium">
                        <MapPin className="h-4 w-4" />
                        Location
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="region"
                            className="text-xs font-medium text-muted-foreground mb-1 block"
                          >
                            Region/State
                          </Label>
                          <Select
                            value={selectedRegion}
                            onValueChange={(val) => {
                              setSelectedRegion(val);
                              setSelectedCity("");
                              form.setValue("location", "", {
                                shouldDirty: true,
                              });
                            }}
                          >
                            <SelectTrigger id="region" className="h-11">
                              <SelectValue placeholder="Select a region" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 overflow-y-auto">
                              {regionsData.regions.map((region) => (
                                <SelectItem
                                  key={region.name}
                                  value={region.name}
                                >
                                  {region.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label
                            htmlFor="city"
                            className="text-xs font-medium text-muted-foreground mb-1 block"
                          >
                            City
                          </Label>
                          <Select
                            value={selectedCity}
                            onValueChange={(val) => {
                              setSelectedCity(val);
                              form.setValue(
                                "location",
                                selectedRegion
                                  ? `${val}, ${selectedRegion}`
                                  : val,
                                { shouldDirty: true }
                              );
                            }}
                            disabled={!selectedRegion}
                          >
                            <SelectTrigger
                              id="city"
                              className={cn(
                                "h-11",
                                !selectedRegion &&
                                  "opacity-50 cursor-not-allowed"
                              )}
                            >
                              <SelectValue
                                placeholder={
                                  selectedRegion
                                    ? "Select a city"
                                    : "Select region first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedRegion
                                ? regionsData.regions
                                    .find((r) => r.name === selectedRegion)
                                    ?.cities.map((city) => (
                                      <SelectItem key={city} value={city}>
                                        {city}
                                      </SelectItem>
                                    ))
                                : null}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <input type="hidden" {...form.register("location")} />
                      <Input
                        value={form.watch("location")}
                        className="mt-2 h-11 bg-transparent border-dashed"
                        readOnly
                      />
                      {form.formState.errors.location && (
                        <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                          <AlertCircle className="h-3 w-3" />
                          {form.formState.errors.location.message}
                        </p>
                      )}
                      {selectedRegion && selectedCity && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Preview: {selectedCity}, {selectedRegion}
                        </p>
                      )}
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-2">
                    <Label
                      htmlFor="bio"
                      className="flex items-center gap-1 text-sm font-medium"
                    >
                      <BioIcon className="h-4 w-4" />
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      {...form.register("bio")}
                      rows={4}
                      className="resize-none min-h-[100px] pr-10"
                    />
                    <p className="text-xs text-muted-foreground">
                      You can use Markdown for formatting.
                    </p>
                    {form.formState.errors.bio && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {form.formState.errors.bio.message}
                      </p>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="social" className="mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Link className="h-5 w-5" />
                        Connected Accounts
                      </h3>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-72">
                          <div className="text-sm text-muted-foreground">
                            Social links are read-only. Connect them via account
                            settings.
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {user.twitter || user.linkedin || user.github ? (
                      <>
                        {user.twitter && (
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-500 rounded-full">
                                <Twitter className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">Twitter</p>
                                <p className="text-sm text-muted-foreground truncate max-w-48">
                                  @{user.twitter.split("/").pop()}
                                </p>
                              </div>
                            </div>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <a
                                  href={user.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  View →
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>Opens in new tab</TooltipContent>
                            </Tooltip>
                          </div>
                        )}
                        {user.linkedin && (
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg border-l-4 border-blue-600">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-600 rounded-full">
                                <Linkedin className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">LinkedIn</p>
                                <p className="text-sm text-muted-foreground truncate max-w-48">
                                  {user.linkedin.split("/").pop()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={user.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View →
                            </a>
                          </div>
                        )}
                        {user.github && (
                          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-l-4 border-gray-700">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-700 rounded-full">
                                <Github className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="font-medium">GitHub</p>
                                <p className="text-sm text-muted-foreground truncate max-w-48">
                                  {user.github.split("/").pop()}
                                </p>
                              </div>
                            </div>
                            <a
                              href={user.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
                            >
                              View →
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-8 bg-muted/30 rounded-lg">
                        <Link className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground mb-1">
                          No social links connected yet.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Connect your accounts in settings to showcase your
                          profiles.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row justify-between pt-6 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={!hasChanges || saving}
                  className="h-11"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving || !hasChanges}
                  className="h-11 flex-1 sm:flex-none"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>

            {showCancelConfirm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-background rounded-lg p-6 max-w-sm w-full mx-4 space-y-4">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      Discard Changes?
                    </h3>
                    <p className="text-sm text-muted-foreground mb-6">
                      Unsaved changes will be lost. Are you sure?
                    </p>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setShowCancelConfirm(false)}
                      className="h-10"
                    >
                      Keep Editing
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmCancel}
                      className="h-10"
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
