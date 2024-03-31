e mogą kolidować z innymi rolami.",
      "help": "Elementy, które mają role=none lub role=presentation, nie mogą kolidować z innymi rolami."
    },
    "region": {
      "description": "Cała treść strony jest objęta przez punkty orientacyjne.",
      "help": "Cała treść strony musi być zawarta w obszarach kluczowych."
    },
    "role-img-alt": {
      "description": "Elementy z [role=\"img\"] mają tekst alternatywny.",
      "help": "Elementy z [role=\"img\"] muszą mieć tekst alternatywny."
    },
    "scope-attr-valid": {
      "description": "Atrybut scope w tabelach jest stosowany poprawnie.",
      "help": "Atrybut scope ma poprawną wartość."
    },
    "scrollable-region-focusable": {
      "description": "Elementy, których treść można przewijać, są osiągalne za pomocą klawiatury.",
      "help": "Obszary przewijane muszą być osiągalne z klawiatury."
    },
    "select-name": {
      "description": "Element select ma dostępną nazwę.",
      "help": "Element select musi mieć dostępną nazwę."
    },
    "server-side-image-map": {
      "description": "Graficzne mapy odnośników (mapy obrazkowe) obsługiwane po stronie serwera nie są używane.",
      "help": "Nie wolno używać map odnośników po stronie serwera."
    },
    "skip-link": {
      "description": "Wszystkie łącza pomijania mają cel przyjmujący fokus.",
      "help": "Cel łącza pomijającego powinien istnieć i przyjmować fokus."
    },
    "svg-img-alt": {
      "description": "Elementy svg z rolami img, graphics-document lub graphics-symbol mają dostępny tekst.",
      "help": "Elementy svg z rolą img mają tekst alternatywny."
    },
    "tabindex": {
      "description": "Wartości atrybutów tabindex nie są większe niż 0.",
      "help": "Elementy nie powinny mieć wartości tabindex większej niż zero."
    },
    "table-duplicate-name": {
      "description": "Tabele nie mają takiego samego streszczenia (summary) i podpisu (caption).",
      "help": "Atrybut summary w tabeli ma inny tekst niż element caption."
    },
    "table-fake-caption": {
      "description": "Tabele używają jako podpisu elementu <caption>.",
      "help": "Komórki danych i nagłówkowe w tabeli danych nie są używane do umieszczania podpisów."
    },
    "td-has-header": {
      "description": "Każda niepusta komórka danych w dużej tabeli ma jeden lub więcej nagłówków tabeli.",
      "help": "Wszystkie niepuste elementy td w tabelach danych większych niż 3 na 3 mają skojarzony nagłówek tabeli."
    },
    "td-headers-attr": {
      "description": "Każda komórka tabeli używająca atrybutu headers odwołuje się do innej komórki w tej tabeli.",
      "help": "Wszystkie komórki z atrybutem headers odnoszą się tylko do innych komórek tej samej tabeli."
    },
    "th-has-data-cells": {
      "description": "Każdy nagłówek tabeli w tabeli danych odnosi się do komórek danych.",
      "help": "Wszystkie elementy th i elementy z role=columnheader/rowheader mają komórki danych, które opisują."
    },
    "valid-lang": {
      "description": "Atrybuty lang mają poprawne wartości.",
      "help": "Atrybuty lang muszą mieć poprawną wartość."
    },
    "video-caption": {
      "description": "Elementy <video> mają napisy rozszerzone.",
      "help": "Elementy <video> muszą mieć napisy rozszerzone."
    }
  },
  "checks": {
    "abstractrole": {
      "pass": "Role abstrakcyjne nie są wykorzystywane.",
      "fail": {
        "singular": "Rola abstrakcyjna nie może być użyta bezpośrednio: ${data.values}.",
        "plural": ": Role abstrakcyjne nie mogą być używane bezpośrednio: ${data.values}."
      }
    },
    "aria-allowed-attr": {
      "pass": "Atrybuty ARIA są używane poprawnie dla zdefiniowanej roli.",
      "fail": {
        "singular": "Atrybut ARIA nie jest dozwolony: ${data.values}.",
        "plural": ": Atrybuty ARIA nie są dozwolone: ${data.values}."
      }
    },
    "aria-allowed-role": {
      "pass": "Rola ARIA jest dozwolona dla danego elementu.",
      "fail": {
        "singular": "Rola ARIA ${data.values} ni