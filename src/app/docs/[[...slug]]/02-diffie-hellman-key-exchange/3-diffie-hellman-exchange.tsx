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
import { useState } from "react"
import {
    Channel,
    ChannelGlow,
    Chip,
    Device,
    DEVICE_HEIGHT,
    DEVICE_WIDTH,
    HTML_TEXT_TONE,
    LEFT_DEVICE_X,
    PulseRing,
    RIGHT_DEVICE_X,
    STAGE_WIDTH,
} from "./shared/exchange-stage"
import { modPow } from "./shared/mod-math"

const STAGE_HEIGHT = 170
const DEVICE_Y = 36
const CHANNEL_Y = DEVICE_Y + 59
const CENTER_X = STAGE_WIDTH / 2

const DEFAULT_G = 5
const DEFAULT_P = 23
const DEFAULT_A = 6
const DEFAULT_B = 15

interface DiffieHellmanExchangeProps {
    partyA?: string
    partyB?: string
}

export function DiffieHellmanExchange({
    partyA = "Bonnie",
    partyB = "Clyde",
}: DiffieHellmanExchangeProps) {
    const [g, setG] = useState(DEFAULT_G)
    const [p, setP] = useState(DEFAULT_P)
    const [a, setA] = useState(DEFAULT_A)
    const [b, setB] = useState(DEFAULT_B)

    const publicA = Number(modPow(BigInt(g), BigInt(a), BigInt(p)))
    const publicB = Number(modPow(BigInt(g), BigInt(b), BigInt(p)))
    const keyA = Number(modPow(BigInt(publicB), BigInt(a), BigInt(p)))
    const keyB = Number(modPow(BigInt(publicA), BigInt(b), BigInt(p)))

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mixing secrets in the open</CardTitle>
                <CardDescription>
                    No side channel anymore — everything travels in public
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <svg
                    viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                    className="mx-auto block w-full max-w-xl"
                    role="img"
                    aria-label={`Diffie-Hellman exchange: ${partyA} and ${partyB} derive the same shared key over a public channel`}
                >
                    <Channel
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <ChannelGlow
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <PulseRing
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        width={DEVICE_WIDTH}
                        height={DEVICE_HEIGHT}
                        begin="0s"
                        dur="3.2s"
                        activeFraction={0.35}
                        repeatCount="indefinite"
                    />
                    <PulseRing
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        width={DEVICE_WIDTH}
                        height={DEVICE_HEIGHT}
                        begin="1.6s"
                        dur="3.2s"
                        activeFraction={0.35}
                        repeatCount="indefinite"
                    />

                    <Chip
                        x={CENTER_X - 37}
                        y={CHANNEL_Y - 33}
                        text={`g = ${g}`}
                        tone="rose"
                    />
                    <Chip
                        x={CENTER_X + 37}
                        y={CHANNEL_Y - 33}
                        text={`p = ${p}`}
                        tone="rose"
                    />

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        lines={[
                            { text: `secret a = ${a}`, tone: "indigo" },
                            { text: `sends A = ${publicA}` },
                            { text: `gets B = ${publicB}` },
                            { text: `key K = ${keyA}`, tone: "emerald" },
                        ]}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        lines={[
                            { text: `secret b = ${b}`, tone: "amber" },
                            { text: `sends B = ${publicB}` },
                            { text: `gets A = ${publicA}` },
                            { text: `key K = ${keyB}`, tone: "emerald" },
                        ]}
                    />

                    <Chip
                        key={`a-${publicA}-${p}`}
                        x={CENTER_X - 48}
                        y={CHANNEL_Y}
                        text={`A = ${publicA} →`}
                        tone="rose"
                        className="animate-in fade-in slide-in-from-left-8 duration-500"
                    />
                    <Chip
                        key={`b-${publicB}-${p}`}
                        x={CENTER_X + 48}
                        y={CHANNEL_Y}
                        text={`← B = ${publicB}`}
                        tone="rose"
                        className="animate-in fade-in slide-in-from-right-8 duration-500"
                    />
                </svg>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2">
                    <div className="flex w-full flex-col gap-4 md:flex-row">
                        <div className="flex w-full flex-col items-center gap-4 md:w-1/2">
                            <Label>
                                <span>
                                    Public generator (
                                    <span className={HTML_TEXT_TONE.rose}>
                                        g
                                    </span>
                                    ):{" "}
                                    <span
                                        className={`font-bold tabular-nums ${HTML_TEXT_TONE.rose}`}
                                    >
                                        {g}
                                    </span>
                                </span>
                            </Label>
                            <WideSlider
                                defaultValue={[DEFAULT_G]}
                                onValueChange={(value) => setG(value as number)}
                                min={2}
                                max={12}
                                step={1}
                                className="mx-auto w-full"
                            />
                        </div>
                        <div className="flex w-full flex-col items-center gap-4 md:w-1/2">
                            <Label>
                                <span>
                                    Public modulus (
                                    <span className={HTML_TEXT_TONE.rose}>
                                        p
                                    </span>
                                    ):{" "}
                                    <span
                                        className={`font-bold tabular-nums ${HTML_TEXT_TONE.rose}`}
                                    >
                                        {p}
                                    </span>
                                </span>
                            </Label>
                            <WideSlider
                                defaultValue={[DEFAULT_P]}
                                onValueChange={(value) => setP(value as number)}
                                min={2}
                                max={30}
                                step={1}
                                className="mx-auto w-full"
                            />
                        </div>
                    </div>
                    <div className="flex w-full flex-col gap-4 md:flex-row">
                        <div className="flex w-full flex-col items-center gap-4 md:w-1/2">
                            <Label>
                                <span>
                                    {partyA}&apos;s secret (
                                    <span className={HTML_TEXT_TONE.indigo}>
                                        a
                                    </span>
                                    ):{" "}
                                    <span
                                        className={`font-bold tabular-nums ${HTML_TEXT_TONE.indigo}`}
                                    >
                                        {a}
                                    </span>
                                </span>
                            </Label>
                            <WideSlider
                                defaultValue={[DEFAULT_A]}
                                onValueChange={(value) => setA(value as number)}
                                min={1}
                                max={24}
                                step={1}
                                className="mx-auto w-full"
                            />
                        </div>
                        <div className="flex w-full flex-col items-center gap-4 md:w-1/2">
                            <Label>
                                <span>
                                    {partyB}&apos;s secret (
                                    <span className={HTML_TEXT_TONE.amber}>
                                        b
                                    </span>
                                    ):{" "}
                                    <span
                                        className={`font-bold tabular-nums ${HTML_TEXT_TONE.amber}`}
                                    >
                                        {b}
                                    </span>
                                </span>
                            </Label>
                            <WideSlider
                                defaultValue={[DEFAULT_B]}
                                onValueChange={(value) => setB(value as number)}
                                min={1}
                                max={24}
                                step={1}
                                className="mx-auto w-full"
                            />
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
