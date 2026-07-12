"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils/cn";

/* ── Base Avatar ─────────────────────────────────────────────────── */

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-9 w-9 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-white/20 text-white text-xs font-bold",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/* ── AvatarGroup ─────────────────────────────────────────────────── */

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center [&>*:not(:first-child)]:-ml-2.5", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

/* ── AvatarGroupCount ────────────────────────────────────────────── */

interface AvatarGroupCountProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AvatarGroupCount = React.forwardRef<HTMLDivElement, AvatarGroupCountProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#211E1A] bg-white/10 text-white/60 text-[9px] font-extrabold",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AvatarGroupCount.displayName = "AvatarGroupCount";

export { Avatar, AvatarImage, AvatarFallback, AvatarGroup, AvatarGroupCount };
