        "bgImage": "Elementets baggrundsfarve kunne ikke detekteres på grund af et baggrundsbillede",
        "bgGradient": "Elementets baggrundsfarve kunne ikke detekteres på grund af en baggrundsgradient",
        "imgNode": "Elementets baggrundsfarve kunne ikke detekteres, fordi elementet indeholder et billedelement",
        "bgOverlap": "Elementets baggrundsfarve kunne ikke detekteres, fordi det er overlappet af et andet element",
        "fgAlpha": "Elementets forgrundsfarve kunne ikke detekteres på grund af dets gennemsigtighed",
        "elmPartiallyObscured": "Elementets baggrundsfarve kunne ikke detekteres, fordi det er delvist dækket af et andet element",
        "elmPartiallyObscuring": "Elementets baggrundsfarve kunne ikke detekteres, fordi det delvist dækker et andet element",
        "outsideViewport": "Elementets baggrundsfarve kunne ikke detekteres, fordi det er udenfor sidens 'viewport'",
        "equalRatio": "Elementet har et 1:1-kontrastforhold med baggrunden",
        "shortTextContent": "Elementets indhold er for kort til at kunne afgøre, om indholdet ren faktisk ER tekst",
        "default": "Kan ikke udregne kontrastforhold"
      }
    },
    "color-contrast-enhanced": {
      "pass": "Elementet har stor farvekontrast, den er ${data.contrastRatio}",
      "fail": "Elementet har ikke nok farvekontrast, den er ${data.contrastRatio} (forgrundsfarve: ${data.fgColor}, baggrundsfarve: ${data.bgColor}, tekststørrelse: ${data.fontSize}, teksttykkelse: ${data.fontWeight}). Forventet kontrastforhold er ${data.expectedContrastRatio}",
      "incomplete": {
        "bgImage": "Elementets baggrundsfarve kunne ikke detekteres på grund af et baggrundsbillede",
        "bgGradient": "Elementets baggrundsfarve kunne ikke detekteres på grund af en baggrun