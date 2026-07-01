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

const MODULO = 7
const DEFAULT_BASE = 3
const DEFAULT_EXPONENT = 2
const MIN_BASE = 2
const MAX_BASE = 5
const MIN_EXPONENT = 1
const MAX_EXPONENT = 4

export function ExponentiationRemainder() {
    const [base, setBase] = useState(DEFAULT_BASE)
    const [exponent, setExponent] = useState(DEFAULT_EXPONENT)

    const total = useMemo(() => base ** exponent, [base, exponent])
    const remainder = total % MODULO
    const fullGroups = Math.floor(total / MODULO)

    return (
        <Card>
            <CardHeader>
                <CardTitle>How remainder is produced</CardTitle>
                <CardDescription>
                    See how {base}
                    <sup>{exponent}</sup> breaks into groups of {MODULO}
                </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
                <div className="flex flex-wrap gap-1.5">
                    {Array.from({ length: fullGroups }, (_, groupIdx) => (
                        <div key={groupIdx} className="flex gap-[0.5px]">
                            {Array.from({ length: MODULO }, (_, i) => (
                                <div
                                    key={i}
                                    className="h-5 w-[3px] rounded-[1px] bg-fd-muted-foreground opacity-25"
                                />
                            ))}
                        </div>
                    ))}
                    {remainder > 0 && (
                        <div className="flex gap-[0.5px]">
                            {Array.from({ length: remainder }, (_, i) => (
                                <div
                                    key={i}
                                    className="h-5 w-[3px] rounded-[1px] bg-emerald-500"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2 md:flex-row">
                    <div className="flex w-full flex-col items-center gap-4 md:w-2/3">
                        <Label>
                            Base (a):{" "}
                            <span className="font-bold tabular-nums">
                                {base}
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_BASE]}
                            onValueChange={(value) => setBase(value as number)}
                            min={MIN_BASE}
                            max={MAX_BASE}
                            step={1}
                            className="mx-auto w-full"
                        />
                        <Label>
                            Power (b):{" "}
                            <span className="font-bold tabular-nums">
                                {exponent}
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_EXPONENT]}
                            onValueChange={(value) =>
                                setExponent(value as number)
                            }
                            min={MIN_EXPONENT}
                            max={MAX_EXPONENT}
                            step={1}
                            className="mx-auto w-full"
                        />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            {base}
                            <sup>{exponent}</sup> mod {MODULO}
                        </span>
                        <span className="text-2xl font-bold tabular-nums">
                            {remainder}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {total} = {fullGroups} × {MODULO} + {remainder}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
