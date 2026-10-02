# Official GrowthWorks Systems artwork

The original user-supplied `growthworks-logo.png` already contains a genuine transparent alpha channel. This revision regenerates the 280 x 222 WebP from that original instead of trying to remove the cream color from the flattened derivative. A compact 32-color palette preserves the artwork's maroon/dark appearance; there is no inversion, replacement mark or rectangular backing.

The header, footer and thank-you page share the same transparent asset. The CSS removes the cream tile, border and padding. A subpixel edge shadow provides subtle separation from the dark page without a new background.

`../../src/app/favicon.ico` contains transparent 16 x 16 and 32 x 32 versions of the original emblem, without the small wordmark. Next.js serves it across the generic, affiliate and thank-you routes.

Source PNG: 561 x 445, SHA-256 `fc104228a3bcfe972bd10545cc6cb6cc6e1ce59a1184d4b99eed12f5ea92ab68`.
