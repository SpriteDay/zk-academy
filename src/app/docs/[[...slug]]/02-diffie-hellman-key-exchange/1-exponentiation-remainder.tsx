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

const DEFAULT_G = 3
const DEFAULT_X = 2
const DEFAULT_P = 7
const MIN_G = 2
const MAX_G = 12
const MIN_X = 1
const MAX_X = 8
const MIN_P = 2
const MAX_P = 17
const MAX_DISPLAY = 500

export function ExponentiationRemainder() {
    const [g, setG] = useState(DEFAULT_G)
    const [x, setX] = useState(DEFAULT_X)
    const [p, setP] = useState(DEFAULT_P)

    const total = useMemo(() => g ** x, [g, x])
    const remainder = total % p
    const fullGroups = Math.floor(total / p)

    const maxRenderedGroups = Math.floor(MAX_DISPLAY / p)
    const renderedGroups = Math.min(fullGroups, maxRenderedGroups)
    const skippedGroups = fullGroups - renderedGroups - 1
    const isTruncated = skippedGroups > 0

    return (
        <Card>
            <CardHeader>
                <CardTitle>How remainder is produced</CardTitle>
                <CardDescription>
                    See how {g}
                    <sup>{x}</sup> breaks into groups of {p}
                </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
                <div className="flex min-h-[98px] flex-wrap content-start items-center gap-1.5">
                    {Array.from({ length: renderedGroups }, (_, groupIdx) => (
                        <div key={groupIdx} className="flex gap-px">
                            {Array.from({ length: p }, (_, i) => (
                                <div
                                    key={i}
                                    className="bg-fd-muted-foreground h-5 w-[3px] rounded-[1px] opacity-25"
                                />
                            ))}
                        </div>
                    ))}
                    {isTruncated && (
                        <span className="text-muted-foreground text-xs">
                            …{skippedGroups} more…
                        </span>
                    )}
                    {isTruncated && (
                        <div className="flex gap-px">
                            {Array.from({ length: p }, (_, i) => (
                                <div
                                    key={i}
                                    className="bg-fd-muted-foreground h-5 w-[3px] rounded-[1px] opacity-25"
                                />
                            ))}
                        </div>
                    )}
                    {remainder > 0 && (
                        <div className="flex gap-px">
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
                            Generator (g):{" "}
                            <span className="font-bold tabular-nums">{g}</span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_G]}
                            onValueChange={(value) => setG(value as number)}
                            min={MIN_G}
                            max={MAX_G}
                            step={1}
                            className="mx-auto w-full"
                        />
                        <Label>
                            Exponent (x):{" "}
                            <span className="font-bold tabular-nums">{x}</span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_X]}
                            onValueChange={(value) => setX(value as number)}
                            min={MIN_X}
                            max={MAX_X}
                            step={1}
                            className="mx-auto w-full"
                        />
                        <Label>
                            Modulus (p):{" "}
                            <span className="font-bold tabular-nums">{p}</span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_P]}
                            onValueChange={(value) => setP(value as number)}
                            min={MIN_P}
                            max={MAX_P}
                            step={1}
                            className="mx-auto w-full"
                        />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            {g}
                            <sup>{x}</sup> mod {p}
                        </span>
                        <span className="text-2xl font-bold tabular-nums">
                            {remainder}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
