import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TransitionSeries, springTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';

// ─────────────────────────────────────────────
// Composition constants
// ─────────────────────────────────────────────
export const COMP_WIDTH = 672;
export const COMP_HEIGHT = 610;
export const COMP_FPS = 30;

const T_HOMEPAGE = 120; // 4s
const T_SECTION  = 105; // 3.5s
const T_DARK     = 75;  // 2.5s
const T_DRAW     = 120; // 4s
const T_SOLUTION = 120; // 4s
const T_EXAMPLES = 90;  // 3s

const TRANSITION_FRAMES = 20;
const NUM_TRANSITIONS   = 5;

export const COMP_DURATION_FRAMES =
  T_HOMEPAGE + T_SECTION + T_DARK + T_DRAW + T_SOLUTION + T_EXAMPLES +
  NUM_TRANSITIONS * TRANSITION_FRAMES;

// ─────────────────────────────────────────────
// Coordinate math
// ─────────────────────────────────────────────
// Source video: 1918 × 942
// Content area: 672 × 578 (COMP_HEIGHT − 32px chrome)
// objectFit: cover → scale by height → SCALE = 578/942 ≈ 0.6136
// Displayed width = 1918 × SCALE ≈ 1177px → horizontal overflow ≈ 505px
//
// Canvas position (relative to content area top-left):
//   canvas_x = srcX × SCALE − (objPosX / 100) × OVERFLOW_PX
//   canvas_y = srcY × SCALE
//
// Cursor/click overlays live inside the content div (NOT the chrome bar),
// so canvas_y is already content-relative — NO chrome offset subtraction.

const CHROME_H   = 32;
const CONTENT_H  = COMP_HEIGHT - CHROME_H; // 578
const SRC_W      = 1918;
const SRC_H      = 942;
const SCALE      = CONTENT_H / SRC_H;               // ≈ 0.6136
const DISP_W     = SRC_W * SCALE;                   // ≈ 1177
const OVERFLOW_PX = DISP_W - COMP_WIDTH;            // ≈ 505

function srcToCanvas(srcX: number, srcY: number, objPosX: number): [number, number] {
  return [
    srcX * SCALE - (objPosX / 100) * OVERFLOW_PX,
    srcY * SCALE,
  ];
}

// ─────────────────────────────────────────────
// Browser chrome
// ─────────────────────────────────────────────
const BrowserFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: COMP_WIDTH,
      height: COMP_HEIGHT,
      borderRadius: 8,
      overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
      display: 'flex',
      flexDirection: 'column',
      background: '#1a1a1a',
    }}
  >
    <div
      style={{
        height: CHROME_H,
        background: '#2b2b2b',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 6,
        flexShrink: 0,
        borderBottom: '1px solid #3a3a3a',
      }}
    >
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
      <div
        style={{
          flex: 1,
          background: '#3d3d3d',
          borderRadius: 4,
          height: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 8,
        }}
      >
        <span
          style={{
            color: '#aaa',
            fontSize: 10,
            fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
            letterSpacing: 0.2,
          }}
        >
          shuff57.github.io/bookSHelf/
        </span>
      </div>
    </div>
    {/* Content area — all overlays are positioned relative to THIS div */}
    <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
  </div>
);

// ─────────────────────────────────────────────
// Cursor spotlight
// ─────────────────────────────────────────────
const CursorSpotlight: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <div
    style={{
      position: 'absolute',
      left: x - 26,
      top: y - 26,
      width: 52,
      height: 52,
      borderRadius: '50%',
      background:
        'radial-gradient(circle, rgba(255,220,50,0.55) 0%, rgba(255,220,50,0.20) 45%, transparent 100%)',
      pointerEvents: 'none',
    }}
  />
);

// ─────────────────────────────────────────────
// Click ripple
// ─────────────────────────────────────────────
const RIPPLE_DUR = 28;

