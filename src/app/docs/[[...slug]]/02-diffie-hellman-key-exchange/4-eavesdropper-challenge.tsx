"use client"

import { WideSlider } from "@/components/custom/wide-slider"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RotateCcw } from "lucide-react"
import { useState } from "react"
import {
    Channel,
    ChannelGlow,
    Chip,
    Device,
    DEVICE_WIDTH,
    HTML_TEXT_TONE,
    LEFT_DEVICE_X,
    RIGHT_DEVICE_X,
    STAGE_WIDTH,
    Tap,
} from "./shared/exchange-stage"
import { modPow } from "./shared/mod-math"

const STAGE_HEIGHT = 250
const DEVICE_Y = 36
const CHANNEL_Y = DEVICE_Y + 59
const TAP_X = STAGE_WIDTH / 2
const EYE_Y = 222

const G = 5
const P = 23
const INITIAL_SECRET_A = 18
const INITIAL_SECRET_B = 9

function randomSecret() {
    return 2 + Math.floor(Math.random() * (P - 3))
}

interface EavesdropperChallengeProps {
    partyA?: string
    partyB?: string
}

export function EavesdropperChallenge({
    partyA = "Judy",
    partyB = "Nick",
}: EavesdropperChallengeProps) {
    const [secretA, setSecretA] = useState(INITIAL_SECRET_A)
    const [secretB, setSecretB] = useState(INITIAL_SECRET_B)
    const [guess, setGuess] = useState(1)
    const [triedGuesses, setTriedGuesses] = useState<Set<number>>(
        () => new Set(),
    )

    const publicA = Number(modPow(BigInt(G), BigInt(secretA), BigInt(P)))
    const publicB = Number(modPow(BigInt(G), BigInt(secretB), BigInt(P)))
    const guessValue = Number(modPow(BigInt(G), BigInt(guess), BigInt(P)))
    const cracked = guessValue === publicA
    const crackedKey = Number(modPow(BigInt(publicB), BigInt(guess), BigInt(P)))

    const handleGuessChange = (newGuess: number) => {
        setGuess(newGuess)
        setTriedGuesses((prev) => {
            if (prev.has(newGuess)) return prev
            return new Set([...prev, newGuess])
        })
    }

    const handleNewIntercept = () => {
        setSecretA(randomSecret())
        setSecretB(randomSecret())
        setTriedGuesses(new Set())
    }

    return (
        <Card className="border-rose-500/30">
            <CardHeader>
                <CardTitle>You are the eavesdropper now</CardTitle>
                <CardDescription>
                    You captured everything on the wire — recover the secret
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <svg
                    viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                    className="mx-auto block w-full max-w-xl"
                    role="img"
                    aria-label={`Eavesdropper view of a Diffie-Hellman exchange between ${partyA} and ${partyB}: only public values are visible`}
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
                    <Tap x={TAP_X} channelY={CHANNEL_Y} eyeY={EYE_Y} />

                    <Chip
                        x={TAP_X - 37}
                        y={CHANNEL_Y - 33}
                        text={`g = ${G}`}
                        tone="rose"
                    />
                    <Chip
                        x={TAP_X + 37}
                        y={CHANNEL_Y - 33}
                        text={`p = ${P}`}
                        tone="rose"
                    />

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        hiddenRows={4}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        hiddenRows={4}
                    />

                    <Chip
                        key={`a-${publicA}-${secretA}`}
                        x={TAP_X - 48}
                        y={CHANNEL_Y}
                        text={`A = ${publicA} →`}
                        tone="rose"
                        className="animate-in fade-in slide-in-from-left-8 duration-500"
                    />
                    <Chip
                        key={`b-${publicB}-${secretB}`}
                        x={TAP_X + 48}
                        y={CHANNEL_Y}
                        text={`← B = ${publicB}`}
                        tone="rose"
                        className="animate-in fade-in slide-in-from-right-8 duration-500"
                    />

                    <Chip
                        x={TAP_X + 44}
                        y={EYE_Y}
                        text={
                            cracked
                                ? `a = ${guess}, K = ${crackedKey}`
                                : `a = ?`
                        }
                        tone={cracked ? "emerald" : "rose"}
                    />
                </svg>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4 text-sm">
                <div className="flex w-full flex-col gap-4 py-2 md:flex-row">
                    <div className="flex w-full flex-col items-center gap-4 md:w-2/3">
                        <Label>
                            <span>
                                Your guess of {partyA}&apos;s secret (
                                <span className={HTML_TEXT_TONE.rose}>x</span>
                                ):{" "}
                                <span
                                    className={`font-bold tabular-nums ${HTML_TEXT_TONE.rose}`}
                                >
                                    {guess}
                                </span>
                            </span>
                        </Label>
                        <WideSlider
                            defaultValue={[1]}
                            onValueChange={(value) =>
                                handleGuessChange(value as number)
                            }
                            min={1}
                            max={P - 1}
                            step={1}
                            className="mx-auto w-full"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNewIntercept}
                        >
                            <RotateCcw data-icon="inline-start" />
                            New intercept
                        </Button>
                    </div>
                    <div className="flex w-full flex-col items-center justify-center gap-1 text-center md:w-1/3">
                        <span className="text-muted-foreground text-xs">
                            {G}
                            <sup>{guess}</sup> mod {P} — need A = {publicA}
                        </span>
                        <span
                            className={`text-3xl font-bold tabular-nums ${
                                cracked
                                    ? HTML_TEXT_TONE.emerald
                                    : HTML_TEXT_TONE.rose
                            }`}
                        >
                            {guessValue}
                        </span>
                        <span className="text-muted-foreground text-xs">
                            {cracked
                                ? `cracked in ${triedGuesses.size} ${
                                      triedGuesses.size === 1
                                          ? "guess"
                                          : "guesses"
                                  }`
                                : `guesses so far: ${triedGuesses.size}`}
                        </span>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
