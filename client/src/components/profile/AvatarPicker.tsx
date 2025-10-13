import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Image as ImageIcon,
  Shuffle,
  Search,
  X,
  Star,
  Stars,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

const MotionButton = motion.create(Button);
const MotionCard = motion.create(Card);

const AVATAR_STYLES = [
  { value: "adventurer", label: "Adventurer" },
  { value: "adventurer-neutral", label: "Adventurer Neutral" },
  { value: "avataaars", label: "Avataaars" },
  { value: "avataaars-neutral", label: "Avataaars Neutral" },
  { value: "big-ears", label: "Big Ears" },
  { value: "big-ears-neutral", label: "Big Ears Neutral" },
  { value: "big-smile", label: "Big Smile" },
  { value: "bottts", label: "Bottts" },
  { value: "bottts-neutral", label: "Bottts Neutral" },
  { value: "croodles", label: "Croodles" },
  { value: "croodles-neutral", label: "Croodles Neutral" },
  { value: "fun-emoji", label: "Fun Emoji" },
  { value: "icons", label: "Icons" },
  { value: "identicon", label: "Identicon" },
  { value: "initials", label: "Initials" },
  { value: "lorelei", label: "Lorelei" },
  { value: "lorelei-neutral", label: "Lorelei Neutral" },
  { value: "micah", label: "Micah" },
  { value: "miniavs", label: "Mini Avs" },
  { value: "notionists", label: "Notionists" },
  { value: "notionists-neutral", label: "Notionists Neutral" },
  { value: "open-peeps", label: "Open Peeps" },
  { value: "personas", label: "Personas" },
  { value: "pixel-art", label: "Pixel Art" },
  { value: "pixel-art-neutral", label: "Pixel Art Neutral" },
  { value: "shapes", label: "Shapes" },
  { value: "thumbs", label: "Thumbs" },
] as const;

type AvatarStyle = (typeof AVATAR_STYLES)[number]["value"];

interface AvatarPickerProps {
  value?: string;
  onChange: (avatarUrl: string) => void;
  defaultSeed?: string;
  favorites?: string[];
  onToggleFavorite?: (url: string) => void;
}

const FALLBACK_AVATAR =
  "https://api.dicebear.com/9.x/identicon/svg?seed=fallback";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface AvatarGridProps {
  avatars: string[];
  onSelect: (url: string) => void;
  selectedPreview: string;
  favorites: string[];
  onToggleFavorite?: (url: string) => void;
  screenSize: "mobile" | "tablet" | "desktop";
  isFavoritesTab?: boolean;
  style: AvatarStyle;
  isGenerating?: boolean;
  onRandomize?: () => void;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  hasMore?: boolean;
}

