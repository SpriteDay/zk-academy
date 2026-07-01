import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { HourClock } from "./01-what-remainder-remembers/1-hour-clock"
import { MultipleHoursPerStepClock } from "./01-what-remainder-remembers/2-multiple-hours-per-step-clock"
import { PrimeStepClock } from "./01-what-remainder-remembers/3-prime-step-clock"
import { ExponentiationRemainder } from "./02-diffie-hellman-key-exchange/1-exponentiation-remainder"

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        HourClock,
        MultipleHoursPerStepClock,
        PrimeStepClock,
        ExponentiationRemainder,
        ...components,
    } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
