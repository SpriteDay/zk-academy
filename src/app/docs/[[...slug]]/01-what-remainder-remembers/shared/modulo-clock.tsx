"use client"

import { useId, useMemo } from "react"

export interface ModuloClockProps {
    base: number
    value: number
    tickCount?: number
    labelEvery?: number
    zeroLabel?: string
}

const VIEWBOX_SIZE = 200
const CENTER_X = VIEWBOX_SIZE / 2
const CENTER_Y = VIEWBOX_SIZE / 2
const BEZEL_RADIUS = 93
const FACE_RADIUS = 88
const TICK_OUTER_RADIUS = 84
const TICK_MINOR_INNER_RADIUS = 79.5
const TICK_MAJOR_INNER_RADIUS = 75.5
const LABEL_RADIUS = 65
const HAND_LENGTH = 57
const HAND_TAIL_LENGTH = 14

function round(n: number) {
    return Math.round(n * 100) / 100
}

function polar(deg: number, r: number) {
    const rad = ((deg - 90) * Math.PI) / 180
    return {
        x: round(CENTER_X + r * Math.cos(rad)),
        y: round(CENTER_Y + r * Math.sin(rad)),
    }
}

export function ModuloClock({
    base,
    value,
    tickCount: tickCountProp,
    labelEvery: labelEveryProp,
    zeroLabel,
}: ModuloClockProps) {
    const rawId = useId()
    const id = rawId.replace(/:/g, "")

    const tickCount = tickCountProp ?? Math.min(base, 120)
    const labelEvery = labelEveryProp ?? Math.max(1, Math.floor(tickCount / 12))
    const handAngle = (value / base) * 360

    const ticks = useMemo(() => {
        return Array.from({ length: tickCount }, (_, i) => {
            const angle = (i / tickCount) * 360
            const isLabeled = i % labelEvery === 0
            const tickValue = Math.round((i / tickCount) * base)
            const label = isLabeled
                ? tickValue === 0 && zeroLabel
                    ? zeroLabel
                    : String(tickValue)
                : null
            return { angle, label, isLabeled }
        })
    }, [tickCount, base, labelEvery, zeroLabel])

    const labelFontSize = useMemo(() => {
        let maxLen = 1
        for (const t of ticks) {
            if (t.label && t.label.length > maxLen) maxLen = t.label.length
        }
        if (maxLen <= 2) return 10
        if (maxLen <= 3) return 8.5
        if (maxLen <= 4) return 7.5
        return 6
    }, [ticks])

    const handRad = ((handAngle - 90) * Math.PI) / 180
    const handTip = {
        x: round(CENTER_X + HAND_LENGTH * Math.cos(handRad)),
        y: round(CENTER_Y + HAND_LENGTH * Math.sin(handRad)),
    }
    const handTail = {
        x: round(CENTER_X - HAND_TAIL_LENGTH * Math.cos(handRad)),
        y: round(CENTER_Y - HAND_TAIL_LENGTH * Math.sin(handRad)),
    }

    const depthId = `depth-${id}`

    return (
        <svg
            viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
            className="mx-auto block w-full max-w-xs"
            role="img"
            aria-label={`Modulo ${base} clock showing ${value} mod ${base} = ${value % base}`}
        >
            <defs>
                <radialGradient id={depthId} cx="38%" cy="32%" r="72%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.06" />
                    <stop offset="100%" stopColor="black" stopOpacity="0.08" />
                </radialGradient>
            </defs>

            {/* Bezel */}
            <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={BEZEL_RADIUS}
                fill="var(--color-fd-border)"
            />

            {/* Face */}
            <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={FACE_RADIUS}
                fill="var(--color-fd-card)"
            />
            <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r={FACE_RADIUS}
                fill={`url(#${depthId})`}
            />

            {/* Tick lines */}
            {ticks.map(({ angle, isLabeled }, i) => {
                const p1 = polar(angle, TICK_OUTER_RADIUS)
                const p2 = polar(
                    angle,
                    isLabeled
                        ? TICK_MAJOR_INNER_RADIUS
                        : TICK_MINOR_INNER_RADIUS,
                )
                return (
                    <line
                        key={`t${i}`}
                        x1={p1.x}
                        y1={p1.y}
                        x2={p2.x}
                        y2={p2.y}
                        stroke={
                            isLabeled
                                ? "var(--color-fd-foreground)"
                                : "var(--color-fd-muted-foreground)"
                        }
                        strokeWidth={isLabeled ? 1.8 : 0.7}
                        strokeLinecap="round"
                    />
                )
            })}

            {/* Labels */}
            {ticks.map(({ angle, label }, i) =>
                label !== null ? (
                    <text
                        key={`l${i}`}
                        x={polar(angle, LABEL_RADIUS).x}
                        y={polar(angle, LABEL_RADIUS).y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="var(--color-fd-foreground)"
                        fontSize={labelFontSize}
                        fontWeight="600"
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                    >
                        {label}
                    </text>
                ) : null,
            )}

            {/* Hand */}
            <line
                x1={handTail.x}
                y1={handTail.y}
                x2={CENTER_X}
                y2={CENTER_Y}
                stroke="var(--color-indigo-400)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <line
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={handTip.x}
                y2={handTip.y}
                stroke="var(--color-indigo-400)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Center cap */}
            <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r="4"
                fill="var(--color-fd-primary)"
            />
            <circle
                cx={CENTER_X}
                cy={CENTER_Y}
                r="1.5"
                fill="var(--color-fd-card)"
            />
        </svg>
    )
}