const ClickRipple: React.FC<{
  x: number;
  y: number;
  startFrame: number;
  frame: number;
}> = ({ x, y, startFrame, frame }) => {
  const elapsed = frame - startFrame;
  if (elapsed < 0 || elapsed > RIPPLE_DUR) return null;
  const progress = elapsed / RIPPLE_DUR;
  return (
    <>
      {[0, 1].map((i) => {
        const delay = i * 0.28;
        const p = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
        const ep = 1 - (1 - p) ** 2;
        const radius = ep * 52;
        const alpha = (1 - p) * 0.75;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - radius,
              top: y - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: '50%',
              border: `2px solid rgba(255,190,30,${alpha})`,
              pointerEvents: 'none',
            }}
          />
        );
      })}
    </>
  );
};

// ─────────────────────────────────────────────
// Feature callout
// ─────────────────────────────────────────────
const FeatureCallout: React.FC<{
  text: string;
  startFrame: number;
  frame: number;
  fps: number;
}> = ({ text, startFrame, frame, fps }) => {
  const elapsed = frame - startFrame;
  if (elapsed < 0) return null;
  const spr = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 120, mass: 1 },
    durationInFrames: 20,
  });
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        left: '50%',
        transform: `translateX(-50%) translateY(${interpolate(spr, [0, 1], [12, 0])}px)`,
        opacity: interpolate(spr, [0, 1], [0, 1]),
        background: 'rgba(12,12,18,0.90)',
        backdropFilter: 'blur(8px)',
        borderRadius: 8,
        padding: '6px 16px',
        border: '1px solid rgba(255,255,255,0.13)',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontSize: 13,
          fontFamily: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif',
          fontWeight: 500,
          letterSpacing: 0.3,
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ─────────────────────────────────────────────
// Cursor interpolation — SOURCE coordinate keyframes
// ─────────────────────────────────────────────
interface CursorKeyframe {
  f: number;
  srcX: number; // source video X coordinate (0–1918)
  srcY: number; // source video Y coordinate (0–942)
}

function getCursorSrc(
  frame: number,
  keyframes: CursorKeyframe[],
): { srcX: number; srcY: number } {
  if (keyframes.length === 0) return { srcX: 0, srcY: 0 };
  if (frame <= keyframes[0].f)
    return { srcX: keyframes[0].srcX, srcY: keyframes[0].srcY };
  const last = keyframes[keyframes.length - 1];
  if (frame >= last.f) return { srcX: last.srcX, srcY: last.srcY };
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (frame >= a.f && frame <= b.f) {
      const t = (frame - a.f) / (b.f - a.f);
      return {
        srcX: a.srcX + (b.srcX - a.srcX) * t,
        srcY: a.srcY + (b.srcY - a.srcY) * t,
      };
    }
  }
  return { srcX: last.srcX, srcY: last.srcY };
}

// ─────────────────────────────────────────────
// Scene definition
// ─────────────────────────────────────────────
interface SceneDef {
  label: string;
  clipFile: string;
  durationFrames: number;
  playbackRate: number;
  objPosXFrames: Array<{ f: number; x: number }>;
  /** Cursor path in SOURCE VIDEO coordinates (0–1918, 0–942) */
  cursor: CursorKeyframe[];
  /** Click events in SOURCE VIDEO coordinates */
  clicks: Array<{ f: number; srcX: number; srcY: number }>;
  callout?: { text: string; startFrame: number };
}

