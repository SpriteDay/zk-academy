"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"
import { Fragment, type CSSProperties, type ReactNode } from "react"
import {
    Channel,
    Chip,
    chipWidth,
    Device,
    DEVICE_HEIGHT,
    DEVICE_WIDTH,
    LEFT_DEVICE_X,
    RIGHT_DEVICE_X,
    STAGE_WIDTH,
    type ScreenLine,
} from "./exchange-stage"

export const EXCHANGE_STEP_COUNT = 4

const STAGE_HEIGHT = 196
const DEVICE_Y = 24
const CHANNEL_Y = DEVICE_Y + 59
const CENTER_X = STAGE_WIDTH / 2
const CHANNEL_X1 = LEFT_DEVICE_X + DEVICE_WIDTH
const CHANNEL_X2 = RIGHT_DEVICE_X
const KEY_CHIP_Y = DEVICE_Y + DEVICE_HEIGHT + 26

/**
 * Step 2 send timeline (seconds): both mixes appear on their own
 * screens, A crosses the wire, lands, then B crosses back.
 */
const TRAVEL_DUR = 1.4
const TRAVEL_A_DELAY = 0.5
const TRAVEL_B_DELAY = 2.3
const RECV_A_DELAY = TRAVEL_A_DELAY + TRAVEL_DUR
const RECV_B_DELAY = TRAVEL_B_DELAY + TRAVEL_DUR
const GLOW_DUR = RECV_B_DELAY + 0.3

/**
 * One-shot CSS keyframes instead of SMIL: SMIL clocks run on document
 * time, so a remounted `begin="0.5s"` animation would already be over.
 * CSS animations restart whenever the keyed scene remounts.
 */
const SCENE_CSS = `
@keyframes dh-line-in {
    from { opacity: 0 }
    to { opacity: 1 }
}
@keyframes dh-pop {
    from { opacity: 0; transform: scale(0.85) }
    to { opacity: 1; transform: scale(1) }
}
@keyframes dh-travel {
    0% { opacity: 0; transform: translateX(var(--dh-from)) }
    8% { opacity: 1 }
    100% { opacity: 1; transform: translateX(0) }
}
@keyframes dh-pulse {
    0% { opacity: 0; transform: scale(1) }
    12% { opacity: 0.7 }
    100% { opacity: 0; transform: scale(1.12) }
}
@keyframes dh-glow {
    0%, 10% { opacity: 0 }
    14%, 45% { opacity: 0.5 }
    49%, 55% { opacity: 0 }
    59%, 90% { opacity: 0.5 }
    94%, 100% { opacity: 0 }
}
`

const lineIn = (delay: number): CSSProperties => ({
    animation: `dh-line-in 0.45s ease ${delay}s both`,
})

const popIn = (delay: number): CSSProperties => ({
    animation: `dh-pop 0.45s ease ${delay}s both`,
    transformBox: "fill-box",
    transformOrigin: "center",
})

const travel = (fromOffset: number, delay: number): CSSProperties =>
    ({
        "--dh-from": `${fromOffset}px`,
        animation: `dh-travel ${TRAVEL_DUR}s ease-in-out ${delay}s both`,
    }) as CSSProperties

function OncePulse({
    delay,
    x,
    className,
}: {
    delay: number
    x: number
    className: string
}) {
    return (
        <rect
            x={x}
            y={DEVICE_Y}
            width={DEVICE_WIDTH}
            height={DEVICE_HEIGHT}
            rx={16}
            fill="none"
            strokeWidth={1.5}
            className={className}
            style={{
                animation: `dh-pulse 0.9s ease-out ${delay}s both`,
                transformBox: "fill-box",
                transformOrigin: "center",
            }}
        />
    )
}

interface StageStepperProps {
    labels: string[]
    step: number
    onStepChange: (step: number) => void
}

