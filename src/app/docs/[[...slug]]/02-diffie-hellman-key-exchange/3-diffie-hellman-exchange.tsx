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
import { useState, type ReactNode } from "react"
import { HTML_TEXT_TONE, type Tone } from "./shared/exchange-stage"
import { modPow } from "./shared/mod-math"
import {
    ExchangeScene,
    StagePanel,
    StageStepper,
} from "./shared/staged-exchange"

const DEFAULT_G = 5
const DEFAULT_P = 23
const DEFAULT_A = 6
const DEFAULT_B = 15

const STEP_LABELS = [
    "Public numbers",
    "Private secrets",
    "Mix and send",
    "Shared key",
]

function SliderControl({
    label,
    symbol,
    tone,
    value,
    defaultValue,
    min,
    max,
    onChange,
}: {
    label: ReactNode
    symbol: string
    tone: Tone
    value: number
    defaultValue: number
    min: number
    max: number
    onChange: (value: number) => void
}) {
    return (
        <div className="flex w-full flex-col items-center gap-4 md:w-1/2">
            <Label>
                <span>
                    {label} (
                    <span className={HTML_TEXT_TONE[tone]}>{symbol}</span>
                    ):{" "}
                    <span
                        className={`font-bold tabular-nums ${HTML_TEXT_TONE[tone]}`}
                    >
                        {value}
                    </span>
                </span>
            </Label>
            <WideSlider
                defaultValue={[defaultValue]}
                onValueChange={(v) => onChange(v as number)}
                min={min}
                max={max}
                step={1}
                className="mx-auto w-full"
            />
        </div>
    )
}

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
    const [step, setStep] = useState(0)
    const [replays, setReplays] = useState(0)

    const publicA = Number(modPow(BigInt(g), BigInt(a), BigInt(p)))
    const publicB = Number(modPow(BigInt(g), BigInt(b), BigInt(p)))
    const sharedKey = Number(modPow(BigInt(publicB), BigInt(a), BigInt(p)))

    const titles = [
        "Agree on public numbers",
        "Pick private secrets",
        "Mix, then swap in public",
        "Arrive at the same key",
    ]

    const descriptions: ReactNode[] = [
        <p key="0">
            {partyA} and {partyB} agree on a generator{" "}
            <span className={HTML_TEXT_TONE.rose}>g</span> and a modulus{" "}
            <span className={HTML_TEXT_TONE.rose}>p</span> — right over the open
            wire. Anyone listening learns both, and that is fine: these are
            meant to be public.
        </p>,
        <p key="1">
            Each of them rolls a number and keeps it to themselves.{" "}
            <span className={HTML_TEXT_TONE.indigo}>a</span> never leaves{" "}
            {partyA}&apos;s device,{" "}
            <span className={HTML_TEXT_TONE.amber}>b</span> never leaves{" "}
            {partyB}&apos;s. The wire stays silent.
        </p>,
        <div key="2" className="space-y-1.5">
            <p>
                Each device mixes its secret into the public numbers and sends
                only the result. Undoing the mix is the hard problem from above.
            </p>
            <div className="space-y-0.5 font-mono text-xs">
                <div>
                    <span className={HTML_TEXT_TONE.indigo}>A</span> = g
                    <sup>a</sup> mod p = {g}
                    <sup className={HTML_TEXT_TONE.indigo}>{a}</sup> mod {p} ={" "}
                    <span className="font-bold">{publicA}</span>
                </div>
                <div>
                    <span className={HTML_TEXT_TONE.amber}>B</span> = g
                    <sup>b</sup> mod p = {g}
                    <sup className={HTML_TEXT_TONE.amber}>{b}</sup> mod {p} ={" "}
                    <span className="font-bold">{publicB}</span>
                </div>
            </div>
        </div>,
        <div key="3" className="space-y-1.5">
            <p>
                Each raises the mix they received to their own secret. Both land
                on the same number — computed on each device, never sent:
            </p>
            <div className="space-y-0.5 font-mono text-xs">
                <div>
                    {partyA}: B<sup className={HTML_TEXT_TONE.indigo}>a</sup>{" "}
                    mod p = {publicB}
                    <sup className={HTML_TEXT_TONE.indigo}>{a}</sup> mod {p} ={" "}
                    <span className={`font-bold ${HTML_TEXT_TONE.emerald}`}>
                        {sharedKey}
                    </span>
                </div>
                <div>
                    {partyB}: A<sup className={HTML_TEXT_TONE.amber}>b</sup> mod
                    p = {publicA}
                    <sup className={HTML_TEXT_TONE.amber}>{b}</sup> mod {p} ={" "}
                    <span className={`font-bold ${HTML_TEXT_TONE.emerald}`}>
                        {sharedKey}
                    </span>
                </div>
            </div>
            <p>
                It works because (g<sup>a</sup>)<sup>b</sup> and (g
                <sup>b</sup>)<sup>a</sup> are both g<sup>ab</sup>.
            </p>
        </div>,
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mixing secrets in the open</CardTitle>
                <CardDescription>
                    No side channel anymore — step through the exchange
                </CardDescription>
            </CardHeader>
            <CardContent className="py-2">
                <div className="flex flex-col items-center gap-3 md:flex-row md:gap-2">
                    <ExchangeScene
                        step={step}
                        playKey={`${step}-${replays}-${g}-${p}-${a}-${b}`}
                        partyA={partyA}
                        partyB={partyB}
                        ariaLabel={`Diffie-Hellman exchange, step ${step + 1} of 4: ${partyA} and ${partyB} derive the same shared key over a public channel`}
                        gChip={`g = ${g}`}
                        pChip={`p = ${p}`}
                        secretA={`a = ${a}`}
                        secretB={`b = ${b}`}
                        mixA={`A = ${publicA}`}
                        mixB={`B = ${publicB}`}
                        keyText={`K = ${sharedKey}`}
                        keyChip={`K = ${sharedKey} — never sent`}
                    />
                    <StageStepper
                        labels={STEP_LABELS}
                        step={step}
                        onStepChange={setStep}
                    />
                </div>
            </CardContent>
            <CardFooter className="flex-col items-stretch gap-3 text-sm">
                <StagePanel
                    step={step}
                    title={titles[step]}
                    onStepChange={setStep}
                    onReplay={() => setReplays((n) => n + 1)}
                >
                    {descriptions[step]}
                </StagePanel>
                {step === 0 && (
                    <div className="flex w-full flex-col gap-4 md:flex-row">
                        <SliderControl
                            label="Public generator"
                            symbol="g"
                            tone="rose"
                            value={g}
                            defaultValue={DEFAULT_G}
                            min={2}
                            max={12}
                            onChange={setG}
                        />
                        <SliderControl
                            label="Public modulus"
                            symbol="p"
                            tone="rose"
                            value={p}
                            defaultValue={DEFAULT_P}
                            min={2}
                            max={30}
                            onChange={setP}
                        />
                    </div>
                )}
                {step === 1 && (
                    <div className="flex w-full flex-col gap-4 md:flex-row">
                        <SliderControl
                            label={`${partyA}'s secret`}
                            symbol="a"
                            tone="indigo"
                            value={a}
                            defaultValue={DEFAULT_A}
                            min={1}
                            max={24}
                            onChange={setA}
                        />
                        <SliderControl
                            label={`${partyB}'s secret`}
                            symbol="b"
                            tone="amber"
                            value={b}
                            defaultValue={DEFAULT_B}
                            min={1}
                            max={24}
                            onChange={setB}
                        />
                    </div>
                )}
            </CardFooter>
        </Card>
    )
}
