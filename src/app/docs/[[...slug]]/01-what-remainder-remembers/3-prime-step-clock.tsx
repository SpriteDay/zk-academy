"use client"

import { StepClock } from "./shared/step-clock"

export function PrimeStepClock() {
    return (
        <StepClock
            base={17}
            title="Circle with a prime number of ticks"
            description="Try any step size — you can never make it skip"
            valuePerStepLabel="Step size"
            defaultValuePerStep={3}
            maxValuePerStep={16}
        />
    )
}
