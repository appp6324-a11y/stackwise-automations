import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Enterprise tier variants
        standard: "bg-[hsl(var(--tier-standard)/0.15)] text-[hsl(var(--tier-standard))] border-[hsl(var(--tier-standard)/0.3)] font-mono uppercase tracking-wider text-[10px]",
        pro: "bg-[hsl(var(--tier-pro)/0.15)] text-[hsl(var(--tier-pro))] border-[hsl(var(--tier-pro)/0.3)] font-mono uppercase tracking-wider text-[10px]",
        enterprise: "bg-[hsl(var(--tier-enterprise)/0.15)] text-[hsl(var(--tier-enterprise))] border-[hsl(var(--tier-enterprise)/0.3)] font-mono uppercase tracking-wider text-[10px]",
        // Layer variants
        layer: "bg-primary/10 text-primary border-primary/20 font-mono text-[10px]",
        // Agent variants
        agent: "bg-accent/20 text-accent border-accent/30",
        "agent-optional": "bg-muted text-muted-foreground border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
