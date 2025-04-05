import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import * as React from "react"

type StyleWithOptionalClass = React.CSSProperties & {
  className?: string
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    style?: StyleWithOptionalClass
  }
>(({ style, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    style={{ position: "relative", overflow: "hidden", ...(style || {}) }}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "inherit",
      }}
    >
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar> & {
    style?: StyleWithOptionalClass
  }
>(({ style, orientation = "vertical", ...props }, ref) => {
  const baseStyle: React.CSSProperties = {
    display: "flex",
    touchAction: "none",
    userSelect: "none",
    transition: "color 0.2s ease",
  }

  const verticalStyle: React.CSSProperties =
    orientation === "vertical"
      ? {
          height: "100%",
          width: "10px", // ≈ w-2.5
          borderLeft: "1px solid transparent",
          padding: "1px",
        }
      : {}

  const horizontalStyle: React.CSSProperties =
    orientation === "horizontal"
      ? {
          height: "10px",
          flexDirection: "column",
          borderTop: "1px solid transparent",
          padding: "1px",
        }
      : {}

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      style={{
        ...baseStyle,
        ...verticalStyle,
        ...horizontalStyle,
        ...(style || {}),
      }}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        style={{
          position: "relative",
          flex: 1,
          borderRadius: "9999px",
          backgroundColor: "#d9d9d9", // 替代 Tailwind 的 bg-border，可根据需要调整
        }}
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
})
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
