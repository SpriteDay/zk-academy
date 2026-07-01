import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { HourClock } from "./01-what-remainder-remembers/1-hour-clock"
import { MultipleHoursPerStepClock } from "./01-what-remainder-remembers/2-multiple-hours-per-step-clock"
import { PrimeStepClock } from "./01-what-remainder-remembers/3-prime-step-clock"
import { ExponentiationRemainder } from "./02-diffie-hellman-key-exchange/1-exponentiation-remainder"
import { KeyExchangeMeetup } from "./02-diffie-hellman-key-exchange/2-key-exchange-meetup"
import { DiffieHellmanExchange } from "./02-diffie-hellman-key-exchange/3-diffie-hellman-exchange"
import { EavesdropperChallenge } from "./02-diffie-hellman-key-exchange/4-eavesdropper-challenge"
import { RealisticDiffieHellman } from "./02-diffie-hellman-key-exchange/5-realistic-diffie-hellman"

export function getMDXComponents(components?: MDXComponents) {
    return {
        ...defaultMdxComponents,
        HourClock,
        MultipleHoursPerStepClock,
        PrimeStepClock,
        ExponentiationRemainder,
        KeyExchangeMeetup,
        DiffieHellmanExchange,
        EavesdropperChallenge,
        RealisticDiffieHellman,
        ...components,
    } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
    type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
