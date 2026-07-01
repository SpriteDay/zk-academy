"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { KeyRound } from "lucide-react"
import { useId } from "react"
import {
    Channel,
    Chip,
    Device,
    DEVICE_WIDTH,
    LEFT_DEVICE_X,
    RIGHT_DEVICE_X,
    sideArcPath,
    SideArc,
    SpeakerWaves,
    STAGE_WIDTH,
} from "./shared/exchange-stage"

const STAGE_HEIGHT = 224
const DEVICE_Y = 92
const CHANNEL_Y = DEVICE_Y + 59
const ARC_LIFT = 64
const ARC_Y = DEVICE_Y - 4

const LEFT_TOP_X = LEFT_DEVICE_X + DEVICE_WIDTH / 2
const RIGHT_TOP_X = RIGHT_DEVICE_X + DEVICE_WIDTH / 2

const CIPHER_A = "9#4∆7%"
const CIPHER_B = "3§8×5?"

interface KeyExchangeMeetupProps {
    partyA?: string
    partyB?: string
}

export function KeyExchangeMeetup({
    partyA = "Bonnie",
    partyB = "Clyde",
}: KeyExchangeMeetupProps) {
    const rawId = useId()
    const id = rawId.replace(/:/g, "")
    const keyAnimId = `key-${id}`
    const msg1AnimId = `msg1-${id}`
    const msg2AnimId = `msg2-${id}`

    const keyBegin = `0.8s;${msg2AnimId}.end+2.6s`
    const msg1Begin = `${keyAnimId}.end+0.9s`
    const msg2Begin = `${msg1AnimId}.end+0.7s`

    const arcPath = sideArcPath(LEFT_TOP_X, ARC_Y, RIGHT_TOP_X, ARC_Y, ARC_LIFT)
    const msg1Path = `M ${LEFT_DEVICE_X + DEVICE_WIDTH + 18} ${CHANNEL_Y} L ${RIGHT_DEVICE_X - 18} ${CHANNEL_Y}`
    const msg2Path = `M ${RIGHT_DEVICE_X - 18} ${CHANNEL_Y} L ${LEFT_DEVICE_X + DEVICE_WIDTH + 18} ${CHANNEL_Y}`

    return (
        <Card>
            <CardHeader>
                <CardTitle>Key exchange, the old way</CardTitle>
                <CardDescription>
                    Meet in private, then talk in public
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <svg
                    viewBox={`0 0 ${STAGE_WIDTH} ${STAGE_HEIGHT}`}
                    className="mx-auto block w-full max-w-xl"
                    role="img"
                    aria-label={`${partyA} and ${partyB} exchange a secret key over a private side channel, then send encrypted messages over a public channel`}
                >
                    {/* Private side channel: grey when idle, green while the key travels */}
                    <SideArc
                        x1={LEFT_TOP_X}
                        y1={ARC_Y}
                        x2={RIGHT_TOP_X}
                        y2={ARC_Y}
                        lift={ARC_LIFT}
                    />
                    <SideArc
                        x1={LEFT_TOP_X}
                        y1={ARC_Y}
                        x2={RIGHT_TOP_X}
                        y2={ARC_Y}
                        lift={ARC_LIFT}
                        className="stroke-emerald-600 dark:stroke-emerald-400"
                        baseOpacity={0}
                    >
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.1;0.9;1"
                            begin={keyBegin}
                            dur="2.6s"
                        />
                    </SideArc>
                    <text
                        x={STAGE_WIDTH / 2}
                        y={ARC_Y - ARC_LIFT * 0.75 - 12}
                        textAnchor="middle"
                        fontSize={9.5}
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                        className="fill-fd-muted-foreground"
                    >
                        sharing in the private alley
                    </text>

                    {/* Public channel: lights up in the speaker's color */}
                    <Channel
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        x2={RIGHT_DEVICE_X}
                        y={CHANNEL_Y}
                    />
                    <line
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        y1={CHANNEL_Y}
                        x2={RIGHT_DEVICE_X}
                        y2={CHANNEL_Y}
                        strokeWidth={6.5}
                        strokeLinecap="round"
                        opacity={0}
                        className="stroke-indigo-400/50 dark:stroke-indigo-400/40"
                    >
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.12;0.88;1"
                            begin={msg1Begin}
                            dur="2s"
                        />
                    </line>
                    <line
                        x1={LEFT_DEVICE_X + DEVICE_WIDTH}
                        y1={CHANNEL_Y}
                        x2={RIGHT_DEVICE_X}
                        y2={CHANNEL_Y}
                        strokeWidth={6.5}
                        strokeLinecap="round"
                        opacity={0}
                        className="stroke-amber-400/50 dark:stroke-amber-400/40"
                    >
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.12;0.88;1"
                            begin={msg2Begin}
                            dur="2s"
                        />
                    </line>

                    {/* Speaking out loud */}
                    <SpeakerWaves
                        x={LEFT_DEVICE_X + DEVICE_WIDTH + 10}
                        y={CHANNEL_Y}
                        facing="right"
                        tone="indigo"
                        baseOpacity={0}
                    >
                        <animate
                            attributeName="opacity"
                            values="0;0.9;0.9;0"
                            keyTimes="0;0.12;0.88;1"
                            begin={msg1Begin}
                            dur="2s"
                        />
                    </SpeakerWaves>
                    <SpeakerWaves
                        x={RIGHT_DEVICE_X - 10}
                        y={CHANNEL_Y}
                        facing="left"
                        tone="amber"
                        baseOpacity={0}
                    >
                        <animate
                            attributeName="opacity"
                            values="0;0.9;0.9;0"
                            keyTimes="0;0.12;0.88;1"
                            begin={msg2Begin}
                            dur="2s"
                        />
                    </SpeakerWaves>

                    <Device
                        x={LEFT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyA}
                        tone="indigo"
                        hiddenRows={3}
                    />
                    <Device
                        x={RIGHT_DEVICE_X}
                        y={DEVICE_Y}
                        name={partyB}
                        tone="amber"
                        hiddenRows={3}
                    />

                    {/* Secret key traveling the private side channel */}
                    <g opacity="0">
                        <circle
                            r={9}
                            className="fill-emerald-600 dark:fill-emerald-500"
                        />
                        <KeyRound
                            x={-5.5}
                            y={-5.5}
                            width={11}
                            height={11}
                            strokeWidth={2.2}
                            className="text-white"
                        />
                        <animateMotion
                            id={keyAnimId}
                            begin={keyBegin}
                            dur="2.6s"
                            path={arcPath}
                            calcMode="spline"
                            keySplines="0.4 0 0.6 1"
                            keyTimes="0;1"
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.07;0.93;1"
                            begin={keyBegin}
                            dur="2.6s"
                        />
                    </g>

                    {/* Encrypted messages over the public channel */}
                    <Chip x={0} y={0} text={CIPHER_A} baseOpacity={0}>
                        <animateMotion
                            id={msg1AnimId}
                            begin={msg1Begin}
                            dur="2s"
                            path={msg1Path}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.07;0.93;1"
                            begin={msg1Begin}
                            dur="2s"
                        />
                    </Chip>
                    <Chip x={0} y={0} text={CIPHER_B} baseOpacity={0}>
                        <animateMotion
                            id={msg2AnimId}
                            begin={msg2Begin}
                            dur="2s"
                            path={msg2Path}
                        />
                        <animate
                            attributeName="opacity"
                            values="0;1;1;0"
                            keyTimes="0;0.07;0.93;1"
                            begin={msg2Begin}
                            dur="2s"
                        />
                    </Chip>
                </svg>
            </CardContent>
        </Card>
    )
}
