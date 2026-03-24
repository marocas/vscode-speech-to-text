#!/usr/bin/env python3
"""Generate a 16x16 PNG microphone template image for macOS tray."""
import base64, struct, zlib

def create_png(width, height, pixels):
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)
        return struct.pack('>I', len(data)) + c + crc
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    raw = b''
    for y in range(height):
        raw += b'\x00'
        for x in range(width):
            raw += bytes(pixels[y][x])
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

T = (0, 0, 0, 0)
B = (0, 0, 0, 255)

# 16x16 mic icon
pixels = [
    [T,T,T,T,T,T,B,B,B,B,T,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,B,B,T,B,B,B,B,T,B,B,T,T,T],
    [T,T,T,B,T,T,T,B,B,T,T,T,B,T,T,T],
    [T,T,T,T,B,B,B,B,B,B,B,B,T,T,T,T],
    [T,T,T,T,T,T,T,B,B,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,B,B,T,T,T,T,T,T,T],
    [T,T,T,T,T,B,B,B,B,B,B,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
    [T,T,T,T,T,T,T,T,T,T,T,T,T,T,T,T],
]

png_data = create_png(16, 16, pixels)

# Save as file
with open('public/image/trayTemplate.png', 'wb') as f:
    f.write(png_data)

# Also print base64
b64 = base64.b64encode(png_data).decode()
print(f'data:image/png;base64,{b64}')
print(f'\nSaved to public/image/trayTemplate.png ({len(png_data)} bytes)')