// ─────────────────────────────────────────────
// VideoScene
// ─────────────────────────────────────────────
const VideoScene: React.FC<{ scene: SceneDef }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Current objectPosition X — animated or static
  const objPosX =
    scene.objPosXFrames.length === 1
      ? scene.objPosXFrames[0].x
      : interpolate(
          frame,
          scene.objPosXFrames.map((k) => k.f),
          scene.objPosXFrames.map((k) => k.x),
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

  // Cursor canvas position — dynamically computed from SOURCE coords + CURRENT objPosX.
  // This makes the spotlight track the source element as the view pans.
  const curSrc = getCursorSrc(frame, scene.cursor);
  const [canvasCurX, canvasCurY] = srcToCanvas(curSrc.srcX, curSrc.srcY, objPosX);
  const cursorOnScreen =
    scene.cursor.length > 0 &&
    canvasCurX >= -10 && canvasCurX <= COMP_WIDTH + 10 &&
    canvasCurY >= -10 && canvasCurY <= CONTENT_H + 10;

  // Helper: objPosX at a given frame (for computing click ripple anchor position)
  const objPosXAt = (f: number) =>
    scene.objPosXFrames.length === 1
      ? scene.objPosXFrames[0].x
      : interpolate(
          f,
          scene.objPosXFrames.map((k) => k.f),
          scene.objPosXFrames.map((k) => k.x),
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );

  return (
    <AbsoluteFill style={{ background: '#111' }}>
      <BrowserFrame>
        {/* Video clip — startFrom=0, no seeking */}
        <OffthreadVideo
          src={staticFile(scene.clipFile)}
          startFrom={0}
          playbackRate={scene.playbackRate}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: `${objPosX}% 0%`,
          }}
          muted
        />

        {/* Cursor spotlight — tracks source element through pan */}
        {cursorOnScreen && <CursorSpotlight x={canvasCurX} y={canvasCurY} />}

        {/* Click ripples — anchored at source coord mapped at click time */}
        {scene.clicks.map((click, i) => {
          const [cx, cy] = srcToCanvas(click.srcX, click.srcY, objPosXAt(click.f));
          return (
            <ClickRipple
              key={i}
              x={cx}
              y={cy}
              startFrame={click.f}
              frame={frame}
            />
          );
        })}

        {/* Feature callout */}
        {scene.callout && (
          <FeatureCallout
            text={scene.callout.text}
            startFrame={scene.callout.startFrame}
            frame={frame}
            fps={fps}
          />
        )}
      </BrowserFrame>
    </AbsoluteFill>
  );
};

// ─────────────────────────────────────────────
// Scene definitions — ALL cursor/click coords in SOURCE VIDEO space
// ─────────────────────────────────────────────
//
// objPosX visible src_x ranges:
//   0%  → src_x 0–1094
//   30% → src_x 247–1342  (draw toolbar, examples dropdown)
//   50% → src_x 411–1506  (homepage center)
//   85% → src_x 699–1794  (dark button @ src≈1470)
//
// Key UI element source coords:
//   Applied Finite Math row center : (750, 248)
//   Dark mode button (nav top-right): (1470, 40)
//   Examples ▼ button (nav)          : (1060, 40)
//   Draw toolbar (bottom)            : (1000, 705)
//   Problem 4 Solution box           : (253, 275)

