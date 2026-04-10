import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          background: '#e4308c',
          color: '#ffffff',
          display: 'flex',
          fontFamily: 'sans-serif',
          fontSize: 18,
          fontWeight: 800,
          height: '100%',
          justifyContent: 'center',
          letterSpacing: '-0.08em',
          width: '100%',
        }}
      >
        LZ
      </div>
    ),
    size
  );
}
