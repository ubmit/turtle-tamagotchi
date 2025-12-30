import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  style,
  ...props
}: React.ComponentProps<typeof BaseProgress.Root> & {
  style?: React.CSSProperties;
}) {
  return (
    <BaseProgress.Root
      value={value}
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      style={style}
      {...props}
    >
      <BaseProgress.Indicator
        data-slot="progress-indicator"
        className="h-full transition-all"
        style={{
          backgroundColor: "var(--progress-color, var(--primary))",
        }}
      />
    </BaseProgress.Root>
  );
}

export { Progress };
