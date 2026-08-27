"use client";

/**
 * 4 distinct hue backgrounds for the Kahoot-style mobile grid.
 * Each position has a different HUE (not just shade) to enable
 * instant visual identification — the core Kahoot pattern.
 *
 * Colors are dark/muted to match the existing deep aesthetic:
 * - Position 0: Deep purple (existing --color-surface)
 * - Position 1: Dark teal (derived from --color-neon-secondary family)
 * - Position 2: Dark amber/copper (derived from --color-neon-primary family)
 * - Position 3: Dark navy (blue family)
 */
const OPTION_BACKGROUNDS = [
  "#1d1b35", // deep purple
  "#1a3a3a", // dark teal
  "#3d2a1a", // dark amber/copper
  "#1a2540", // dark navy
];

/**
 * Centered grid for 3 options: 2 on top, 1 centered below.
 * The third option uses col-span-2 + justify-self-center
 * so it sits between the two columns above.
 */
function ThreeOptionGrid({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {/* Row 1: first two options */}
      <MobileOptionBlock
        option={options[0]}
        index={0}
        selected={value === 0}
        onChange={onChange}
      />
      <MobileOptionBlock
        option={options[1]}
        index={1}
        selected={value === 1}
        onChange={onChange}
      />
      {/* Row 2: third option centered */}
      <div className="col-span-2 flex justify-center">
        <div className="w-[calc(50%-6px)]">
          <MobileOptionBlock
            option={options[2]}
            index={2}
            selected={value === 2}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Standard 2-column grid for 2 options.
 */
function TwoOptionGrid({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 px-4">
      {options.map((option, index) => (
        <MobileOptionBlock
          key={index}
          option={option}
          index={index}
          selected={value === index}
          onChange={onChange}
        />
      ))}
    </div>
  );
}

/**
 * Kahoot-style mobile option block.
 * Solid color background, centered text, tap to select.
 * No images, no scrim, no letter badge.
 */
function MobileOptionBlock({
  option,
  index,
  selected,
  onChange,
}: {
  option: string;
  index: number;
  selected: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <button
      type="button"
      data-option={index}
      data-selected={selected}
      onClick={() => {
        // Haptic feedback — free on mobile, no-op on desktop
        if (navigator.vibrate) {
          navigator.vibrate(10);
        }
        onChange(index);
      }}
      aria-label={`${option} — opción ${String.fromCharCode(65 + index)}`}
      aria-pressed={selected}
      className="flex items-center justify-center text-center p-4 aspect-[4/3] rounded-2xl font-black text-lg transition-all duration-200 cursor-pointer overflow-hidden"
      style={{
        backgroundColor: OPTION_BACKGROUNDS[index] ?? OPTION_BACKGROUNDS[0],
      }}
    >
      <span className="text-[var(--color-text-primary)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] line-clamp-2">
        {option}
      </span>
    </button>
  );
}

/**
 * Mobile-only Kahoot-style grid for question options.
 * Renders 2-column grid with distinct hue blocks.
 * Handles 2 and 3 option layouts.
 *
 * This component is ONLY rendered on mobile (< 640px).
 * Desktop rendering is handled by OptionCard in QuestionCard.tsx.
 */
export default function MobileOptionGrid({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: number | undefined;
  onChange: (value: number) => void;
}) {
  const visible = options.slice(0, 4);

  if (visible.length === 3) {
    return (
      <ThreeOptionGrid
        options={visible}
        value={value}
        onChange={onChange}
      />
    );
  }

  return (
    <TwoOptionGrid
      options={visible}
      value={value}
      onChange={onChange}
    />
  );
}
