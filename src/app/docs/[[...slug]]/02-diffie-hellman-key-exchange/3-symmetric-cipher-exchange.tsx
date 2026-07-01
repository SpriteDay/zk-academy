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
    Chip,
    chipWidth,
    Device,
    DEVICE_WIDTH,
    HTML_TEXT_TONE,
    LEFT_DEVICE_X,
    RIGHT_DEVICE_X,
    SideArc,
    STAGE_WIDTH,
    Tap,
} from "./shared/exchange-stage"

const STAGE_HEIGHT = 258
const DEVICE_Y = 84
const CHANNEL_Y = DEVICE_Y + 59
const TAP_X = STAGE_WIDTH / 2
const EYE_Y = 232
const ARC_LIFT = 58

const DEFAULT_MESSAGE = "MEET IN ALLEY"
const MAX_MESSAGE_LENGTH = 14
const DEFAULT_SHIFT = 3

function caesarShift(text: string, shift: number): string {
    return text.replace(/[a-z]/gi, (char) => {
        const base = char >= "a" ? 97 : 65
        const code = char.charCodeAt(0) - base
        return String.fromCharCode(base + ((code + shift) % 26))
    })
}

interface SymmetricCipherExchangeProps {
    partyA?: string
    partyB?: string
}

export function SymmetricCipherExchange({
    partyA = "Jeffrey",
    partyB = "Bill",
}: SymmetricCipherExchangeProps) {
    const [message, setMessage] = useState(DEFAULT_MESSAGE)
    const [shift, setShift] = useState(DEFAULT_SHIFT)

    const cipher = caesarShift(message, shift)
    const decrypted = caesarShift(cipher, 26 - shift)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Talking through the encryption</CardTitle>
                <CardDescription>
                    The key was shared in private, the message goes in public
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <svg
                    viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                    className="mx-auto block w-full max-w-xl"
                    role="img"
                    aria-label={`${partyA} encrypts a message with a shared key and sends it to ${partyB} over a public channel`}
                >
                    <SideArc
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH / 2}
                        y1={DEVICE_Y - 4}
                        x2={RIGHT_DEVICE_X + DEVICE_WIDTH / 2}
                        y2={DEVICE_Y - 4}
                        lift={ARC_LIFT}
                    />
                    <Chip
                        x={STAGE_WIDTH / 2}
                        y={DEVICE_Y - 4 - ARC_LIFT * 0.72}
                        text={`key = ${shift}`}
                        tone="emerald"
                    />
                    <Channel
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <Tap x={TAP_X} channelY={CHANNEL_Y} eyeY={EYE_Y} />

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        lines={[
                            { text: "message:" },
                            { text: message, tone: "indigo" },
                            { text: "encrypts:" },
                            { text: cipher },
                        ]}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        lines={[
                            { text: "received:" },
                            { text: cipher },
                            { text: "decrypts:" },
                            { text: decrypted, tone: "emerald" },
                        ]}
                    />

                    <Chip
                        key={`wire-${cipher}`}
                        x={TAP_X}
                        y={CHANNEL_Y}
                        text={cipher}
                        className="animate-in fade-in slide-in-from-left-8 duration-500"
                    />
                    <Chip
                        key={`tap-${cipher}`}
                        x={TAP_X + 24 + chipWidth(cipher) / 2}
                        y={EYE_Y}
                        text={cipher}
                        tone="rose"
                        className="animate-in fade-in duration-700"
                    />
                </svg>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2 md:flex-row">
                    <div className="flex w-full flex-col items-center gap-4 md:w-2/3">
                        <Label htmlFor="symmetric-cipher-message">
                            Message
                        </Label>
                        <input
                            id="symmetric-cipher-message"
                            value={message}
                            maxLength={MAX_MESSAGE_LENGTH}
                            onChange={(event) =>
                                setMessage(event.target.value.toUpperCase())
                            }
                            className="border-border bg-fd-background w-full max-w-xs rounded-md border px-3 py-1.5 text-center font-mono text-sm outline-none focus-visible:ring-2"
                        />
                        <Label>
                            <span>
                                Shared key (shift):{" "}
                                <span
                                    className={`font-bold tabular-nums ${HTML_TEXT_TONE.emerald}`}
                                >
                                    {shift}
                                </span>
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[DEFAULT_SHIFT]}
                            onValueChange={(value) => setShift(value as number)}
                            min={1}
                            max={25}
                            step={1}
                            className="mx-auto w-full"
                        />
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            on the wire
                        </span>
                        <span
                            className={`font-mono text-lg font-bold break-all ${HTML_TEXT_TONE.rose}`}
                        >
                            {cipher || "…"}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
