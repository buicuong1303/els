/* eslint-disable @typescript-eslint/no-explicit-any */

interface SvgIconProps {
  width?: number;
  height?: number;
}

const LogoIcon = (props: SvgIconProps) => {
  const { width = 60, height = 60 } = props;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
      <rect y="0.339844" width={width} height={height} rx="30" fill="url(#pattern0)"/>
      <defs>
        <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_1725_10505" transform="translate(0 -0.00195312) scale(0.00390625)"/>
        </pattern>
        <image id="image0_1725_10505" width="256" height="257" xlinkHref="data:image/png;base64,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"/>
      </defs>
    </svg>
  );
};

export { LogoIcon };