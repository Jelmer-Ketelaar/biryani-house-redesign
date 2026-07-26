import type * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = React.HTMLAttributes<HTMLDivElement> & {
  delay?: number;
};

export function Reveal({ children, className, delay: _delay, ...props }: RevealProps) {
  return (
    <div className={cn(className)} {...props}>
      {children}
    </div>
  );
}