const SCENES: SceneDef[] = [
  // ── 1: Homepage — cursor hovers course row, it expands ──
  {
    label: 'homepage',
    clipFile: 'videos/clip1-homepage.mp4',
    durationFrames: T_HOMEPAGE,
    playbackRate: 1,
    objPosXFrames: [{ f: 0, x: 50 }],
    cursor: [
      { f: 0,   srcX: 700, srcY: 180 },
      { f: 45,  srcX: 750, srcY: 248 }, // settle on row
      { f: 120, srcX: 750, srcY: 248 },
    ],
    clicks: [],
    callout: { text: 'Student resources, organized', startFrame: 20 },
  },

  // ── 2: Section page — show structured content ──
  {
    label: 'section-page',
    clipFile: 'videos/clip2-section.mp4',
    durationFrames: T_SECTION,
    playbackRate: 1,
    objPosXFrames: [{ f: 0, x: 0 }],
    cursor: [
      { f: 0,  srcX: 400, srcY: 200 },
      { f: 60, srcX: 400, srcY: 360 },
    ],
    clicks: [],
    callout: { text: 'Structured section content', startFrame: 15 },
  },

  // ── 3: Dark mode toggle ──
  //  Fix: start at objPosX=85% (button visible immediately)
  //  Old code animated 0→85 which looked like a jarring pan/zoom
  {
    label: 'dark-mode',
    clipFile: 'videos/clip3-dark.mp4',
    durationFrames: T_DARK,
    playbackRate: 1,
    objPosXFrames: [
      { f: 0,  x: 85 }, // dark button visible from frame 0
      { f: 30, x: 85 }, // hold while cursor settles + clicks
      { f: 65, x: 0  }, // pan back to show dark content
    ],
    // Cursor at dark button in source coords.
    // At objPosX=85%, canvas_x = 1470*SCALE - 0.85*OVERFLOW ≈ 473
    // As objPosX pans back to 0, cursor goes off-screen naturally (correct).
    cursor: [
      { f: 0,  srcX: 1470, srcY: 40 },
      { f: 28, srcX: 1470, srcY: 40 },
    ],
    clicks: [{ f: 22, srcX: 1470, srcY: 40 }],
    callout: { text: 'Dark mode built-in', startFrame: 45 },
  },

  // ── 4: Annotation / draw mode ──
  {
    label: 'draw-mode',
    clipFile: 'videos/clip4-draw.mp4',
    durationFrames: T_DRAW,
    playbackRate: 1.25,
    objPosXFrames: [{ f: 0, x: 30 }],
    // At objPosX=30%, visible src_x = 247–1342
    // Draw toolbar at src (1000, 705) → canvas (462, 432)
    cursor: [
      { f: 0,   srcX: 1000, srcY: 705 }, // draw toolbar button
      { f: 15,  srcX: 1000, srcY: 705 },
      { f: 35,  srcX: 350,  srcY: 350 }, // drawing on content
      { f: 70,  srcX: 650,  srcY: 410 },
      { f: 100, srcX: 450,  srcY: 385 },
      { f: 120, srcX: 580,  srcY: 430 },
    ],
    clicks: [{ f: 10, srcX: 1000, srcY: 705 }],
    callout: { text: 'Annotate directly on content', startFrame: 30 },
  },

  // ── 5: Step-by-step solution expand ──
  {
    label: 'solutions',
    clipFile: 'videos/clip5-solutions.mp4',
    durationFrames: T_SOLUTION,
    playbackRate: 1,
    objPosXFrames: [{ f: 0, x: 0 }],
    // Solution box at src (253, 275) → canvas (155, 169) at objPosX=0%
    cursor: [
      { f: 0,  srcX: 253, srcY: 275 },
      { f: 30, srcX: 253, srcY: 275 },
      { f: 70, srcX: 253, srcY: 330 },
    ],
    clicks: [{ f: 20, srcX: 253, srcY: 275 }],
    callout: { text: 'Step-by-step solutions', startFrame: 20 },
  },

  // ── 6: Examples dropdown ──
  {
    label: 'examples',
    clipFile: 'videos/clip6-examples.mp4',
    durationFrames: T_EXAMPLES,
    playbackRate: 1,
    objPosXFrames: [{ f: 0, x: 30 }],
    // Examples btn at src (1060, 40) → canvas (499, 25) at objPosX=30%
    cursor: [
      { f: 0,  srcX: 1060, srcY: 40  },
      { f: 15, srcX: 1060, srcY: 40  },
      { f: 50, srcX: 1060, srcY: 185 }, // item in dropdown
    ],
    clicks: [{ f: 10, srcX: 1060, srcY: 40 }],
    callout: { text: 'Jump to any example', startFrame: 20 },
  },
];

// ─────────────────────────────────────────────
// Main composition
// ─────────────────────────────────────────────
export const BookshelfPromo: React.FC = () => {
  const transitionConfig = springTiming({
    config: { damping: 200, stiffness: 200, mass: 1 },
    durationInFrames: TRANSITION_FRAMES,
  });

  return (
    <TransitionSeries>
      {SCENES.map((scene, i) => (
        <React.Fragment key={scene.label}>
          <TransitionSeries.Sequence durationInFrames={scene.durationFrames}>
            <VideoScene scene={scene} />
          </TransitionSeries.Sequence>
          {i < SCENES.length - 1 && (
            <TransitionSeries.Transition
              timing={transitionConfig}
              presentation={fade()}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
