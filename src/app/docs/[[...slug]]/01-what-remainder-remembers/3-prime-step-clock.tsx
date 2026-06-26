"use client"

import { StepClock } from "./shared/step-clock"

export function PrimeStepClock() {
    return (
        <StepClock
            base={17}
            title="Circle with a prime number of ticks"
            description="Try any value per step — you can never make it skip"
            valuePerStepLabel="Value per step"
            defaultValuePerStep={3}
            maxValuePerStep={16}
        />
    )
}
