#!/bin/sh
# Regenerates akshaya/index.html (bride-side version) from the main index.html.
# Only the asset paths and share text differ; content comes from akshaya/config.js.
cd "$(dirname "$0")"
sed -e 's|href="styles.css|href="../styles.css|' \
    -e 's|src="script.js|src="../script.js|' \
    -e 's|src="intro.js|src="../intro.js|' \
    -e 's|content="You.re invited to our wedding"|content="Dr Akshaya weds Sreehari"|' \
    index.html > akshaya/index.html