function AvatarGrid({
  avatars,
  onSelect,
  selectedPreview,
  favorites,
  onToggleFavorite,
  screenSize,
  isFavoritesTab = false,

  isGenerating = false,
  onRandomize,
  onLoadMore,
  isLoadingMore = false,
  hasMore = false,
}: AvatarGridProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  const gridClass = `grid ${
    screenSize === "mobile"
      ? "grid-cols-2"
      : screenSize === "tablet"
      ? "grid-cols-3"
      : "grid-cols-4"
  } gap-1 sm:gap-2 md:gap-3 p-1 sm:p-2 md:p-4`;

  const buttonSizeClass =
    screenSize === "mobile"
      ? "w-14 h-14 sm:w-16 sm:h-16"
      : screenSize === "tablet"
      ? "w-16 h-16 sm:w-20 sm:h-20"
      : "w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28";

  useEffect(() => {
    if (!onLoadMore || isFavoritesTab) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => {
      if (bottomRef.current) {
        observer.unobserve(bottomRef.current);
      }
    };
  }, [onLoadMore, hasMore, isFavoritesTab]);

  if (avatars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-muted-foreground h-full">
        {isFavoritesTab ? (
          <Star className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 mb-2 sm:mb-4 opacity-50" />
        ) : (
          <Search className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 mb-2 sm:mb-4 opacity-50" />
        )}
        <p className="text-sm sm:text-base md:text-lg text-center mb-2 sm:mb-4 px-2">
          {isFavoritesTab ? "No favorites yet" : "No avatars generated yet"}
        </p>
        {isFavoritesTab && (
          <p className="text-xs sm:text-sm text-center mb-4 sm:mb-6 px-2">
            Generate and star avatars to save them here
          </p>
        )}
        {!isFavoritesTab && onRandomize && (
          <MotionButton
            onClick={onRandomize}
            whileHover={{ scale: 1.05 }}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm"
          >
            Generate Now
          </MotionButton>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      role="grid"
      aria-label={isFavoritesTab ? "Favorite avatars" : "Avatar gallery"}
    >
      <div className={gridClass}>
        <AnimatePresence>
          {avatars.map((url, idx) => {
            const isSelected = selectedPreview === url;
            const isFavorite = favorites.includes(url);
            const baseClasses = `relative rounded-xl overflow-hidden border-2 aspect-square transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary/50 shadow-md hover:shadow-xl ${buttonSizeClass}`;
            const selectedClasses = isSelected
              ? "border-primary ring-4 ring-primary/30 scale-105 bg-primary/5"
              : isFavoritesTab
              ? "border-yellow-500 bg-yellow-50/50 hover:border-yellow-500"
              : "border-border hover:border-primary hover:scale-105";
            const overlayVariant = isFavoritesTab
              ? "bg-yellow-500/20"
              : "bg-primary/20";
            const overlayIconVariant = isFavoritesTab
              ? "text-yellow-600"
              : "text-primary-foreground";
            const focusRingVariant = isFavoritesTab
              ? "focus:ring-yellow-500/50"
              : "focus:ring-primary/50";

            return (
              <motion.div
                key={`${url}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative group"
              >
                <MotionButton
                  type="button"
                  className={`${baseClasses} ${selectedClasses} ${focusRingVariant}`}
                  onClick={() => onSelect(url)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={url}
                    alt={`${isFavoritesTab ? "Favorite" : "Generated"} avatar ${
                      idx + 1
                    }`}
                    className="w-full h-full rounded-lg object-cover"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                    }}
                  />
                  {(isSelected || isFavoritesTab) && (
                    <motion.div
                      className={`absolute inset-0 flex items-center justify-center rounded-lg ${overlayVariant}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <Stars
                        className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ${overlayIconVariant}`}
                      />
                    </motion.div>
                  )}
                  {isGenerating && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                      <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin text-primary" />
                    </div>
                  )}
                </MotionButton>
                {onToggleFavorite && !isFavoritesTab && (
                  <MotionButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-0.5 right-0.5 p-0.5 sm:top-1 sm:right-1 sm:p-1 md:top-2 md:right-2 rounded-full bg-background/80 hover:bg-primary/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(url);
                    }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFavorite ? (
                      <Stars className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 text-yellow-500" />
                    ) : (
                      <Star className="h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 text-muted-foreground" />
                    )}
                  </MotionButton>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      {!isFavoritesTab && (
        <div className="flex flex-col items-center py-4">
          {isLoadingMore && (
            <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
          )}
          <div ref={bottomRef} className="h-10" />
        </div>
      )}
    </div>
  );
}

function SeedInput({
  seed,
  onSeedChange,
  isGenerating,
}: {
  seed: string;
  onSeedChange: (value: string) => void;
  isGenerating: boolean;
}) {
  return (
    <Card className="w-full">
      <CardContent className="p-2 sm:p-3 md:p-4 space-y-2 sm:space-y-3">
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          <Search className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-muted-foreground flex-shrink-0" />
          <Input
            value={seed}
            onChange={(e) => onSeedChange(e.target.value)}
            placeholder="Enter seed (e.g., your name or 'creative')"
            className="flex-1 text-xs sm:text-sm"
            disabled={isGenerating}
          />
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Tip: Use personal text for consistent, unique avatars across sessions
        </p>
      </CardContent>
    </Card>
  );
}

function PreviewSection({
  selectedPreview,
  style,
  seed,
  isGenerating,
  onCancel,
  onSelect,
}: {
  selectedPreview: string;
  style: AvatarStyle;
  seed: string;
  isGenerating: boolean;
  onCancel: () => void;
  onSelect: () => void;
}) {
  return (
    <MotionCard
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full overflow-hidden"
    >
      <CardContent className="p-3 sm:p-4 md:p-6 flex flex-col items-center space-y-3 sm:space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-center md:space-x-4 sm:space-x-6">
        <div className="flex flex-col items-center space-y-2 sm:space-y-3 w-full md:w-auto md:flex-1">
          <h4 className="text-xs sm:text-sm md:text-base font-medium text-muted-foreground">
            Live Preview
          </h4>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPreview || "placeholder"}
              initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotate: 5 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative"
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <img
                src={
                  selectedPreview ||
                  `https://api.dicebear.com/9.x/${style}/svg?seed=${
                    seed || "preview"
                  }`
                }
                alt="Selected avatar preview"
                className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full border-3 sm:border-4 border-primary shadow-xl sm:shadow-2xl ring-3 sm:ring-4 ring-primary/20 object-cover ${
                  isGenerating ? "blur-sm" : ""
                }`}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                }}
              />
              {isGenerating && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 animate-spin text-primary" />
                </div>
              )}
            </motion.div>
            {selectedPreview && (
              <Badge
                variant="default"
                className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm"
              >
                Ready to Use
              </Badge>
            )}
          </AnimatePresence>
        </div>
        <div className="flex justify-center sm:justify-end space-x-1 sm:space-x-2 md:space-x-3 w-full md:w-auto md:flex-1">
          <MotionButton
            variant="outline"
            onClick={onCancel}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-none px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm"
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Cancel
          </MotionButton>
          <MotionButton
            onClick={onSelect}
            disabled={!selectedPreview}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 sm:flex-none px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm"
          >
            <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Select Avatar
          </MotionButton>
        </div>
      </CardContent>
    </MotionCard>
  );
}

export default function AvatarPicker({
  value,
  onChange,
  defaultSeed,
  favorites = [],
  onToggleFavorite,
}: AvatarPickerProps) {
  const [open, setOpen] = useState(false);
  const [rawSeed, setRawSeed] = useState(defaultSeed || "");
  const [style, setStyle] = useState<AvatarStyle>("avataaars");
  const [selectedPreview, setSelectedPreview] = useState<string>(value || "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "favorites">("grid");
  const [screenSize, setScreenSize] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );
  const [currentOffset, setCurrentOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const seed = useDebounce(rawSeed.trim(), 300);

  const initialCount =
    screenSize === "mobile" ? 12 : screenSize === "tablet" ? 24 : 36;
  const maxAvatars = 100;

  useEffect(() => {
    setCurrentOffset(0);
    setHasMore(true);
  }, [seed, style, screenSize]);

  const avatars = useMemo(() => {
    if (!seed) return [];
    const total = Math.min(initialCount + currentOffset, maxAvatars);
    const results: string[] = [];
    for (let i = 0; i < total; i++) {
      results.push(
        `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(
          seed + i
        )}`
      );
    }
    return results;
  }, [seed, style, initialCount, currentOffset, screenSize]);

  const favoriteAvatars = useMemo(() => {
    return favorites.filter((fav) =>
      fav.startsWith(`https://api.dicebear.com/9.x/${style}/svg?`)
    );
  }, [favorites, style]);

  // Responsive handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize(
        width < 768 ? "mobile" : width < 1024 ? "tablet" : "desktop"
      );
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (open && !rawSeed && defaultSeed) {
      setRawSeed(defaultSeed);
    }
  }, [open, rawSeed, defaultSeed]);

  const handleSelect = useCallback(
    (url: string) => {
      setSelectedPreview(url);
      onChange(url);
    },
    [onChange]
  );

  const handleRandomSeed = useCallback(() => {
    setIsGenerating(true);
    const randomSeed = Math.random().toString(36).substring(2, 15);
    setRawSeed(randomSeed);
    setTimeout(() => setIsGenerating(false), 300);
  }, []);

  const handleStyleChange = useCallback((newStyle: string) => {
    setStyle(newStyle as AvatarStyle);
  }, []);

  const toggleFavorite = useCallback(
    (url: string) => {
      onToggleFavorite?.(url);
    },
    [onToggleFavorite]
  );

  const handleCancel = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedPreview) {
      onChange(selectedPreview);
    }
    setOpen(false);
  }, [selectedPreview, onChange]);

  const handleSeedChange = useCallback((value: string) => {
    setRawSeed(value);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <MotionButton
          variant="outline"
          className="w-full flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ImageIcon className="h-4 w-4" />
          {value ? "Change Avatar" : "Choose Avatar"}
        </MotionButton>
      </DialogTrigger>
      <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] flex flex-col p-0">
        {/* FIX: Explicit height calc for reliable viewport; pr-2 for scrollbar space */}
        <ScrollArea
          className="w-full pr-2"
          style={{ height: "calc(100vh - 8rem)" }}
        >
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "grid" | "favorites")}
            className="flex flex-col h-full"
          >
            <DialogHeader className="border-b p-2 sm:p-3 md:p-4 flex-shrink-0 bg-gradient-to-r from-primary/5 to-secondary/5">
              <DialogTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 md:gap-4">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
                    Avatar Studio
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Craft your ideal profile image with endless possibilities
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2 w-full sm:w-auto">
                  <Select value={style} onValueChange={handleStyleChange}>
                    <SelectTrigger className="w-full sm:w-40 md:w-48 h-8 sm:h-9 md:h-10 text-xs sm:text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-96">
                      {AVATAR_STYLES.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <MotionButton
                    variant="outline"
                    size="sm"
                    onClick={handleRandomSeed}
                    disabled={isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    <Shuffle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {isGenerating ? (
                      <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    ) : (
                      "Randomize"
                    )}
                  </MotionButton>
                </div>
              </DialogTitle>
              <TabsList className="grid w-full grid-cols-2 mt-2 sm:mt-3 md:mt-4">
                <TabsTrigger
                  value="grid"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
                >
                  Gallery
                </TabsTrigger>
                <TabsTrigger
                  value="favorites"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm"
                  disabled={favoriteAvatars.length === 0}
                >
                  Favorites ({favoriteAvatars.length})
                </TabsTrigger>
              </TabsList>
            </DialogHeader>

            {/* Seed Input Section */}
            <div className="p-2 sm:p-3 md:p-4  border-b bg-muted/30 flex-shrink-0">
              <SeedInput
                seed={rawSeed}
                onSeedChange={handleSeedChange}
                isGenerating={isGenerating}
              />
            </div>

            {/* Tab Contents - FIX: Remove overflow-auto; let ScrollArea scroll the whole thing */}
            <div className="flex-1 min-h-0 pb-2 sm:pb-4">
              <TabsContent value="grid" className="relative mt-0 p-0">
                <AvatarGrid
                  avatars={avatars}
                  onSelect={handleSelect}
                  selectedPreview={selectedPreview}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  screenSize={screenSize}
                  style={style}
                  isGenerating={isGenerating}
                  onRandomize={handleRandomSeed}
                />
              </TabsContent>

              <TabsContent
                value="favorites"
                className="relative mt-0 p-0"
                forceMount
              >
                <AvatarGrid
                  avatars={favoriteAvatars}
                  onSelect={handleSelect}
                  selectedPreview={selectedPreview}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  screenSize={screenSize}
                  isFavoritesTab
                  style={style}
                />
              </TabsContent>
            </div>

            {/* Large Preview Footer */}
            <div className="p-3 sm:p-4 md:p-6 border-t bg-gradient-to-r from-primary/5 to-secondary/5 flex-shrink-0">
              <PreviewSection
                selectedPreview={selectedPreview}
                style={style}
                seed={seed}
                isGenerating={isGenerating}
                onCancel={handleCancel}
                onSelect={handleConfirm}
              />
            </div>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
