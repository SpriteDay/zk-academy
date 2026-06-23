"use client"

import { useId, useMemo } from "react"

export interface ModuloClockProps {
    base: number
    value: number
    tickCount?: number
    labelEvery?: number
}

function round(n: number) {
    return Math.round(n * 100) / 100
}

export function ModuloClock({
    base,
    value,
    tickCount: tickCountProp,
    labelEvery: labelEveryProp,
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
                ? String(tickValue === 0 ? base : tickValue)
                : null
            return { angle, label, isLabeled }
        })
    }, [tickCount, base, labelEvery])

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

    const CX = 100
    const CY = 100
    const BEZEL_R = 93
    const FACE_R = 88
    const TICK_OUTER = 84
    const TICK_MINOR = 79.5
    const TICK_MAJOR = 75.5
    const LABEL_R = 65
    const HAND_LEN = 57
    const TAIL_LEN = 14

    function polar(deg: number, r: number) {
        const rad = ((deg - 90) * Math.PI) / 180
        return {
            x: round(CX + r * Math.cos(rad)),
            y: round(CY + r * Math.sin(rad)),
        }
    }

    const handRad = ((handAngle - 90) * Math.PI) / 180
    const handTip = {
        x: round(CX + HAND_LEN * Math.cos(handRad)),
        y: round(CY + HAND_LEN * Math.sin(handRad)),
    }
    const handTail = {
        x: round(CX - TAIL_LEN * Math.cos(handRad)),
        y: round(CY - TAIL_LEN * Math.sin(handRad)),
    }

    const depthId = `depth-${id}`

    return (
        <svg
            viewBox="0 0 200 200"
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
            <circle cx={CX} cy={CY} r={BEZEL_R} fill="var(--color-fd-border)" />

            {/* Face */}
            <circle cx={CX} cy={CY} r={FACE_R} fill="var(--color-fd-card)" />
            <circle cx={CX} cy={CY} r={FACE_R} fill={`url(#${depthId})`} />

            {/* Tick lines */}
            {ticks.map(({ angle, isLabeled }, i) => {
                const p1 = polar(angle, TICK_OUTER)
                const p2 = polar(angle, isLabeled ? TICK_MAJOR : TICK_MINOR)
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
                        x={polar(angle, LABEL_R).x}
                        y={polar(angle, LABEL_R).y}
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
                x2={CX}
                y2={CY}
                stroke="var(--color-fd-primary)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <line
                x1={CX}
                y1={CY}
                x2={handTip.x}
                y2={handTip.y}
                stroke="var(--color-fd-primary)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Center cap */}
            <circle cx={CX} cy={CY} r="4" fill="var(--color-fd-primary)" />
            <circle cx={CX} cy={CY} r="1.5" fill="var(--color-fd-card)" />
        </svg>
    )
}
