import { Composition } from 'remotion';
import { BookshelfPromo, COMP_WIDTH, COMP_HEIGHT, COMP_FPS, COMP_DURATION_FRAMES } from './BookshelfPromo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BookshelfPromo"
        component={BookshelfPromo}
        durationInFrames={COMP_DURATION_FRAMES}
        fps={COMP_FPS}
        width={COMP_WIDTH}
        height={COMP_HEIGHT}
        defaultProps={{}}
      />
    </>
  );
};
