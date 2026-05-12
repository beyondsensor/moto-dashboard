import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"
import { Label } from "./label"

const Field = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { "data-invalid"?: boolean }
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="field"
    className={cn("group flex flex-col gap-2", className)}
    {...props}
  />
))
Field.displayName = "Field"

const FieldLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    data-slot="field-label"
    className={cn("group-data-[invalid=true]:text-destructive", className)}
    {...props}
  />
))
FieldLabel.displayName = "FieldLabel"

const FieldDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-slot="field-description"
    className={cn("text-muted-foreground text-xs", className)}
    {...props}
  />
))
FieldDescription.displayName = "FieldDescription"

const FieldError = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & { errors?: any[] }
>(({ className, errors, ...props }, ref) => {
  if (!errors || errors.length === 0) return null
  
  return (
    <p
      ref={ref}
      data-slot="field-error"
      className={cn("text-destructive text-xs font-medium", className)}
      {...props}
    >
      {errors[0]?.message}
    </p>
  )
})
FieldError.displayName = "FieldError"

export { Field, FieldLabel, FieldDescription, FieldError }
