import React from 'react';
import cx from 'classnames';
import { area, stack as d3stack } from 'd3-shape';

function callOrValue(maybeFn, d, i) {
  if (typeof maybeFn === 'function') {
    return maybeFn(d,i);
  }
  return maybeFn;
}


export default ({
  className,
  top = 0,
  left = 0,
  keys,
  data,
  curve,
  defined,
  x,
  x0,
  x1,
  y0,
  y1,
  glyph,
  reverse = false,
  ...restProps,
}) => {
  const stack = d3stack();
  if (keys) stack.keys(keys);

  const path = area();
  if (x) path.x(x);
  if (x0) path.x0(x0);
  if (x1) path.x1(x1);
  if (y0) path.y0(y0);
  if (y1) path.y1(y1);
  if (curve) path.curve(curve);
  if (defined) path.defined(defined);

  const seriesData = stack(data);
  if (reverse) seriesData.reverse();

  return (
    <g>
      {seriesData.map((series, i) => {
        return (
          <path
            className={cx('vx-area-stack', className)}
            key={`area-stack-${i}-${series.key || ''}`}
            d={path(series)}
            {...Object.keys(restProps).reduce((ret, cur) => {
              ret[cur] = callOrValue(restProps[cur], series[i], i, series);
              return ret;
            }, {})}
          />
        );
      })}
      {!!glyph &&
        <g className='vx-area-stack-glyphs'>
          {data.map(glyph)}
        </g>
      }
    </g>
  );
}
