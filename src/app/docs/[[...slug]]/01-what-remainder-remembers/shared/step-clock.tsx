"use client"

import { WideSlider } from "@/components/custom/wide-slider"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useCallback, useMemo, useState } from "react"
import { ModuloClock } from "./modulo-clock"

interface StepClockProps {
    base: number
    title: string
    description: string
    valuePerStepLabel: string
    defaultSteps?: number
    maxSteps?: number
    defaultValuePerStep: number
    maxValuePerStep: number
    zeroLabel?: string
}

export function StepClock({
    base,
    title,
    description,
    valuePerStepLabel,
    defaultSteps = 0,
    maxSteps = 48,
    defaultValuePerStep,
    maxValuePerStep,
    zeroLabel,
}: StepClockProps) {
    const [inputValue, setInputValue] = useState(defaultSteps)
    const [valuePerStep, setValuePerStep] = useState(defaultValuePerStep)
    const [seenValues, setSeenValues] = useState<Set<number>>(() => new Set())

    const multipliedValue = useMemo(
        () => inputValue * valuePerStep,
        [inputValue, valuePerStep],
    )

    const resultValue = useMemo<number>(() => {
        return multipliedValue % base
    }, [multipliedValue, base])

    const highlightedValues = useMemo(
        () => Array.from(seenValues),
        [seenValues],
    )

    const handleValuePerStepChange = useCallback((newValuePerStep: number) => {
        setValuePerStep(newValuePerStep)
        setSeenValues(new Set())
    }, [])

    const handleStepsChange = useCallback(
        (newSteps: number) => {
            setInputValue(newSteps)
            const result = (newSteps * valuePerStep) % base
            setSeenValues((prev) => {
                if (prev.has(result)) return prev
                return new Set([...prev, result])
            })
        },
        [valuePerStep, base],
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-2">
                <ModuloClock
                    base={base}
                    value={multipliedValue}
                    zeroLabel={zeroLabel}
                    highlightedValues={highlightedValues}
                />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2 md:flex-row">
                    <div className="flex w-full flex-col items-center gap-4 md:w-2/3">
                        <Label>
                            {valuePerStepLabel}:{" "}
                            <span className="font-bold tabular-nums">
                                {valuePerStep}
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[defaultValuePerStep]}
                            onValueChange={(value) => {
                                handleValuePerStepChange(value as number)
                            }}
                            min={1}
                            max={maxValuePerStep}
                            step={1}
                            className="mx-auto w-full"
                        />
                        <Label>
                            Steps:{" "}
                            <span className="font-bold tabular-nums">
                                {inputValue}
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[defaultSteps]}
                            onValueChange={(value) => {
                                handleStepsChange(value as number)
                            }}
                            min={0}
                            max={maxSteps}
                            step={1}
                            className="mx-auto w-full"
                        />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            {multipliedValue} mod {base}
                        </span>
                        <span className="text-2xl font-bold tabular-nums">
                            {resultValue}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            remainder
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
