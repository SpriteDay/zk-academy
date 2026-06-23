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
import { useMemo, useState } from "react"
import { ModuloClock } from "./shared/modulo-clock"

const MIN_VALUE = 0
const MAX_VALUE = 72
const STEP = 1
const DEFAULT_VALUE = 12
const CLOCK_BASE = 12

export function HourClock() {
    const [inputValue, setInputValue] = useState(DEFAULT_VALUE)

    const resultValue = useMemo<number>(() => {
        return inputValue % CLOCK_BASE
    }, [inputValue])

    return (
        <Card>
            <CardHeader>
                <CardTitle>12-hour clock — modulo in action</CardTitle>
                <CardDescription>
                    Drag the slider to add hours and watch where the hand lands
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-2">
                <ModuloClock
                    base={CLOCK_BASE}
                    value={inputValue}
                    zeroLabel="12"
                />
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2 md:flex-row">
                    <div className="flex w-full flex-col items-center gap-4 md:w-2/3">
                        <Label>
                            Hours passed:{" "}
                            <span className="font-bold tabular-nums">
                                {inputValue}
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_VALUE]}
                            onValueChange={(value) => {
                                setInputValue(value as number)
                            }}
                            min={MIN_VALUE}
                            max={MAX_VALUE}
                            step={STEP}
                            className="mx-auto w-full"
                        />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            {inputValue} mod {CLOCK_BASE}
                        </span>
                        <span className="text-2xl font-bold tabular-nums">
                            {resultValue === 0 ? CLOCK_BASE : resultValue}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            on the clock
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
