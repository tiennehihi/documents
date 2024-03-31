 Forventet kontrastforhold er ${data.expectedContrastRatio}",
      "incomplete": {
        "bgImage": "Elementets bakgrunnsfarge kunne ikke detekteres på grunn av et bakgrunnsbildet",
        "bgGradient": "Elementets bakgrunnsfarge kunne ikke detekteres på grunn av en bakgrunnsgradient",
        "imgNode": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi elementet inneholder et bildeelement",
        "bgOverlap": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det er overlappet av et annet element",
        "fgAlpha": "Elementets forgrunnsfarge kunne ikke detekteres på grunn av dets gjennomsiktighet",
        "elmPartiallyObscured": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det er delvist dekket av et annet element",
        "elmPartiallyObscuring": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det delvist dekker et annet element",
        "outsideViewport": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det er utenfor sidens 'viewport'",
        "equalRatio": "Elementet har et 1:1-kontrastforhold med bakgrunnen",
        "shortTextContent": "Elementets innhold er for kort til å kunne avgjøre om innholdet faktisk er tekst",
        "default": "Kan ikke regne ut kontrastforhold"
      }
    },
    "color-contrast-enhanced": {
      "pass": "Elementet har tilstrekkelig fargekontrast, den er ${data.contrastRatio}",
      "fail": "Elementet har ikke god nok fargekontrast, den er ${data.contrastRatio} (forgrunnsfarge: ${data.fgColor}, bakgrunnsfarge: ${data.bgColor}, tekststørrelse: ${data.fontSize}, teksttykkelse: ${data.fontWeight}). Forventet kontrastforhold er ${data.expectedContrastRatio}",
      "incomplete": {
        "bgImage": "Elementets bakgrunnsfarge kunne ikke detekteres på grunn av et bakgrunnsbilde",
        "bgGradient": "Elementets bakgrunnsfarge kunne ikke detekteres på grunn av en bakgrunnsgradient",
        "imgNode": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi elementet inneholder et bildeelement",
        "bgOverlap": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det er overlappet av et annet element",
        "fgAlpha": "Elementets forgrunnsfarge kunne ikke detekteres på grunn av dets gjennomsiktighet",
        "elmPartiallyObscured": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det er delvist dekket av et annet element",
        "elmPartiallyObscuring": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det delvist dekker et annet element",
        "outsideViewport": "Elementets bakgrunnsfarge kunne ikke detekteres, fordi det er utenfor sidens 'viewport'",
        "equalRatio": "Elementet har et 1:1-kontrastforhold med bakgrunnen",
        "shortTextContent": "Elementets innhold er for kort til å kunne avgjøre om innholdet faktisk er tekst",
        "default": "Kan ikke regne ut kontrastforhold"
      }
    },
    "link-in-text-block": {
      "pass": "Lenker kan adskilles fra den omkringliggende tekst på annen måte enn med farge",
      "fail": "Lenker må skille seg ut fra den omkringliggende tekst på annen måte enn med farge",
      "incomplete": {
        "bgContrast": "Elementets kontrastforhold kunne ikke detekteres. Sjekk for spesifikk 'hover'/'focus' styling",
        "bgImage": "Elementets kontrastforhold kunne ikke detekteres på grunn av et bakgrunnsbilde",
        "bgGradient": "Elementets kontrastforhold kunne ikke detekteres på grunn av en bakgrunnsgradient",
        "imgNode": "Elementets kontrastforhold kunne ikke detekteres, fordi elementet inneholder et bildeelement",
        "bgOverlap": "Elementets kontrastforhold kunne ikke detekteres på grunn av overlappende elementer",
        "default": "Kan ikke regne ut kontrastforhold"
      }
    },
    "autocomplete-appropriate": {
      "pass": "'autocomplete'-verdien er brukt på et passende element",
      "fail": "'autocomplete'-verdien er