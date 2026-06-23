import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { HourClock } from "./01-what-remainder-remembers/1-hour-clock"

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        HourClock,
        ...components,
    } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
