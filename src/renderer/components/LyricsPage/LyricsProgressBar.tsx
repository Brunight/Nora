import React from 'react';

type Props = {
  syncedLyrics: { start: number; end: number };
  delay: number;
};

const LyricsProgressBar = (props: Props) => {
  const { syncedLyrics, delay } = props;
  const myElementRef = React.useRef<HTMLSpanElement>(null);

  const handleLyricsActivity = React.useCallback(
    (e: Event) => {
      if ('detail' in e && typeof e.detail === 'number') {
        const songPosition = e.detail as number;
        const progress =
          songPosition < syncedLyrics.start - delay
            ? '0%'
            : songPosition > syncedLyrics.end - delay
              ? '100%'
              : `${
                  ((songPosition - (syncedLyrics.start - delay)) /
                    (syncedLyrics.end - delay - (syncedLyrics.start - delay))) *
                  100
                }%`;

        if (myElementRef.current) {
          myElementRef.current.style.setProperty('--duration', progress);
        }
      }
    },
    [delay, syncedLyrics.end, syncedLyrics.start],
  );

  React.useEffect(() => {
    document.addEventListener('player/positionChange', handleLyricsActivity);

    return () =>
      document.removeEventListener(
        'player/positionChange',
        handleLyricsActivity,
      );
  }, [handleLyricsActivity]);

  return (
    <span
      ref={myElementRef}
      className="!visible mt-1 block h-1 w-1/2 min-w-[2rem] max-w-[4rem] rounded-md bg-background-color-2 !opacity-100 transition-[visibility,opacity] dark:bg-dark-background-color-2 dark:!opacity-50"
    >
      <span className="block h-full w-[var(--duration)] rounded-md bg-background-color-dimmed transition-[width] duration-300 dark:bg-background-color-dimmed" />
    </span>
  );
};

export default LyricsProgressBar;