export function StageStepper({
    labels,
    step,
    onStepChange,
}: StageStepperProps) {
    return (
        <div className="flex shrink-0 items-center justify-center md:flex-col">
            {labels.map((label, i) => (
                <Fragment key={label}>
                    {i > 0 && (
                        <div
                            className={cn(
                                "h-px w-5 md:h-5 md:w-px",
                                i <= step ? "bg-indigo-500/70" : "bg-border",
                            )}
                        />
                    )}
                    <button
                        type="button"
                        title={label}
                        aria-label={`Step ${i + 1}: ${label}`}
                        aria-current={i === step ? "step" : undefined}
                        onClick={() => onStepChange(i)}
                        className={cn(
                            "flex size-8 cursor-pointer items-center justify-center",
                            "rounded-full border text-xs font-semibold transition-colors",
                            i === step
                                ? "border-indigo-500 bg-indigo-500 text-white dark:border-indigo-400 dark:bg-indigo-400 dark:text-indigo-950"
                                : i < step
                                  ? "border-indigo-500/60 text-indigo-700 hover:bg-indigo-500/10 dark:border-indigo-400/60 dark:text-indigo-300"
                                  : "border-border text-muted-foreground hover:bg-muted",
                        )}
                    >
                        {i + 1}
                    </button>
                </Fragment>
            ))}
        </div>
    )
}

interface StagePanelProps {
    step: number
    title: string
    onStepChange: (step: number) => void
    onReplay: () => void
    children?: ReactNode
}

export function StagePanel({
    step,
    title,
    onStepChange,
    onReplay,
    children,
}: StagePanelProps) {
    return (
        <div className="flex w-full items-start gap-1">
            <Button
                variant="ghost"
                size="icon"
                aria-label="Previous step"
                disabled={step === 0}
                onClick={() => onStepChange(step - 1)}
            >
                <ChevronLeft />
            </Button>
            <div className="min-h-28 flex-1 space-y-1.5 pt-1 text-center">
                <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm font-semibold">{title}</span>
                    <button
                        type="button"
                        onClick={onReplay}
                        aria-label="Replay step animation"
                        className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    >
                        <RotateCcw className="size-3.5" />
                    </button>
                </div>
                <div className="text-muted-foreground mx-auto max-w-md text-sm">
                    {children}
                </div>
            </div>
            <Button
                variant="ghost"
                size="icon"
                aria-label="Next step"
                disabled={step === EXCHANGE_STEP_COUNT - 1}
                onClick={() => onStepChange(step + 1)}
            >
                <ChevronRight />
            </Button>
        </div>
    )
}

export interface ExchangeSceneProps {
    step: number
    /** Changing this remounts the scene and replays the step animation */
    playKey: string
    partyA: string
    partyB: string
    ariaLabel: string
    gChip: string
    pChip: string
    secretA: string
    secretB: string
    mixA: string
    mixB: string
    /** Labels for the chips traveling the wire (default: the mixes) */
    wireA?: string
    wireB?: string
    keyText: string
    keyChip: string
}

