"use client"

import { StepClock } from "./shared/step-clock"

export function MultipleHoursPerStepClock() {
    return (
        <StepClock
            base={12}
            title="Clock with adjustable hours per step"
            description="Change hours per step to see how the clock behaves"
            valuePerStepLabel="Hours per step"
            defaultValuePerStep={3}
            maxValuePerStep={20}
        />
    )
}
