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

    const centerX = 100
    const centerY = 100
    const bezelRadius = 93
    const faceRadius = 88
    const tickOuterRadius = 84
    const tickMinorInnerRadius = 79.5
    const tickMajorInnerRadius = 75.5
    const labelRadius = 65
    const handLength = 57
    const handTailLength = 14

    function polar(deg: number, r: number) {
        const rad = ((deg - 90) * Math.PI) / 180
        return {
            x: round(centerX + r * Math.cos(rad)),
            y: round(centerY + r * Math.sin(rad)),
        }
    }

    const handRad = ((handAngle - 90) * Math.PI) / 180
    const handTip = {
        x: round(centerX + handLength * Math.cos(handRad)),
        y: round(centerY + handLength * Math.sin(handRad)),
    }
    const handTail = {
        x: round(centerX - handTailLength * Math.cos(handRad)),
        y: round(centerY - handTailLength * Math.sin(handRad)),
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
            <circle
                cx={centerX}
                cy={centerY}
                r={bezelRadius}
                fill="var(--color-fd-border)"
            />

            {/* Face */}
            <circle
                cx={centerX}
                cy={centerY}
                r={faceRadius}
                fill="var(--color-fd-card)"
            />
            <circle
                cx={centerX}
                cy={centerY}
                r={faceRadius}
                fill={`url(#${depthId})`}
            />

            {/* Tick lines */}
            {ticks.map(({ angle, isLabeled }, i) => {
                const p1 = polar(angle, tickOuterRadius)
                const p2 = polar(
                    angle,
                    isLabeled ? tickMajorInnerRadius : tickMinorInnerRadius,
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
                        x={polar(angle, labelRadius).x}
                        y={polar(angle, labelRadius).y}
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
                x2={centerX}
                y2={centerY}
                stroke="var(--color-fd-primary)"
                strokeWidth="3"
                strokeLinecap="round"
            />
            <line
                x1={centerX}
                y1={centerY}
                x2={handTip.x}
                y2={handTip.y}
                stroke="var(--color-fd-primary)"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Center cap */}
            <circle
                cx={centerX}
                cy={centerY}
                r="4"
                fill="var(--color-fd-primary)"
            />
            <circle
                cx={centerX}
                cy={centerY}
                r="1.5"
                fill="var(--color-fd-card)"
            />
        </svg>
    )
}