export function ExchangeScene({
    step,
    playKey,
    partyA,
    partyB,
    ariaLabel,
    gChip,
    pChip,
    secretA,
    secretB,
    mixA,
    mixB,
    wireA = mixA,
    wireB = mixB,
    keyText,
    keyChip,
}: ExchangeSceneProps) {
    const gW = chipWidth(gChip)
    const pW = chipWidth(pChip)
    const gX = CENTER_X - 5 - gW / 2
    const pX = CENTER_X + 5 + pW / 2

    const wireAText = `${wireA} →`
    const wireBText = `← ${wireB}`
    const wireAEnd = CHANNEL_X2 - chipWidth(wireAText) / 2 - 6
    const wireAStart = CHANNEL_X1 + chipWidth(wireAText) / 2 + 6
    const wireBEnd = CHANNEL_X1 + chipWidth(wireBText) / 2 + 6
    const wireBStart = CHANNEL_X2 - chipWidth(wireBText) / 2 - 6

    const leftLines: ScreenLine[] = []
    const rightLines: ScreenLine[] = []
    if (step >= 1) {
        leftLines.push({
            text: secretA,
            tone: "indigo",
            style: step === 1 ? lineIn(0.1) : undefined,
        })
        rightLines.push({
            text: secretB,
            tone: "amber",
            style: step === 1 ? lineIn(0.3) : undefined,
        })
    }
    if (step >= 2) {
        leftLines.push({
            text: mixA,
            style: step === 2 ? lineIn(0) : undefined,
        })
        rightLines.push({
            text: mixB,
            style: step === 2 ? lineIn(0) : undefined,
        })
        leftLines.push({
            text: mixB,
            style: step === 2 ? lineIn(RECV_B_DELAY) : undefined,
        })
        rightLines.push({
            text: mixA,
            style: step === 2 ? lineIn(RECV_A_DELAY) : undefined,
        })
    }
    if (step >= 3) {
        const keyStyle = step === 3 ? lineIn(0.25) : undefined
        leftLines.push({ text: keyText, tone: "emerald", style: keyStyle })
        rightLines.push({ text: keyText, tone: "emerald", style: keyStyle })
    }

    return (
        <>
            <style href="dh-staged-exchange" precedence="medium">
                {SCENE_CSS}
            </style>
            <svg
                viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                className="mx-auto block w-full max-w-xl min-w-0"
                role="img"
                aria-label={ariaLabel}
            >
                <g key={playKey}>
                    <Channel x1={CHANNEL_X1} x2={CHANNEL_X2} y={CHANNEL_Y} />
                    {step === 2 && (
                        <line
                            x1={CHANNEL_X1}
                            y1={CHANNEL_Y}
                            x2={CHANNEL_X2}
                            y2={CHANNEL_Y}
                            strokeWidth={9}
                            strokeLinecap="round"
                            className="stroke-rose-400/60 dark:stroke-rose-400/50"
                            style={{
                                animation: `dh-glow ${GLOW_DUR}s linear both`,
                            }}
                        />
                    )}
                    <text
                        x={CENTER_X}
                        y={CHANNEL_Y + 24}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                        className="fill-fd-muted-foreground"
                    >
                        public channel
                    </text>

                    <Chip
                        x={gX}
                        y={CHANNEL_Y - 33}
                        text={gChip}
                        tone="rose"
                        style={step === 0 ? popIn(0.1) : undefined}
                    />
                    <Chip
                        x={pX}
                        y={CHANNEL_Y - 33}
                        text={pChip}
                        tone="rose"
                        style={step === 0 ? popIn(0.3) : undefined}
                    />

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        lines={leftLines}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        lines={rightLines}
                    />

                    {step === 2 && (
                        <>
                            <OncePulse
                                delay={TRAVEL_A_DELAY}
                                x={LEFT_DEVICE_X}
                                className="stroke-rose-500 dark:stroke-rose-400"
                            />
                            <OncePulse
                                delay={TRAVEL_B_DELAY}
                                x={RIGHT_DEVICE_X}
                                className="stroke-rose-500 dark:stroke-rose-400"
                            />
                            <Chip
                                x={wireAEnd}
                                y={CHANNEL_Y}
                                text={wireAText}
                                tone="rose"
                                style={travel(
                                    wireAStart - wireAEnd,
                                    TRAVEL_A_DELAY,
                                )}
                            />
                            <Chip
                                x={wireBEnd}
                                y={CHANNEL_Y}
                                text={wireBText}
                                tone="rose"
                                style={travel(
                                    wireBStart - wireBEnd,
                                    TRAVEL_B_DELAY,
                                )}
                            />
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <OncePulse
                                delay={0.4}
                                x={LEFT_DEVICE_X}
                                className="stroke-emerald-500 dark:stroke-emerald-400"
                            />
                            <OncePulse
                                delay={0.4}
                                x={RIGHT_DEVICE_X}
                                className="stroke-emerald-500 dark:stroke-emerald-400"
                            />
                            <Chip
                                x={CENTER_X}
                                y={KEY_CHIP_Y}
                                text={keyChip}
                                tone="emerald"
                                ring="emerald"
                                style={popIn(0.5)}
                            />
                        </>
                    )}
                </g>
            </svg>
        </>
    )
}
