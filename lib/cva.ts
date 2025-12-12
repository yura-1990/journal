// Simple replacement for class-variance-authority
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ConfigSchema = Record<string, Record<string, ClassValue>>
type ConfigVariants<T extends ConfigSchema> = {
  [Variant in keyof T]?: keyof T[Variant]
}

export type VariantProps<T extends (...args: any[]) => any> = Omit<Parameters<T>[0], "class" | "className">

export function cva<T extends ConfigSchema>(
  base: ClassValue,
  config?: {
    variants?: T
    defaultVariants?: ConfigVariants<T>
  },
) {
  return (props?: ConfigVariants<T> & { class?: ClassValue; className?: ClassValue }) => {
    if (!config?.variants) {
      return cn(base, props?.class, props?.className)
    }

    const { variants, defaultVariants } = config
    const variantClasses: ClassValue[] = [base]

    Object.keys(variants).forEach((variantKey) => {
      const variantValue =
        props?.[variantKey as keyof typeof props] ?? defaultVariants?.[variantKey as keyof typeof defaultVariants]
      if (variantValue) {
        variantClasses.push(variants[variantKey][variantValue as string])
      }
    })

    return cn(...variantClasses, props?.class, props?.className)
  }
}
